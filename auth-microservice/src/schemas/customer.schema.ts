import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: ObjectId;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;

  comparePasswords: (password: string) => Promise<boolean>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.methods.comparePasswords = async function (password: string) {
  try {
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
  } catch (error) {
    return false;
  }
};
