import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import App from './components/App';
import RotationSchedule from './components/RotationSchedule/RotationSchedule';
import PeopleTool from './components/PeopleTool/PeopleTool';
import LeagueSchedule from './components/LeagueSchedule/LeagueSchedule';

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
        <Route path="league" element={<LeagueSchedule />} />
        <Route path="*" element={<div className="App-body">There's nothing here</div>}/>
      </Route>
    </Routes>
  </BrowserRouter>
);
