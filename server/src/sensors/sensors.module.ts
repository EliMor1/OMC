/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { Sensor, SensorSchema } from '../repositories/sensor.schema';
import { AggregatedData, AggregatedDataSchema, } from 'src/repositories/aggregated-data.schema';
import { AggregatedDataService } from './aggregated-data.service';
import { SensorsDAL } from './DAL/sensors.dal';
import { AggregatedDataDAL } from './DAL/aggregated-data.dal';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sensor.name, schema: SensorSchema }, { name: AggregatedData.name, schema: AggregatedDataSchema }])
  ],
  controllers: [SensorsController],
  providers: [SensorsService, AggregatedDataService, AggregatedDataDAL, SensorsDAL]
})
export class SensorsModule {}
