/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sensor } from 'src/repositories/sensor.schema';
import { ISensor } from 'src/common/interfaces/Sensor.interface';

@Injectable()
export class SensorsDAL {
  private readonly logger = new Logger(SensorsDAL.name);
  constructor(@InjectModel(Sensor.name) private sensorModel: Model<Sensor>) {}

  async create(sensor: ISensor): Promise<Sensor | null> {
    try{
      const createdSensor = new this.sensorModel(sensor);
      return createdSensor.save();
    }
    catch(e){
      this.logger.error(e.message);
      return null;
    }
  }

  async findAll(): Promise<Sensor[] | null> {
    try{
      return this.sensorModel.find().exec();
    }
    catch(e){
      this.logger.error(e.message);
      return null;
    }
  }

  async findById(id: number): Promise<Sensor | null> {
    try{
      return this.sensorModel.findOne({ id });
    }
    catch(e){
      this.logger.error(e.message);
      return null;
    }
  }

  async findOneAndDelete(id: number): Promise<Sensor | null> {
    try{

      return this.sensorModel.findOneAndDelete({ id });
    }
    catch(e){
      this.logger.error(e.message);
      return null;
    }
  }

  async findOneAndUpdate(id: number, update: Partial<Sensor>): Promise<Sensor | null> {
    try{

      return this.sensorModel.findOneAndUpdate({ id }, update, { new: true });
    }
    catch(e){
      this.logger.error(e.message);
      return null;
    }
  }

  async deleteMany(filter: any): Promise<void> {
    try{
      await this.sensorModel.deleteMany(filter);
    }
    catch(e){
      this.logger.error(e.message);
      return null;
    }
  }

  async bulkUpdateSensors(sensorUpdates: Partial<Sensor>[]): Promise<void> {
    try{

      const bulkOps = sensorUpdates.map(sensor => ({
        updateOne: {
          filter: { id: sensor.id },
          update: { $set: sensor },
        },
      }));
      await this.sensorModel.bulkWrite(bulkOps);
    }
    catch(e){
      this.logger.error(e.message);
      return null;
    }
  }

  async removeInactiveSensors(sensorIds: number[]): Promise<void | null> {
    try{
      await this.sensorModel.deleteMany({ id: { $in: sensorIds } });
    }
    catch(e){
      this.logger.error(e.message);
      return null;
    }

  }

  async updateAndRemoveSensors(removalThreshold: number, now: number): Promise<void | null> {
    try{

      await this.sensorModel.aggregate([
        {
          $facet: {
            sensorsToRemove: [
              {
                $match: {
                  lastUpdated: { $lt: new Date(now - removalThreshold) },
                },
              },
              {
                $group: {
                  _id: null,
                  ids: { $push: "$id" },
                },
              },
            ],
            sensorsToUpdate: [
              {
                $match: {
                  lastUpdated: { $gte: new Date(now - removalThreshold) },
                },
              },
              {
                $addFields: {
                  temperature: { $rand: { $multiply: [35, { $add: [1, 0] }] } },
                  lastUpdated: new Date(),
                },
              },
            ],
          },
        },
        {
          $project: {
            sensorsToRemove: { $arrayElemAt: ["$sensorsToRemove.ids", 0] },
            sensorsToUpdate: 1,
          },
        },
      ])
      .then(async ([result]) => {
        if (result.sensorsToRemove && result.sensorsToRemove.length > 0) {
          await this.sensorModel.deleteMany({ id: { $in: result.sensorsToRemove } });
        }
  
        if (result.sensorsToUpdate && result.sensorsToUpdate.length > 0) {
          const bulkOps = result.sensorsToUpdate.map(sensor => ({
            updateOne: {
              filter: { id: sensor.id },
              update: { $set: { temperature: sensor.temperature, lastUpdated: sensor.lastUpdated } },
            },
          }));
          await this.sensorModel.bulkWrite(bulkOps);
        }
      });
    }
    catch(e){
      this.logger.error(e.message);
      return null;
    }
  }
}
