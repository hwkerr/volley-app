import React, { useState } from "react";

export default function MatchupTracker({ schedule }) {
    const [targetTeam, setTargetTeam] = useState('');

    const handleClick = event => {
        if (targetTeam) console.log("Target", targetTeam);
        const matches = schedule.getAllMatches(targetTeam || undefined);
        console.log("Team " + (targetTeam||'ANY') + " Matches", matches);
        const getOtherTeamInMatch = (match, teamToIgnore) => (
            match.reduce((otherTeam, currentTeam) => currentTeam !== teamToIgnore ? currentTeam : otherTeam)
        );
        if (targetTeam) {
            const opponents = matches.map(match => getOtherTeamInMatch(match, targetTeam));
            console.log("Opponents", opponents);
        }
    }

    const getOtherTeamInMatch = (match, teamToIgnore) => (
        match.reduce((otherTeam, currentTeam) => currentTeam !== teamToIgnore ? currentTeam : otherTeam)
    );

    const getOpponents = team => {
        const matches = schedule.getAllMatches(team || undefined);
        const opponents = matches.map(match => getOtherTeamInMatch(match, team));
        return opponents.map(opp => opp === "" ? "N/A": opp);
    }

    const getUnique = list => {
        const alreadyExists = [];
        return list.map(item => {
            if (!alreadyExists.includes(item)) {
                alreadyExists.push(item);
                return item;
            }
        }).filter(item => item !== undefined);
    }

    const getRepeatTeams = (team, opponentsList) => {
        const opponents = (opponentsList || getOpponents(team)).filter(opp => opp !== "N/A");
        const playedList = [];
        const repeats = [];
        opponents.forEach(opp => {
            if (playedList.includes(opp))
                repeats.push(opp);
            playedList.push(opp);
        });
        return repeats;
    }

    const tdStyle = {
        width: "1%",
        whiteSpace: "nowrap",
        margin: "0"
    };
    const makeTeamRows = () => {
        const allTeams = schedule.getAllTeams().sort();
        const separator = ", ";
        return (
            allTeams.map(team => {
                const opponents = getOpponents(team);
                const uniqueOpponents = getUnique(opponents);
                const repeats = getRepeatTeams(team, opponents);
                return (
                    <tr key={team}>
                        <td style={tdStyle}>{team}</td>
                        <td style={tdStyle}>{uniqueOpponents.join(separator)}</td>
                        <td style={tdStyle}>{allTeams.filter(otherteam => !opponents.includes(otherteam)).join(separator)}</td>
                        <td style={tdStyle}>{repeats.join(separator)}</td>
                    </tr>
                );
            })
        );
    }
    
    return (
        <React.Fragment>
            <h3>Tracker</h3>
            <input type="text" value={targetTeam} onChange={e => setTargetTeam(e.target.value)} placeholder="Team Name" />
            <button onClick={handleClick}>Log</button>
            <br/>
            <br/>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th>Played</th>
                            <th>Not Played</th>
                            <th>Repeats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {makeTeamRows()}
                    </tbody>
                </table>
                
            </div>
        </React.Fragment>
    );
}