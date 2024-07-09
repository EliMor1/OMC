/* eslint-disable prettier/prettier */

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { AggregatedData } from 'src/repositories/aggregated-data.schema';
import { Sensor } from 'src/repositories/sensor.schema';

@Injectable()
export class AggregatedDataDAL {
    private readonly logger = new Logger(AggregatedDataDAL.name);
  constructor(
    @InjectModel(Sensor.name) private sensorModel: Model<Sensor>,
    @InjectModel(AggregatedData.name) private aggregatedDataModel: Model<AggregatedData>
  ) {}

  async findSensorsUpdatedInLastHour(startHour: number, endHour: number): Promise<Sensor[] | null> {
    try{
        return this.sensorModel.find({
          lastUpdated: { $gte: startHour, $lt: endHour }
        });
    }
    catch(e){
        this.logger.error(e.message);
        return null;
      }
  }

  async saveAggregatedData(data: Partial<AggregatedData>): Promise<AggregatedData> {
    try{
        const aggregatedData = new this.aggregatedDataModel(data);
        return aggregatedData.save();
    }
    catch(e){
        this.logger.error(e.message);
        return null;
      }
  }

  async findWeeklyAggregatedData(pastWeek: string): Promise<AggregatedData[]> {
    try{
        return this.aggregatedDataModel.find({
          date: { $gte: pastWeek }
        });
    }
    catch(e){
        this.logger.error(e.message);
        return null;
      }
  }
}
