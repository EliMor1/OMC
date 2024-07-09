import axios from 'axios';
import * as ApiServiceEnums from "../common/enums/apiService";
import { ISensor, IAggregatedData, IMalfunctioningSensor } from '../common/interfaces/Sensor.interface';

export class SensorService {

    // singleton usage
    private static instance: SensorService;
    static getInstance() {
        if (!this.instance) {
            this.instance = new SensorService();
        }
        return this.instance;
    }

    async getAllSensors(): Promise<string | ISensor[] > {
        try {
            const response = await axios.get(
                ApiServiceEnums.ApiService.SERVER_ENDPOINT_ORIGIN +
                ApiServiceEnums.ApiService.SENSORS
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getWeeklyReport(): Promise<string |  Record<string, Record<string, IAggregatedData[]>>> {
        try {
            const response = await axios.get(
                ApiServiceEnums.ApiService.SERVER_ENDPOINT_ORIGIN +
                ApiServiceEnums.ApiService.SENSORS + '/report/weekly'
            );
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getMalfunctioningSensors(): Promise<string | IMalfunctioningSensor[] > {
        try {
            const response = await axios.get(
                ApiServiceEnums.ApiService.SERVER_ENDPOINT_ORIGIN +
                ApiServiceEnums.ApiService.SENSORS + '/malfunction'
            );
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    private handleError(error: any): string {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Server responded with a status other than 200 range
                return error.response.data.message || 'An error occurred';
            } else if (error.request) {
                // Request was made but no response was received
                return 'No response received from server';
            } else {
                // Something happened in setting up the request
                return error.message;
            }
        }
        return 'An unexpected error occurred';
    }
}
