import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IAggregatedData } from '../../common/interfaces/Sensor.interface';
import './WeeklyReport.css';
import { SensorService } from '../../services/Sensor.service';

const WeeklyReport: React.FC = () => {
  const [report, setReport] = useState<Record<string, Record<string, IAggregatedData[]>>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklyReport = async () => {
      const result = await SensorService.getInstance().getWeeklyReport();
      if (typeof result === 'string') {
        setError(result);
        setLoading(false);
      } else {
        setReport(result);
        setLoading(false);
      }
    };

    fetchWeeklyReport();
  }, []);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="weekly-report">
      <h2>Weekly Aggregated Temperature Report</h2>
      {Object.keys(report).map(date => (
        <div key={date} className="date-section">
          <h3>{date}</h3>
          {Object.keys(report[date]).map(face => (
            <div key={face} className="face-section">
              <h4>{face}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Hour</th>
                    <th>Average Temperature (°C)</th>
                  </tr>
                </thead>
                <tbody>
                  {report[date][face].map(data => (
                    <tr key={`${data.date}-${data.hour}`}>
                      <td>{data.hour}</td>
                      <td>{data.averageTemperature}°C</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WeeklyReport;
