import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SupportDocument = Support & Document;

@Schema({ timestamps: true })
export class Support {
  @Prop({ required: true, type: String })
  question: string;

  @Prop({ required: true, type: String })
  answer: string;

  createdAt: Date;
  updatedAt: Date;
}

export const SupportSchema = SchemaFactory.createForClass(Support);
