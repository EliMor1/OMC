export interface ISensor {
  face: 'north' | 'east' | 'south' | 'west';
  temperature: number;
  id:number;
  lastUpdated: number; // Unix timestamp of the last update
}

export interface IMalfunctioningSensor {
  id: number;
  face: 'north' | 'east' | 'south' | 'west'; 
  temperature: number;
  lastUpdated: number; // Unix timestamp of the last update
}


export interface IAggregatedData {
  date: string;
  face: 'north' | 'south' | 'east' | 'west';
  hour: number;
  averageTemperature: number;
}
  