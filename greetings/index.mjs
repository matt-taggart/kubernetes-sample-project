import { Worker } from "bullmq";
import mongoose from "mongoose";
import { Configuration, OpenAIApi } from "openai";
import { REDIS_CONNECTION } from "#constants/redis.mjs";
import { GreetingModel } from "#models/greeting.mjs";

const init = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY.trim(),
});
const openai = new OpenAIApi(configuration);

init().catch((_) => {
  process.exit(0);
});

const addGreetingWorker = new Worker(
  "addGreeting",
  async (job) => {
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: job.data.prompt,
        temperature: 0.7,
        max_tokens: 500,
      });

      return await GreetingModel.create({
        ...job.data,
        generatedText: completion.data.choices[0].text,
      });
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

const deleteGreetingsWorker = new Worker(
  "deleteGreetings",
  async (job) => {
    try {
      return await GreetingModel.deleteOne({
        _id: mongoose.Types.ObjectId(job.data.id),
      });
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);

deleteGreetingsWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});
