import { Worker } from "bullmq";
import mongoose from "mongoose";
import { REDIS_CONNECTION } from "#constants/redis.mjs";
import { GreetingModel } from "#models/greeting.mjs";

const init = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
};

init().catch((_) => {
  process.exit(0);
});

const addGreetingWorker = new Worker(
  "addGreeting",
  async (job) => {
    try {
      return await GreetingModel.create(job.data);
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);

addGreetingWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});

const getGreetingsWorker = new Worker(
  "getGreetings",
  async (job) => {
    try {
      return await GreetingModel.find({
        userId: mongoose.Types.ObjectId(job.data.userId),
      });
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);

getGreetingsWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});
