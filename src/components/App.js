import { useState } from 'react';
import './App.css';
import VolleyDisplay from './VolleyDisplay';
import OrganizerInput from './OrganizerInput';
import { exampleRounds, getRounds } from '../rounds';

function App() {
  const [rounds, setRounds] = useState([]);

  const updateParams = (courts, players, playersPerTeam) => {
    console.log(courts + " courts");
    console.log(players + " partial teams");
    console.log(playersPerTeam + " partials per team");
    const newRounds = getRounds(courts, players, playersPerTeam);
    setRounds(newRounds);
  };

  return (
    <div className="App">
      <header className="App-header">
        <OrganizerInput updateParams={updateParams} />
        <p>
          Volley App
        </p>
        <VolleyDisplay rounds={rounds}/>
      </header>
    </div>
  );
}

export default App;
