/* eslint-disable prettier/prettier */

import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Logger,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException
} from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { AggregatedDataService } from './aggregated-data.service';
import { SensorDTO } from './dto/sensor.dto';

@Controller('sensors')
export class SensorsController {
  private readonly logger = new Logger(SensorsController.name);

  constructor(private readonly sensorsService: SensorsService,
    private readonly aggregatedDataService: AggregatedDataService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async addSensor(@Body() sensorData: SensorDTO) {
    this.logger.log('Adding new sensor');
    const newSensor = this.sensorsService.addSensor(sensorData);
    if(!newSensor){
      throw new InternalServerErrorException("Coudln't create a new sensor");
    }
    return newSensor;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removeSensor(@Param('id') id: number) {
    this.logger.log(`Removing sensor with id: ${id}`);
    const removedSensor = this.sensorsService.removeSensor(id);
    if(!removedSensor){
      throw new NotFoundException("Coudln't delete a new sensor");
    }
    return removedSensor;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSensors() {
    this.logger.log('Fetching all sensors');
    const sensors = this.sensorsService.getSensors();
    if(!sensors){
      throw new BadRequestException("Coudln't fetch sensors");
    }
    return sensors;
  }

  @Get('aggregate/hourly')
  @HttpCode(HttpStatus.OK)
  async getHourlyAggregatedData() {
    this.logger.log('Fetching hourly aggregated data');
    const hourlyAggregatedData = this.sensorsService.getHourlyAggregatedData();
    if(!hourlyAggregatedData){
      throw new BadRequestException("Coudln't aggregate sensors data");
    }
    return hourlyAggregatedData;
  }

  @Get('malfunction')
  @HttpCode(HttpStatus.OK)
  async getMalfunctioningSensors() {
    this.logger.log('Fetching malfunctioning sensors');
    const malfunctionSensors = this.sensorsService.getMalfunctioningSensors();
    if(!malfunctionSensors){
      throw new BadRequestException("Coudln't fetch malfunction sensors");
    }
    return malfunctionSensors;
  }

  @Get('report/weekly')
  @HttpCode(HttpStatus.OK)
  async getWeeklyReport() {
    this.logger.log('Fetching weekly aggregated data');
    const weeklyAggregatedData = this.aggregatedDataService.getWeeklyAggregatedData();
    if(!weeklyAggregatedData){
      throw new BadRequestException("Coudln't fetch malfunction sensors");
    }
    return weeklyAggregatedData;
  }
}
