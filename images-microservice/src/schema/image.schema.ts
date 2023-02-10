import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema({ timestamps: true })
export class Image {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: ObjectId;

  @Prop()
  prompt: string;

  @Prop()
  generatedId: string;

  @Prop()
  photoUrl: string;

  @Prop()
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
