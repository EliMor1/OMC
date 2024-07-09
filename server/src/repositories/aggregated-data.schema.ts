/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AggregatedData extends Document {
  @Prop({ required: true })
  date: string; // Format: YYYY-MM-DD

  @Prop({ required: true })
  hour: number; // Hour of the day (0-23)

  @Prop({ required: true, enum: ['north', 'east', 'south', 'west'] })
  face: string;

  @Prop({ required: true })
  averageTemperature: number;
}

export const AggregatedDataSchema = SchemaFactory.createForClass(AggregatedData);
