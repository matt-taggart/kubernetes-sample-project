import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { GetCustomerDto } from './dto/get-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async getCustomer(getCustomerDto: GetCustomerDto) {
    const customer = await this.customerModel.findOne({
      _id: new mongoose.Types.ObjectId(getCustomerDto.userId),
    });

    return {
      id: customer._id,
      fullName: customer.fullName,
      email: customer.email,
    };
  }

  async updateCustomer(updateCustomerDto: UpdateCustomerDto) {
    const updatedCustomer = await this.customerModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(updateCustomerDto.userId) },
      {
        $push: {
          greetings: {
            _id: new mongoose.Types.ObjectId(updateCustomerDto.greeting.id),
            greeting: updateCustomerDto.greeting.prompt,
            generatedText: updateCustomerDto.greeting.generatedText,
          },
        },
      },
    );

    return updatedCustomer;
  }
}
