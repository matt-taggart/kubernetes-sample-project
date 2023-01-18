import { Queue, QueueEvents, Worker } from "bullmq";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { REDIS_CONNECTION } from "#constants/redis.mjs";
import { CustomerModel } from "#models/customer.mjs";

const createCustomerQueue = new Queue("createCustomer", REDIS_CONNECTION);

const init = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
};

init().catch((_) => {
  process.exit(0);
});

const registrationWorker = new Worker(
  "registration",
  async (job) => {
    try {
      const numberOfUserEntries = await CustomerModel.count({
        email: job.data.email,
      });

      if (numberOfUserEntries > 0) {
        throw new Error("User already exists");
      }

      const createCustomerJob = await createCustomerQueue.add(
        "create",
        job.data
      );
      const customer = await createCustomerJob.waitUntilFinished(
        new QueueEvents("createCustomer", REDIS_CONNECTION)
      );

      const accessToken = jwt.sign(
        {
          id: customer._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "3m" }
      );

      const refreshToken = jwt.sign(
        {
          id: customer._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      await CustomerModel.findOneAndUpdate(
        { id: customer._id },
        { accessToken, refreshToken }
      );

      return {
        customer,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);

registrationWorker.on("completed", (job, returnvalue) => {
  console.log(`${job.id} has completed!`);
  return returnvalue;
});

registrationWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});

const loginWorker = new Worker(
  "login",
  async (job) => {
    try {
      const customer = await CustomerModel.findOne({
        email: job.data.email,
      }).exec();

      if (!customer) {
        throw new Error("User does not exist");
      }

      const isValidPassword = await customer.comparePasswords(
        job.data.password
      );

      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      const id = customer._id.toString();

      const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3m",
      });

      const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      await CustomerModel.findOneAndUpdate(
        { id },
        { accessToken, refreshToken }
      );

      return {
        customer,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);

loginWorker.on("completed", (job, returnvalue) => {
  console.log(`${job.id} has completed!`);
  return returnvalue;
});

loginWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});

const refreshTokenWorker = new Worker(
  "refreshToken",
  async (job) => {
    try {
      const id = job.data.id;
      const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3m",
      });

      const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      await CustomerModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { accessToken, refreshToken }
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);

refreshTokenWorker.on("completed", (job, returnvalue) => {
  console.log(`${job.id} has completed!`);
  return returnvalue;
});

refreshTokenWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});
