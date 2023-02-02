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
const logoutQueue = new Queue("logout", REDIS_CONNECTION);
const refreshTokenQueue = new Queue("refreshToken", REDIS_CONNECTION);
const getCustomerQueue = new Queue("getCustomer", REDIS_CONNECTION);
const updateCustomerQueue = new Queue("updateCustomer", REDIS_CONNECTION);
const addGreetingQueue = new Queue("addGreeting", REDIS_CONNECTION);
const getGreetingsQueue = new Queue("getGreetings", REDIS_CONNECTION);
const deleteGreetingsQueue = new Queue("deleteGreetings", REDIS_CONNECTION);
const generateImageQueue = new Queue("generateImage", REDIS_CONNECTION);
const saveImageQueue = new Queue("saveImage", REDIS_CONNECTION);
const getImagesByCustomerQueue = new Queue(
  "getImagesByCustomer",
  REDIS_CONNECTION
);
const getImageStatusQueue = new Queue("getImageStatus", REDIS_CONNECTION);

app.use(
  bodyParser({
    detectJSON: function (ctx) {
      return /images\/webhook/i.test(ctx.path);
    },
  })
);
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

router.delete("/logout", async (ctx) => {
  try {
    const refreshToken = ctx.cookies.get("cc_auth");
    if (!refreshToken) {
      ctx.status = 204;
      return;
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const job = await logoutQueue.add("logoutUser", {
      userId: decoded.id,
    });
    await job.waitUntilFinished(new QueueEvents("logout", REDIS_CONNECTION));

    ctx.cookies.set("cc_auth");
    ctx.status = 204;
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
    const greetingsResponse = await getGreetingsJob.waitUntilFinished(
      new QueueEvents("getGreetings", REDIS_CONNECTION)
    );
    const greetings = greetingsResponse.map(({ _id, __v, ...rest }) => ({
      id: _id,
      ...rest,
    }));

    ctx.body = { greetings };
  } catch (error) {
    ctx.throw(400);
  }
});

router.post("/greetings", verifyJwt, async (ctx) => {
  try {
    const addGreetingJob = await addGreetingQueue.add("add", {
      prompt: ctx.request.body.prompt,
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

router.delete("/greetings/:id", verifyJwt, async (ctx) => {
  try {
    const deleteGreetingJob = await deleteGreetingsQueue.add("deleteGreeting", {
      id: ctx.request.params.id,
    });
    await deleteGreetingJob.waitUntilFinished(
      new QueueEvents("deleteGreetings", REDIS_CONNECTION)
    );

    ctx.status = 204;
  } catch (error) {
    ctx.throw(400);
  }
});

router.get("/images/:id/status", verifyJwt, async (ctx) => {
  try {
    const getImageStatusJob = await getImageStatusQueue.add("imageStatus", {
      id: ctx.request.params.id,
    });
    const status = await getImageStatusJob.waitUntilFinished(
      new QueueEvents("getImageStatus", REDIS_CONNECTION)
    );
    console.log("%statuscimage", "color:cyan; ", status);

    ctx.body = { message: "success" };
  } catch (error) {
    ctx.throw(400);
  }
});

router.post("/images/webhook", async (ctx) => {
  const parsedBody = JSON.parse(ctx.request.rawBody);
  const generatedId = parsedBody.id;
  const image = parsedBody.output[0].image;
  const status = parsedBody.status;

  const saveImageJob = await saveImageQueue.add("save", {
    generatedId,
    image,
    status,
  });

  await saveImageJob.waitUntilFinished(
    new QueueEvents("saveImage", REDIS_CONNECTION)
  );

  ctx.body = { message: "success" };
});

router.post("/images", verifyJwt, async (ctx) => {
  try {
    const generateImageJob = await generateImageQueue.add("createImage", {
      prompt: ctx.request.body.prompt,
      userId: ctx.state.userId,
    });
    const image = await generateImageJob.waitUntilFinished(
      new QueueEvents("generateImage", REDIS_CONNECTION)
    );

    ctx.body = {
      id: image._id,
      status: image.status,
      generatedId: image.generatedId,
      createdAt: image.createdAt,
      userId: ctx.state.userId,
    };
  } catch (error) {
    console.log("%cerror", "color:cyan; ", error);
    ctx.throw(400);
  }
});

router.get("/images", verifyJwt, async (ctx) => {
  try {
    const getImagesByCustomerJob = await getImagesByCustomerQueue.add(
      "createImage",
      {
        userId: ctx.state.userId,
      }
    );
    const { processedImages, pendingImages } =
      await getImagesByCustomerJob.waitUntilFinished(
        new QueueEvents("getImagesByCustomer", REDIS_CONNECTION)
      );
    const images = [...processedImages]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return dateB - dateA;
      })
      .map((processedImage) => ({
        id: processedImage._id,
        photoUrl: processedImage.photoUrl,
        prompt: processedImage.prompt,
        status: processedImage.status,
        createdAt: processedImage.createdAt,
      }));

    ctx.body = { images, pendingImages };
  } catch (error) {
    ctx.throw(400);
  }
});

const server = app.listen(PORT);

ON_DEATH(() => {
  server.close();
  process.exit(0);
});
