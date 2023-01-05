import { useState } from 'react';
import './Scheduler.css';
import CourtCountSelector from './CourtCountSelector';
import GameSchedule from './GameSchedule';
import TeamFormatSelector, { FORMAT } from './TeamFormatSelector';
import TeamSizeSelector from './TeamSizeSelector';

import { rounds, formatFinder, makeRounds } from './schedule';


// If there is a BYE, it should not take up a court (don't include in <rounds> object in makeRounds(...))

// Pools; Playoffs

export default function Scheduler () {
    const [playerCount, setPlayerCount] = useState(36);
    const [availableCourtCount, setAvailableCourtCount] = useState(2);
    const [teamSize, setTeamSize] = useState(6);
    const [teamFormat, setTeamFormat] = useState(FORMAT.TEAMS);
    const [hours, setHours] = useState(2);
    const [games, setGames] = useState(1);
    const [points, setPoints] = useState(25);

    const updatePlayerCount = players => {
        setPlayerCount(players);
    };

    const updateTeamCount = teams => {
        setPlayerCount(teams*teamSize);
    };
    
    const requiredCourts = () => {
        const playersPerCourt = teamSize * 2;
        return Math.trunc(playerCount / playersPerCourt);
    };
    
    const getSittingCount = () => {

        const playersPerCourt = teamSize * 2;
        
        const multiple = roundDownToMultiple(playerCount, playersPerCourt); // number of players on infinite courts
        let leftover = playerCount - multiple; // number of leftover players given infinite courts

        const requiredCourts = Math.trunc(playerCount / playersPerCourt);
        leftover += Math.max(0, (requiredCourts - availableCourtCount) * playersPerCourt);

        return Math.max(0, leftover);
    };

    const getFormat = () => {
        return {
            start: new Date(0, 0, 0, 19, 0, 0),
            teams: Math.trunc(playerCount/teamSize),
            courts: Math.min(availableCourtCount, requiredCourts()),
            teamFormat: teamFormat,
            match: false,
            games: games,
            points: points,
            cap: points+2,
            tiebreak: 15,
            hours: hours
        };
    }

    const getConstants = () => {
        return {
            teams: Math.trunc(playerCount/teamSize),
            courts: Math.min(availableCourtCount, requiredCourts()),
            hours: hours
        };
    }

    const getDuration = () => {
        const format = getFormat();
        const rounds = (format.teams-1)*format.games;
        const minutesFor25Points = 25;
        const gameDuration = minutesFor25Points * (format.points/25);
        const totalDuration = rounds*gameDuration;
        return totalDuration;
    }

    const roundDownToMultiple = (num, multiple) => {
        if (multiple === 0) return num;

        let remainder = num % multiple;
        if (remainder === 0) return num;

        return num - remainder;
    };

    const getAlertType = () => {
        const requiredCourtCount = requiredCourts();
        const sittingPlayers = getSittingCount();
        if (sittingPlayers === 0) return "alert-success";
        if (availableCourtCount >= requiredCourtCount)
            return "alert-secondary";
        else if (availableCourtCount < requiredCourtCount)
            return "alert-danger";
        else return "alert-secondary";
    };

    return (
        <div className="Scheduler">
            <div className="container">
                <h3>Scheduler</h3>
                <div>
                    <div className="row">
                        <div className="col-4">
                            <div className="row">
                                <div className="col-sm">
                                    <div className="input-group">
                                        <label>
                                            Players
                                            <input id="playercount" type="number" className="form-control" placeholder="Player count" aria-label="Player count" min={0}
                                                value={playerCount} onChange={e => updatePlayerCount(parseInt(e.target.value))}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="col-sm">
                                    <div className="input-group">
                                        <label>
                                            Teams
                                            <input id="teamcount" type="number" className="form-control" placeholder="Team count" aria-label="Team count" min={0}
                                                value={Math.trunc(playerCount/teamSize)} onChange={e => updateTeamCount(parseInt(e.target.value))}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <CourtCountSelector onChange={setAvailableCourtCount} />
                            <br />
                            <TeamSizeSelector onChange={setTeamSize} />
                            <br />
                            {teamSize === 6 && <TeamFormatSelector onChange={setTeamFormat} />}
                            <br />
                            <div className="input-group">
                                <label>
                                    Hours
                                    <input id="hours" type="number" className="form-control" placeholder="Hours" aria-label="Player count" min={1}
                                        value={hours} onChange={e => setHours(parseInt(e.target.value))}
                                    />
                                </label>
                            </div>
                            <div className="row">
                                <div className="col-sm">
                                    <div className="input-group">
                                        <label>
                                            Games
                                            <input id="gameperopponent" type="number" className="form-control" placeholder="Games per opponent" aria-label="Games per opponent" min={1} max={3}
                                                value={games} onChange={e => setGames(parseInt(e.target.value))}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="col-sm">
                                    <div className="input-group">
                                        <label>
                                            Points
                                            <input id="pointspergame" type="number" className="form-control" placeholder="Points per game" aria-label="Points per game" min={0} max={30}
                                                value={points} onChange={e => setPoints(parseInt(e.target.value))}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <GameSchedule rounds={makeRounds(getConstants().teams, getConstants().courts)} format={getFormat()} />
                        </div>
                    </div>


                    <br />
                    <hr />
                    <br />
                    {/* <div className={`alert alert-info`} role="alert">
                        We will need {Math.round(((getDuration()+warmUpTime)/60)*100) / 100} hours to finish all games.
                    </div> */}
                    <div className={`alert ${getAlertType()}`} role="alert">
                        There will be {getSittingCount()} players sitting at a time
                    </div>
                </div>
            </div>
            <button onClick={e => makeRounds(getConstants().teams, getConstants().courts)}>Run Code</button>
        </div>
    );
}