import React, { useState } from "react";
import "./GameSchedule.css";
import { FORMAT } from "./TeamFormatSelector";

const colors = [
    "bg-sky",
    "bg-green",
    "bg-yellow",
    "bg-purple",
    "bg-pink",
    "bg-orange",
    "bg-lightred",
    "bg-smoke",
    "bg-darkred",
    "bg-ivory"
];

const teams = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6"
]

const warmUpTime = 10;
const allowedOvertime = 15;

export default function GameSchedule({rounds, format}) {
    const [showExpectedTimes, shouldShowExpectedTimes] = useState(false);
    
    const getTableHeader = () => {
        const teamSlots = [...Array(format.courts).keys()];
        return (
            <thead>
                <tr className="bg-light-gray">
                    <th className="text-uppercase">Round</th>
                    {teamSlots.map(num => (
                        <th key={num} className="text-uppercase" colSpan={2}>{num+1}</th>
                    ))}
                    {showExpectedTimes && <th className="text-uppercase">Start Time</th>}
                </tr>
            </thead>
        );
    };

    const getTableRow = (round, i) => {
        const roundsPerOpponent = [...Array(format.games).keys()];
        return (
            <React.Fragment key={i}>
                {roundsPerOpponent.map(game => {
                    const roundNumber = ((i+1)*format.games)-((format.games-1)-game);
                    const roundStartTime = getStartTime(roundNumber-1);
                    const endCutoff = addMinutes(format.start, (format.hours*60)-(getGameDuration()-allowedOvertime));
                    const outOfTimeRange = roundStartTime > endCutoff;
                    return (
                        <tr key={game}>
                            <td className="align-middle bg-light-gray round-number" style={{backgroundColor: "lightgray"}}>Round {roundNumber}</td>
                            {round.map((matchup, j) => {
                                if (j < format.courts)
                                    return ( matchup ?
                                        <React.Fragment key={j}>
                                            {getTableCell(matchup[0])}
                                            {getTableCell(matchup[1])}
                                        </React.Fragment> :
                                        <React.Fragment key={j}>
                                            {getTableCell()}
                                            {getTableCell()}
                                        </React.Fragment>
                                    );
                                else
                                    return <React.Fragment key={j}></React.Fragment>;
                            })}
                            {showExpectedTimes && <td className="align-middle bg-light-gray" style={{backgroundColor: (outOfTimeRange ? "lightcoral" : "lightgray")}}>{getTimeString(roundStartTime)}</td>}
                        </tr>
                    );
                })}
                
            </React.Fragment>
        );
    };

    const getTableCell = team => {
        return ( team ?
            <td key={team}>
                <span className={`${getTeamColor(team)} padding-5px-tb padding-15px-lr border-radius-5 margin-10px-bottom font-size16 xs-font-size13`}>
                    {team<=teams.length ? teams[team-1] : team}
                </span>
            </td> :
            <td />
        );
    };

    const getTeamColor = teamNumber => {
        if (colors.length >= teamNumber)
            return colors[teamNumber-1];
        else return "text-white";
    };

    const getGameDuration = () => {
        const minutesFor25Points = 25;
        let gameDuration = minutesFor25Points * (format.points/25);
        if (format.teamFormat === FORMAT.TEAMS)
            gameDuration = gameDuration + 4;
        return gameDuration;
    }

    const getStartTime = roundIndex => {
        const minutesToAdd = (roundIndex*getGameDuration()) + warmUpTime;
        const time = addMinutes(format.start, minutesToAdd);
        return time;
    }
    
    const getTimeString = time => {
        const timeString = (time.getHours()%12) + ":" + (time.getMinutes().toString().padStart(2, "0"))
        return timeString;
    }

    const addMinutes = (initial, minutesToAdd) => {
        return new Date(initial.getTime() + (minutesToAdd * 60000));
    }

    const handleExpectedTimesCheckbox = e => {
        const newVal = (e.target.checked);
        shouldShowExpectedTimes(newVal);
    }

    // Table taken from: https://www.bootdey.com/snippets/view/time-table
    return (
        <div>
            <div className="container">
                <div className="timetable-img text-center">
                    <img src="img/content/timetable.png" alt="" />
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered text-center">
                        {getTableHeader()}
                        <tbody className="GameSchedule">
                            {rounds.map(getTableRow)}
                            {showExpectedTimes && (
                                <tr>
                                    <td className="align-middle" style={{backgroundColor: "#dee2e6"}}>End</td>
                                    {[...Array(format.courts).keys()].map(court => (
                                        <React.Fragment key={court}>
                                            <td className="align-middle" style={{backgroundColor: "#dee2e6"}}>-</td>
                                            <td className="align-middle" style={{backgroundColor: "#dee2e6"}}>-</td>
                                        </React.Fragment>
                                    ))}
                                    <td className="align-middle" style={{backgroundColor: "#dee2e6"}}>{getTimeString(getStartTime((rounds.length * format.games)))}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="checkShowExpectedTimes" name="showExpectedTimes" value={showExpectedTimes} onClick={handleExpectedTimesCheckbox} />
                    <label className="form-check-label">Show Expected Start Times</label>
                </div>
            </div>
        </div>
    );
}