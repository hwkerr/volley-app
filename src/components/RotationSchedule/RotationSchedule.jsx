import { useState } from 'react';
import VolleyDisplay from './VolleyDisplay';
import OrganizerInput from './OrganizerInput';
import { exampleRounds, getRounds } from './rounds';

export default function RotationSchedule() {
    const [rounds, setRounds] = useState([]);

    const updateParams = (courts, players, playersPerTeam) => {
    console.log(courts + " courts");
    console.log(players + " partial teams");
    console.log(playersPerTeam + " partials per team");
    const newRounds = getRounds(courts, players, playersPerTeam, 10);
        setRounds(newRounds);
    };

    return (
    <div className="App-body">
        <p>
            Rotation Schedule
        </p>
        <OrganizerInput updateParams={updateParams} />
        <VolleyDisplay rounds={rounds}/>
    </div>
    );
}