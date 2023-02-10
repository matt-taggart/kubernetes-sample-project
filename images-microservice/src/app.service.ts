import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import axios from 'axios';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { DESCRIPTION_TO_MODEL } from './constants/models.constants';
import { Image, ImageDocument } from './schema/image.schema';
import { CreateImageDto } from './dto/create-image.dto';
import { GetImagesDto } from './dto/get-images.dto';
import { SaveImageDto } from './dto/save-image.dto';
import { RpcException } from '@nestjs/microservices';

const BUCKET_NAME = 'card_couture';

const storage = new Storage({
  keyFilename: 'service-account.json',
});

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async createImage(createImageDto: CreateImageDto) {
    const url = DESCRIPTION_TO_MODEL[createImageDto.model];
    try {
      const { data } = await axios({
        url,
        method: 'post',
        data: {
          input: {
            prompt: createImageDto.prompt,
          },
          webhook: 'http://67f5-70-190-230-170.ngrok.io/images/webhook',
        },
        headers: {
          Authorization: `Bearer ${process.env.RUNPOD_API_KEY.trim()}`,
        },
        withCredentials: true,
      });

      if (data.status === 'FAILED') {
        return {
          status: 'FAILED',
          error: data.error,
        };
      }

      const response = await this.imageModel.create({
        generatedId: data.id,
        prompt: createImageDto.prompt,
        status: data.status,
        userId: new mongoose.Types.ObjectId(createImageDto.userId),
      });

      return response;
    } catch (error) {
      throw new RpcException(
        new BadRequestException(error.message, {
          cause: new Error(),
        }),
      );
    }
  }

  async getImages(getImagesDto: GetImagesDto) {
    try {
      const options = {
        prefix: getImagesDto.userId + '/',
      };

      // Lists files in the bucket, filtered by a prefix
      const [files] = await storage.bucket(BUCKET_NAME).getFiles(options);

      const signedUrls = files.map(async (file) => {
        const options = {
          version: 'v2', // defaults to 'v2' if missing.
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60, // one hour
        };

        const [photoUrl] = await storage
          .bucket(BUCKET_NAME)
          .file(file.name)
          .getSignedUrl(options as GetSignedUrlConfig);

        const generatedId = file.name.split('/')[1];

        return await this.imageModel.findOneAndUpdate(
          { generatedId },
          { photoUrl },
        );
      });

      const processedImages = await Promise.all(signedUrls);
      const pendingImages = await this.imageModel.find({
        status: 'IN_QUEUE',
        userId: getImagesDto.userId,
      });

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

      const parsedPendingImages = [...pendingImages]
        .sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();

          return dateB - dateA;
        })
        .map((pendingImage) => ({
          id: pendingImage._id,
          photoUrl: pendingImage.photoUrl,
          prompt: pendingImage.prompt,
          status: pendingImage.status,
          createdAt: pendingImage.createdAt,
        }));

      return { images, pendingImages: parsedPendingImages };
    } catch (error) {
      throw new RpcException(
        new BadRequestException(error.message, {
          cause: new Error(),
        }),
      );
    }
  }

  async saveImage(saveImageDto: SaveImageDto) {
    try {
      const [bucketExist] = await storage.bucket(BUCKET_NAME).exists();
      if (!bucketExist) {
        await storage.createBucket(BUCKET_NAME);
      }
      const response = await axios.get(saveImageDto.image, {
        responseType: 'arraybuffer',
      });

      const savedImage = await this.imageModel.findOneAndUpdate(
        {
          generatedId: saveImageDto.generatedId,
        },
        {
          status: saveImageDto.status,
          photoUrl: saveImageDto.image,
        },
      );

      const buffer = Buffer.from(response.data, 'utf-8');
      const file = storage
        .bucket(BUCKET_NAME)
        .file(`${savedImage.userId}/${saveImageDto.generatedId}`);

      await file.save(buffer);

      return { message: 'success' };
    } catch (error) {
      throw new RpcException(
        new BadRequestException(error.message, {
          cause: new Error(),
        }),
      );
    }
  }
}
