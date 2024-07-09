/* eslint-disable prettier/prettier */
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AggregatedDataService } from './sensors/aggregated-data.service';
import * as cron from 'node-cron';

async function bootstrap() {
    const logger = new Logger(bootstrap.name);
    dotenv.config();
    const PORT = process.env.PORT || 3001;
    const cors = process.env.CORS_URI;
    const app = await NestFactory.create(AppModule);

    const aggregatedDataService = app.get(AggregatedDataService);
    
    cron.schedule('0 * * * *', () => {
      aggregatedDataService.aggregateHourlyData();
    });

    app.enableCors({
        origin: cors,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });

    app.setGlobalPrefix('/api');

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    app.listen(PORT).then(() =>
        logger.log(bootstrap.name, `listening on port ${PORT} ...`),
    );
}
bootstrap();
