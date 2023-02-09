import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import { RegisterUserDto } from './dto/register-user.dto';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutUserDto } from './dto/logout-user.dto';

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
        customer,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
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

      const isValidPassword = await this.customerModel.comparePasswords(
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
        customer,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const id = jwt.verify(
        refreshTokenDto.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30m',
      });

      const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
      });

      await this.customerModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { accessToken, refreshToken },
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async logoutUser(logoutUserDto: LogoutUserDto) {
    try {
      const id = jwt.verify(
        logoutUserDto.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      return await this.customerModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { accessToken: undefined, refreshToken: undefined },
      );
    } catch (error) {
      throw error;
    }
  }
}
