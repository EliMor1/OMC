/* eslint-disable prettier/prettier */
import { IsNumber, IsString, IsNotEmpty, IsDate, IsDateString, } from 'class-validator';
export class SensorDTO {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly face: string;

    @IsNotEmpty()
    @IsNumber()
    readonly temperature: number;

    @IsNotEmpty()
    @IsString()
    @IsDate()
    @IsDateString()
    @IsNumber()
    readonly lastUpdated: number | Date;
}