import React, { useState } from 'react';
import { getSchedule } from './ScheduleGenerator';
import LeagueScheduleDisplay from './LeagueScheduleDisplay';

export default function LeagueSchedule() {
    const [scheduleToDisplay, setScheduleToDisplay] = useState({});
    const [teamCountInput, setTeamCountInput] = useState("");
    const [teamCount, setTeamCount] = useState("");

    const showAppropriateSchedule = event => {
        event.preventDefault();
        setTeamCount(teamCountInput);
        setScheduleToDisplay(getSchedule(teamCountInput));
    }

    const handleTeamCountInputChange = event => {
        setTeamCountInput(parseInt(event.target.value));
    }
    
    return (
        <div className="App-body">
            <p>League Schedule component</p>

            <input type="number"
                    placeholder="Number of teams"
                    value={teamCountInput}
                    onChange={handleTeamCountInputChange}
                    style={teamCount === teamCountInput ? {} : {}}/>
            <button onClick={showAppropriateSchedule}>Generate Schedule</button>
            <LeagueScheduleDisplay schedule={scheduleToDisplay} />
        </div>
    );
}