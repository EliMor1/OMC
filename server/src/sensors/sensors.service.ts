/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { SensorsDAL } from './DAL/sensors.dal';
import { ISensor } from '../common/interfaces/Sensor.interface';
import { SensorDTO } from './dto/sensor.dto';

@Injectable()
export class SensorsService {
  private readonly logger = new Logger(SensorsService.name);
  private readonly removalThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor(private sensorsDAL: SensorsDAL) {
    this.initializeCronJobs();
  }

  async addSensor(sensorData: any): Promise<SensorDTO> {
    const newSensor = {
      ...sensorData,
      lastUpdated: new Date(),
    };
    return this.sensorsDAL.create(newSensor);
  }

  async removeSensor(id: number): Promise<void> {
    await this.sensorsDAL.findOneAndDelete(id);
  }

  async updateSensorData(id: number, temperature: number): Promise<SensorDTO | null> {
    return this.sensorsDAL.findOneAndUpdate(id, { temperature, lastUpdated: new Date() });
  }

  async removeInactiveSensors(): Promise<void> {
    const now = Date.now();
    await this.sensorsDAL.deleteMany({
      lastUpdated: { $lt: now - this.removalThreshold },
    });
    this.logger.log('Inactive sensors removed');
  }

  async getSensors(): Promise<SensorDTO[]> {
    const sensors = await this.sensorsDAL.findAll();
    return sensors.map(sensor => ({
      id: sensor.id,
      face: sensor.face,
      temperature: sensor.temperature,
      lastUpdated: sensor.lastUpdated,
    }));
  }

  async getHourlyAggregatedData(): Promise<any> {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const sensors = await this.sensorsDAL.findAll();

    const aggregatedData = {
      north: { count: 0, totalTemperature: 0 },
      east: { count: 0, totalTemperature: 0 },
      south: { count: 0, totalTemperature: 0 },
      west: { count: 0, totalTemperature: 0 },
    };

    sensors.forEach(sensor => {
      const lastUpdatedTime = new Date(sensor.lastUpdated).getTime();
      if (lastUpdatedTime > oneHourAgo) {
        aggregatedData[sensor.face].count += 1;
        aggregatedData[sensor.face].totalTemperature += sensor.temperature;
      }
    });

    return Object.keys(aggregatedData).reduce((acc, face) => {
      acc[face] = {
        temperature: aggregatedData[face].totalTemperature / (aggregatedData[face].count || 1),
      };
      return acc;
    }, {});
  }

  async getMalfunctioningSensors(): Promise<any[]> {
    const sensors = await this.sensorsDAL.findAll();

    const faceGroups = sensors.reduce((acc, sensor) => {
      if (!acc[sensor.face]) acc[sensor.face] = [];
      acc[sensor.face].push(sensor.temperature);
      return acc;
    }, {});

    const faceAverages = Object.keys(faceGroups).reduce((acc, face) => {
      const total = faceGroups[face].reduce((sum, temp) => sum + temp, 0);
      const average = total / faceGroups[face].length;
      acc[face] = average;
      return acc;
    }, {});

    const malfunctioningSensors = sensors
      .filter(sensor => {
        const average = faceAverages[sensor.face];
        return Math.abs(sensor.temperature - average) / average > 0.2;
      })
      .map(sensor => ({
        id: sensor.id,
        temperature: sensor.temperature,
      }));

    if (malfunctioningSensors.length > 0) {
      this.logger.warn(`Malfunctioning sensors detected: ${JSON.stringify(malfunctioningSensors)}`);
    }

    return malfunctioningSensors;
  }

  private initializeCronJobs() {
    // Add sensors if below the limit
    cron.schedule('* * * * * *', async () => {

      //** */ i have changed the sensors limit to 50 to keep the process run smoother,
      //** */ you may un comment this line to get the objective(10,000 sensors.) and comment the other sensor limit line below.

      // const sensorLimit = 10000;
       const sensorLimit = 50;
      const sensors = await this.sensorsDAL.findAll();
      if (sensors.length < sensorLimit) {
        const newSensor: ISensor = {
          id: sensors.length + 1,
          face: this.getRandomFace(),
          temperature: this.getRandomTemperature(),
          lastUpdated: new Date(),
        };
        await this.sensorsDAL.create(newSensor);
        this.logger.log(`Sensor ${newSensor.id} added.`);
      }
    });

    // Update sensors and remove inactive ones

    cron.schedule('* * * * * *', async () => {
      const sensors = await this.sensorsDAL.findAll();
      const now = Date.now();

      const sensorsToUpdate: Partial<ISensor>[] = [];
      const sensorsToRemove: number[] = [];

      for (const sensor of sensors) {
        if (now - new Date(sensor.lastUpdated).getTime() > this.removalThreshold) {
          sensorsToRemove.push(sensor.id);
        } else {
          sensorsToUpdate.push({
            id: sensor.id,
            temperature: this.getRandomTemperature(),
            lastUpdated: new Date(),
          });
        }
      }

      if (sensorsToRemove.length > 0) {
        await this.sensorsDAL.removeInactiveSensors(sensorsToRemove);
        this.logger.log(`Sensors removed due to inactivity: ${sensorsToRemove.join(', ')}`);
      }

      if (sensorsToUpdate.length > 0) {
        await this.sensorsDAL.bulkUpdateSensors(sensorsToUpdate);
        this.logger.log(`Sensors updated: ${sensorsToUpdate.map(sensor => sensor.id).join(', ')}`);
      }
    });
  }

  private getRandomFace(): 'north' | 'east' | 'south' | 'west' {
    const faces = ['north', 'east', 'south', 'west'];
    return faces[Math.floor(Math.random() * faces.length)] as 'north' | 'east' | 'south' | 'west';
  }

  private getRandomTemperature(): number {
    return parseFloat((Math.random() * 35).toFixed(2));
  }
}
