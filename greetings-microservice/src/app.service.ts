import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { of } from 'rxjs';
import { Configuration, OpenAIApi } from 'openai';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { DeleteGreetingDto } from './dto/delete-greeting.dto';
import { GetGreetingsDto } from './dto/get-greetings.dto';
import { Greeting, GreetingDocument } from './schemas/greeting.schema';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY.trim(),
});
const openai = new OpenAIApi(configuration);

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Greeting.name) private greetingModel: Model<GreetingDocument>,

    @Inject('CUSTOMERS_MICROSERVICE') private readonly client: ClientProxy,
  ) {}

  async createGreeting(createGreetingDto: CreateGreetingDto): Promise<any> {
    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: createGreetingDto.prompt,
        temperature: 0.7,
        max_tokens: 500,
      });

      const greeting = await this.greetingModel.create({
        userId: createGreetingDto.userId,
        prompt: createGreetingDto.prompt,
        generatedText: completion.data.choices[0].text,
      });

      await this.client
        .send(
          { cmd: 'update-customer' },
          { userId: createGreetingDto.userId, greeting },
        )
        .toPromise();

      return {
        id: greeting._id,
        prompt: greeting.prompt,
        generatedText: greeting.generatedText,
        createdAt: greeting.createdAt,
        updatedAt: greeting.updatedAt,
      };
    } catch (error) {
      throw new RpcException(
        new BadRequestException(error.message, {
          cause: new Error(),
        }),
      );
    }
  }

  async getGreetings(getGreetingsDto: GetGreetingsDto) {
    try {
      try {
        const greetings = await this.greetingModel.find({
          userId: new mongoose.Types.ObjectId(getGreetingsDto.userId),
        });

        return {
          greetings: greetings.map((greeting) => ({
            id: greeting._id,
            prompt: greeting.prompt,
            generatedText: greeting.generatedText,
            createdAt: greeting.createdAt,
            updatedAt: greeting.updatedAt,
          })),
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw new RpcException(
        new BadRequestException(error.message, {
          cause: new Error(),
        }),
      );
    }
  }

  async deleteGreeting(deleteGreetingDto: DeleteGreetingDto): Promise<any> {
    try {
      return await this.greetingModel.deleteOne({
        _id: new mongoose.Types.ObjectId(deleteGreetingDto.id),
      });
    } catch (error) {
      throw new RpcException(
        new BadRequestException(error.message, {
          cause: new Error(),
        }),
      );
    }
  }
}
