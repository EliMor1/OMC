/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { AggregatedDataDAL } from './DAL/aggregated-data.dal';

@Injectable()
export class AggregatedDataService {
  private readonly logger = new Logger(AggregatedDataService.name);

  constructor(private readonly aggregatedDataDAL: AggregatedDataDAL) {}

  async aggregateHourlyData(): Promise<void> {
    const now = new Date();
    const startHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0).getTime();
    const endHour = startHour + 60 * 60 * 1000;

    const sensors = await this.aggregatedDataDAL.findSensorsUpdatedInLastHour(startHour, endHour);

    const faceGroups = sensors.reduce((acc, sensor) => {
      if (!acc[sensor.face]) acc[sensor.face] = [];
      acc[sensor.face].push(sensor.temperature);
      return acc;
    }, {});

    for (const face in faceGroups) {
      const total = faceGroups[face].reduce((sum, temp) => sum + temp, 0);
      const average = total / faceGroups[face].length;

      await this.aggregatedDataDAL.saveAggregatedData({
        date: now.toISOString().split('T')[0],
        hour: now.getHours(),
        face,
        averageTemperature: average
      });
    }

    this.logger.log('Hourly data aggregated and stored');
  }

  async getWeeklyAggregatedData(): Promise<any> {
    const now = new Date();
    const pastWeekDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const pastWeek = pastWeekDate.toISOString().split('T')[0];

    const data = await this.aggregatedDataDAL.findWeeklyAggregatedData(pastWeek);

    const report = data.reduce((acc, record) => {
      if (!acc[record.date]) acc[record.date] = {};
      if (!acc[record.date][record.face]) acc[record.date][record.face] = [];

      acc[record.date][record.face].push({
        hour: record.hour,
        averageTemperature: record.averageTemperature
      });

      return acc;
    }, {});

    return report;
  }
}
