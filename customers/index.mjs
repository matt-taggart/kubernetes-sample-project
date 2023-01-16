import { Worker } from "bullmq";
import mongoose from "mongoose";
import { REDIS_CONNECTION } from "#constants/redis.mjs";
import { CustomerModel } from "#models/customer.mjs";

const init = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
};

init().catch((_) => {
  process.exit(0);
});

const createCustomerWorker = new Worker(
  "createCustomer",
  async (job) => {
    try {
      return await CustomerModel.create(job.data);
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);

createCustomerWorker.on("completed", (job, returnvalue) => {
  console.log(`${job.id} has completed!`);
  return returnvalue;
});

createCustomerWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});

const getCustomerWorker = new Worker(
  "getCustomer",
  async (job) => {
    try {
      return await CustomerModel.findOne({ id: job.data.id });
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);

getCustomerWorker.on("completed", (job, returnvalue) => {
  console.log(`${job.id} has completed!`);
  return returnvalue;
});

getCustomerWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});
