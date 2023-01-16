import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import cors from "kcors";
import logger from "koa-pino-logger";
import Boom from "@hapi/boom";
import ON_DEATH from "death";
import { Queue, QueueEvents } from "bullmq";
import { errorHandler } from "#middleware/errorHandler.mjs";
import { verifyJwt } from "#middleware/verifyJwt.mjs";
import { REDIS_CONNECTION } from "#constants/redis.mjs";

const app = new Koa();
const router = new Router();

const { PORT = 8080 } = process.env;

const registrationQueue = new Queue("registration", REDIS_CONNECTION);
const loginQueue = new Queue("login", REDIS_CONNECTION);
const refreshTokenQueue = new Queue("refreshToken", REDIS_CONNECTION);

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

router.post("/register", async (ctx) => {
  try {
    const job = await registrationQueue.add("register", ctx.request.body);
    const { customer, accessToken, refreshToken } = await job.waitUntilFinished(
      new QueueEvents("registration", REDIS_CONNECTION)
    );
    ctx.status = 201;
    ctx.body = { customer, accessToken };

    ctx.cookies.set("cc_auth", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    ctx.throw(400, "Username or password is invalid");
  }
});

router.post("/login", async (ctx) => {
  try {
    const job = await loginQueue.add("loginUser", ctx.request.body);
    const { customer, accessToken, refreshToken } = await job.waitUntilFinished(
      new QueueEvents("login", REDIS_CONNECTION)
    );
    ctx.body = { customer, accessToken };

    ctx.cookies.set("cc_auth", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    ctx.throw(401, "Username or password is incorrect");
  }
});

router.post("/refresh-token", async (ctx) => {
  const authCookie = ctx.cookies.get("cc_auth");
  if (!authCookie) {
    ctx.throw(401);
  }

  const job = await refreshTokenQueue.add("refresh", ctx.request.body);
  const { accessToken, refreshToken } = await job.waitUntilFinished(
    new QueueEvents("refreshtoken", REDIS_CONNECTION)
  );

  ctx.body = { accessToken };

  ctx.cookies.set("cc_auth", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
});

router.get("/customer", verifyJwt, async (ctx) => {
  const getCustomerJob = await getCustomerQueue.add("getCustomerData", {
    id: ctx.request.userId,
  });
  const customer = await getCustomerJob.waitUntilFinished(
    new QueueEvents("getCustomer", REDIS_CONNECTION)
  );

  return customer;
});

const server = app.listen(PORT);

ON_DEATH(() => {
  server.close();
  process.exit(0);
});
