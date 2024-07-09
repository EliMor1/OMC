/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SensorDocument = Sensor & Document;

@Schema()
export class Sensor extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true, enum: ['north', 'east', 'south', 'west'] })
  face: string;

  @Prop({ required: true })
  temperature: number;

  @Prop({type: Date, required: true })
  lastUpdated: number | Date; // Unix timestamp
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);
