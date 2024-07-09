/* eslint-disable prettier/prettier */
export interface ISensor {
  face: 'north' | 'east' | 'south' | 'west';
  temperature: number;
  id:number;
  lastUpdated: number | Date;
}

export interface IMalfunctioningSensor {
  id: number;
  face: 'north' | 'east' | 'south' | 'west'; 
  temperature: number;
  lastUpdated: number; // Unix timestamp of the last update
}

  