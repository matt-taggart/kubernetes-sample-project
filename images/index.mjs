import axios from "axios";
import mongoose from "mongoose";
import { Worker } from "bullmq";
import { Storage } from "@google-cloud/storage";
import { REDIS_CONNECTION } from "#constants/redis.mjs";
import { DESCRIPTION_TO_MODEL } from "#constants/models.mjs";
import { ImageModel } from "#models/images.mjs";

const init = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
};

init().catch((_) => {
  process.exit(0);
});

const BUCKET_NAME = "card_couture";

const storage = new Storage({
  keyFilename: "service-account.json",
});

const generateImageWorker = new Worker(
  "generateImage",
  async (job) => {
    const url = DESCRIPTION_TO_MODEL[job.data.model];
    try {
      const { data } = await axios({
        url,
        method: "post",
        data: {
          input: {
            prompt: job.data.prompt,
          },
          webhook: "https://9f8f-70-190-230-170.ngrok.io/images/webhook",
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

      const signedUrls = files.map(async (file) => {
        const options = {
          version: "v2", // defaults to 'v2' if missing.
          action: "read",
          expires: Date.now() + 1000 * 60 * 60, // one hour
        };

        const [photoUrl] = await storage
          .bucket(BUCKET_NAME)
          .file(file.name)
          .getSignedUrl(options);

        const generatedId = file.name.split("/")[1];

        return await ImageModel.findOneAndUpdate({ generatedId }, { photoUrl });
      });

      const processedImages = await Promise.all(signedUrls);
      const pendingImages = await ImageModel.find({
        status: "IN_QUEUE",
        userId: job.data.userId,
      });

      return {
        processedImages,
        pendingImages,
      };
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
    console.log("%cjob", "color:cyan; ", job.data);
    try {
      const [bucketExist] = await storage.bucket(BUCKET_NAME).exists();
      if (!bucketExist) {
        await storage.createBucket(BUCKET_NAME);
      }
      const response = await axios.get(job.data.image, {
        responseType: "arraybuffer",
      });

      const savedImage = await ImageModel.findOneAndUpdate(
        {
          generatedId: job.data.generatedId,
        },
        {
          status: job.data.status,
          photoUrl: job.data.image,
        }
      );

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
