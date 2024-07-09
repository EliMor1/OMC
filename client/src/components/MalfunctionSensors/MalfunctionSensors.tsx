import React, { useEffect, useState } from 'react';
import { IMalfunctioningSensor } from '../../common/interfaces/Sensor.interface';
import { SensorService } from '../../services/Sensor.service'

import './MalfunctionSensors.css';

function MalfunctionReport() {
  const [data, setData] = useState<IMalfunctioningSensor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMalfunctioningSensors = async () => {
      const result = await SensorService.getInstance().getMalfunctioningSensors();
      if (typeof result === 'string') {
        setError(result);
      } else {
        setData(result);
      }
    };

    fetchMalfunctioningSensors();
  }, []);

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="malfunction-report">
      <h2>Malfunctioning Sensors</h2>
      {data.map((sensor, index) => (
        <div key={index} className="malfunction-item">
          <h3>Sensor {sensor.id}</h3>
          <p>Average Temperature: {sensor.temperature}°C</p>
        </div>
      ))}
    </div>
  );
}

export default MalfunctionReport;
