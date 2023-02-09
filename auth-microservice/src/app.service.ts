import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { RegisterUserDto } from './dto/register-user.dto';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const numberOfUserEntries = await this.customerModel.count({
        email: registerUserDto.email,
      });

      if (numberOfUserEntries > 0) {
        throw new Error('User already exists');
      }

      const customer = await this.customerModel.create(registerUserDto);

      const accessToken = jwt.sign(
        {
          id: customer._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' },
      );

      const refreshToken = jwt.sign(
        {
          id: customer._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' },
      );

      await this.customerModel.findOneAndUpdate(
        { id: customer._id },
        { accessToken, refreshToken },
      );

      return {
        customer: {
          id: customer._id,
          email: customer.email,
          fullName: customer.fullName,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new RpcException(
        new BadRequestException(error.message, {
          cause: new Error(),
        }),
      );
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const customer = await this.customerModel
        .findOne({
          email: loginUserDto.email,
        })
        .exec();

      if (!customer) {
        throw new Error('User does not exist');
      }

      const isValidPassword = await customer.comparePasswords(
        loginUserDto.password,
      );

      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      const id = customer._id.toString();

      const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30m',
      });

      const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
      });

      await this.customerModel.findOneAndUpdate(
        { id },
        { accessToken, refreshToken },
      );

      return {
        customer: {
          id,
          fullName: customer.fullName,
          email: customer.email,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new RpcException(
        new BadRequestException(error.message, {
          cause: new Error(),
        }),
      );
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const decoded = jwt.verify(
        refreshTokenDto.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      const id = (decoded as { id: string }).id;

      const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30m',
      });

      const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
      });

      await this.customerModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id as string) },
        { accessToken, refreshToken },
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new RpcException(
        new BadRequestException(error.message, {
          cause: new Error(),
        }),
      );
    }
  }

  async logoutUser(logoutUserDto: LogoutUserDto) {
    try {
      const decoded = jwt.verify(
        logoutUserDto.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      const id = (decoded as { id: string }).id;
      return await this.customerModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id as string) },
        { accessToken: undefined, refreshToken: undefined },
      );
    } catch (error) {
      throw new RpcException(
        new BadRequestException(error.message, {
          cause: new Error(),
        }),
      );
    }
  }
}
