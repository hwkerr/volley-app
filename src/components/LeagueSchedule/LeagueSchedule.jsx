import React, { useState } from 'react';
import { getSchedule } from './ScheduleGenerator';
import LeagueScheduleDisplay from './LeagueScheduleDisplay';
import ManualSchedulingTool from './ManualSchedulingTool';

export default function LeagueSchedule() {
    const [scheduleToDisplay, setScheduleToDisplay] = useState({});
    const [teamCountInput, setTeamCountInput] = useState("");
    const [teamCount, setTeamCount] = useState("");
    const [useEmptySchedule, setUseEmptySchedule] = useState(false);

    const showAppropriateSchedule = event => {
        event.preventDefault();
        setTeamCount(teamCountInput);
        console.log("Team Count:", teamCountInput);
        const schedule = getSchedule(teamCountInput);
        setUseEmptySchedule(false);
        setScheduleToDisplay(schedule);
    }

    const showEmptySchedule = event => {
        event.preventDefault();
        setTeamCount(teamCountInput);
        console.log("Team Count:", teamCountInput, "(empty)");
        setUseEmptySchedule(true);
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
                    min={0}
                    onChange={handleTeamCountInputChange}
                    style={(teamCount === teamCountInput && teamCount !== "") ? {backgroundColor: "limegreen"} : {}}/>
            <button onClick={showAppropriateSchedule}>Generate Schedule</button>
            <button onClick={showEmptySchedule}>Empty</button>
            <br />
            {useEmptySchedule ?
                <ManualSchedulingTool teamCount={teamCount} weekCount={7} blockCount={2} /> : 
                <LeagueScheduleDisplay schedule={scheduleToDisplay} empty={useEmptySchedule}/>
            }
        </div>
    );
}