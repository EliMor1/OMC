import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SensorManager from './components/SensorsManager/SensorManager';
import MalfunctionReport from './components/MalfunctionSensors/MalfunctionSensors';
import WeeklyReport from './components/WeeklyReport/WeeklyReport';
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <nav>
          <ul>
            <li><Link to="/weekly-report">Weekly Report</Link></li>
            <li><Link to="/malfunction-report">Malfunction Report</Link></li>
            <li><Link to="/">Sensors Homepage</Link></li>
          </ul>
        </nav>
      <Routes>
        <Route path="/" element={<SensorManager />} />
        <Route path="malfunction-report" element={<MalfunctionReport />} />
        <Route path="weekly-report" element={<WeeklyReport />} />
      </Routes>
    </Router>
  );
};

export default App;
