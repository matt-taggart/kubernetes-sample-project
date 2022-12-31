import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import cors from "kcors";
import logger from "koa-pino-logger";
import Boom from "@hapi/boom";
import ON_DEATH from "death";
import { Queue } from "bullmq";
import { errorHandler } from "#middleware/errorHandler.mjs";

const app = new Koa();
const router = new Router();

const { PORT = 8080 } = process.env;
const myQueue = new Queue("foo");

app.use(bodyParser());
app.use(cors());
app.use(logger());
app.use(errorHandler());
app.use(router.routes());
app.use(
  router.allowedMethods({
    throw: true,
    notImplemented: () => Boom.notImplemented(),
    methodNotAllowed: () => Boom.methodNotAllowed(),
  })
);

router.get("/healthz", (ctx) => {
  ctx.body = "success";
});

const server = app.listen(PORT);

async function addJobs() {
  await myQueue.add("myJobName", { foo: "bar" });
  await myQueue.add("myJobName", { qux: "baz" });
}

await addJobs();

ON_DEATH(() => {
  server.close();
  process.exit(0);
});
