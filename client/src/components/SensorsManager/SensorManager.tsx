import React, { useEffect, useState } from 'react';
import './SensorManager.css';
import { ISensor } from '../../common/interfaces/Sensor.interface';
import { SensorService } from '../../services/Sensor.service';

const SensorManager = () => {
  const [sensors, setSensors] = useState<ISensor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const result = await SensorService.getInstance().getAllSensors();
        if (typeof result === 'string') {
          setError(result);
        } else {
          setSensors(result);
        //   console.log(sensors);
        }
      } catch (err) {
        setError('Failed to fetch sensors');
      }
    };

    fetchSensors();
    const interval = setInterval(fetchSensors, 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="sensor-manager">
      <h2>Sensor Manager</h2>
      <div className="sensor-list">
        {sensors && sensors.length === 0 ? (
          <p>No sensors found</p>
        ) : (
          sensors && sensors.map(sensor => (
            <div key={sensor.id} className="sensor-item">
              <span>ID: {sensor.id}</span>
              <span>Face: {sensor.face}</span>
              <span>Temperature: {sensor.temperature}°C</span>
              <span>Last Updated: {new Date(sensor.lastUpdated).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SensorManager;
