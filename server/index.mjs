import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import cors from "kcors";
import logger from "koa-pino-logger";
import Boom from "@hapi/boom";
import ON_DEATH from "death";
import jwt from "jsonwebtoken";
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
const getCustomerQueue = new Queue("getCustomer", REDIS_CONNECTION);
const updateCustomerQueue = new Queue("updateCustomer", REDIS_CONNECTION);
const addGreetingQueue = new Queue("addGreeting", REDIS_CONNECTION);
const getGreetingsQueue = new Queue("getGreetings", REDIS_CONNECTION);

app.use(bodyParser());
app.use(cors());
// app.use(logger());
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
  try {
    const authCookie = ctx.cookies.get("cc_auth");
    if (!authCookie) {
      ctx.throw(401);
    }

    const decoded = jwt.verify(authCookie, process.env.REFRESH_TOKEN_SECRET);

    const job = await refreshTokenQueue.add("refresh", { id: decoded.id });
    const { accessToken, refreshToken } = await job.waitUntilFinished(
      new QueueEvents("refreshToken", REDIS_CONNECTION)
    );

    ctx.body = { accessToken };

    ctx.cookies.set("cc_auth", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    ctx.throw(400, "Please login to continue");
  }
});

router.get("/customers", verifyJwt, async (ctx) => {
  const getCustomerJob = await getCustomerQueue.add("getCustomerData", {
    id: ctx.state.userId,
  });
  const customer = await getCustomerJob.waitUntilFinished(
    new QueueEvents("getCustomer", REDIS_CONNECTION)
  );

  ctx.body = { customer };
});

router.get("/greetings", verifyJwt, async (ctx) => {
  try {
    const getGreetingsJob = await getGreetingsQueue.add("get", {
      userId: ctx.state.userId,
    });
    const greetings = await getGreetingsJob.waitUntilFinished(
      new QueueEvents("getGreetings", REDIS_CONNECTION)
    );

    ctx.body = { greetings };
  } catch (error) {
    ctx.throw(400);
  }
});

router.post("/greeting", verifyJwt, async (ctx) => {
  try {
    const addGreetingJob = await addGreetingQueue.add("add", {
      prompt: ctx.request.body.prompt,
      generatedText: "This is some sample generated text",
      userId: ctx.state.userId,
    });
    const greeting = await addGreetingJob.waitUntilFinished(
      new QueueEvents("addGreeting", REDIS_CONNECTION)
    );

    const updateCustomerJob = await updateCustomerQueue.add(
      "updateCustomerData",
      {
        userId: ctx.state.userId,
        greeting,
      }
    );
    const customer = await updateCustomerJob.waitUntilFinished(
      new QueueEvents("updateCustomer", REDIS_CONNECTION)
    );

    ctx.body = { customer, greeting };
  } catch (error) {
    ctx.throw(400);
  }
});

const server = app.listen(PORT);

ON_DEATH(() => {
  server.close();
  process.exit(0);
});
