import React, { useState } from "react";

export default function MatchupTracker({ schedule }) {
    const [targetTeam, setTargetTeam] = useState('');

    const handleClick = event => {
        console.log("Schedule:", schedule);
        if (targetTeam) console.log("Target", targetTeam);
        const matches = schedule.getAllMatches(targetTeam || undefined);
        console.log("Team: " + (targetTeam||'ANY'), matches);
        const getOtherTeamInMatch = (match, teamToIgnore) => (
            match.reduce((otherTeam, currentTeam) => currentTeam !== teamToIgnore ? currentTeam : otherTeam)
        );
        if (targetTeam) {
            const opponents = matches.map(match => getOtherTeamInMatch(match, targetTeam));
            console.log("Opponents", opponents);
        }
    }
    
    return (
        <React.Fragment>
            <h3>Tracker</h3>
            <input type="text" value={targetTeam} onChange={e => setTargetTeam(e.target.value)} placeholder="Team Name" />
            <button onClick={handleClick}>Log</button>
        </React.Fragment>
    );
}