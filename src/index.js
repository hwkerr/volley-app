import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import App from './components/App';
import RotationSchedule from './components/RotationSchedule/RotationSchedule';
import PeopleTool from './components/PeopleTool/PeopleTool';
import EventTool from './components/EventTool/EventTool';
import Scheduler from './components/Scheduler/Scheduler';
import LeagueSchedule from './components/LeagueSchedule/LeagueSchedule';
import BulkUploadPlayers from './components/PeopleTool/BulkUploadPlayers/BulkUploadPlayers';

console.clear();

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="rotation" element={<RotationSchedule />} />
        <Route path="players" element={<PeopleTool />} />
        <Route path="events" element={<EventTool />} />
        <Route path="scheduler" element={<Scheduler />} />
        <Route path="league" element={<LeagueSchedule />} />
        <Route path="addplayers" element={<BulkUploadPlayers />} />
        <Route path="*" element={<div className="App-body">There's nothing here</div>}/>
      </Route>
    </Routes>
  </BrowserRouter>
);
