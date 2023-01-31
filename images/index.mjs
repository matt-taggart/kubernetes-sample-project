import axios from "axios";
import mongoose from "mongoose";
import { Worker } from "bullmq";
import { Storage } from "@google-cloud/storage";
import { REDIS_CONNECTION } from "#constants/redis.mjs";
import { RUNPOD_BASE_URL } from "#constants/runpod.mjs";
import { ImageModel } from "#models/images.mjs";

const init = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
};

init().catch((_) => {
  process.exit(0);
});

/**
 * TODO(developer):
 *  1. Uncomment and replace these variables before running the sample.
 *  2. Set up ADC as described in https://cloud.google.com/docs/authentication/external/set-up-adc
 *  3. Make sure you have the necessary permission to list storage buckets "storage.buckets.list"
 *    (https://cloud.google.com/storage/docs/access-control/iam-permissions#bucket_permissions)
 */
const projectId = "elegant-tangent-374007";
const BUCKET_NAME = "card_couture";

const storage = new Storage({
  projectId,
});

const generateImageWorker = new Worker(
  "generateImage",
  async (job) => {
    try {
      const { data } = await axios({
        url: RUNPOD_BASE_URL,
        method: "post",
        data: {
          input: {
            prompt: job.data.prompt,
          },
          webhook: "https://9c6b-70-190-230-170.ngrok.io/images/webhook",
        },
        headers: {
          Authorization: `Bearer ${process.env.RUNPOD_API_KEY.trim()}`,
        },
        withCredentials: true,
      });

      const response = await ImageModel.create({
        generatedId: data.id,
        prompt: job.data.prompt,
        status: data.status,
        userId: mongoose.Types.ObjectId(job.data.userId),
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);

generateImageWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});

const getImageWorker = new Worker(
  "getImageStatus",
  async (job) => {
    try {
      const response = await axios({
        url: `https://api.runpod.ai/v1/sd-anything-v3/status/${job.data.id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${process.env.RUNPOD_API_KEY.trim()}`,
        },
        withCredentials: true,
      });

      // Set the headers for the request
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);

getImageWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});

const getImagesByCustomerWorker = new Worker(
  "getImagesByCustomer",
  async (job) => {
    try {
      const options = {
        prefix: job.data.userId + "/",
      };

      // Lists files in the bucket, filtered by a prefix
      const [files] = await storage.bucket(BUCKET_NAME).getFiles(options);

      return files.map((file) => {
        console.log(file.name);
        const url = `https://${BUCKET_NAME}.storage.googleapis.com/${file.name}`;
        return { url };
      });
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);

getImagesByCustomerWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});

const saveImageWorker = new Worker(
  "saveImage",
  async (job) => {
    try {
      const [bucketExist] = await storage.bucket(BUCKET_NAME).exists();
      if (!bucketExist) {
        await storage.createBucket(BUCKET_NAME);
      }
      const response = await axios.get(job.data.image, {
        responseType: "arraybuffer",
      });

      const savedImage = await ImageModel.findOne({
        generatedId: job.data.generatedId,
      });

      const buffer = Buffer.from(response.data, "utf-8");
      const file = storage
        .bucket(BUCKET_NAME)
        .file(`${savedImage.userId}/${job.data.generatedId}`);

      await file.save(buffer);

      return { message: "success" };
    } catch (error) {
      throw error;
    }
  },
  REDIS_CONNECTION
);
// Save image from webworker with userId as prefix
// Fetch images based on userid prefix

saveImageWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
  return err;
});
