import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type GreetingDocument = HydratedDocument<Greeting>;

@Schema({ timestamps: true })
export class Greeting {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: ObjectId;

  @Prop()
  prompt: string;

  @Prop()
  generatedText: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const GreetingSchema = SchemaFactory.createForClass(Greeting);
