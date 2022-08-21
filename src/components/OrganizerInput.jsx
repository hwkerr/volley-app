import { useState } from 'react';

export default function OrganizerInput({ updateParams }) {
    const [courtCount, setCourtCount] = useState(2);
    const [playerCount, setPlayerCount] = useState(10);
    const [playersPerTeam, setPlayersPerTeam] = useState(2);

    const handleCourtCountChange = event => {
        setCourtCount(parseInt(event.target.value));
    }

    const handlePlayerCountChange = event => {
        setPlayerCount(parseInt(event.target.value));
    }

    const handlePlayersPerTeamChange = event => {
        setPlayersPerTeam(parseInt(event.target.value));
    }

    const handleButtonClick = () => {
        console.log("Input submitted");
        updateParams(courtCount, playerCount, playersPerTeam);
    }

    return (
        <div>
            <div>
                <label>Number of Courts: </label>
                <input type="number" min="1" value={courtCount} onChange={handleCourtCountChange}></input>
            </div>
            <div>
                <label>Number of Players: </label>
                <input type="number" min="1" value={playerCount} onChange={handlePlayerCountChange}></input>
            </div>
            <div>
                <label>Number of Players per Team: </label>
                <input type="number" min="1" value={playersPerTeam} onChange={handlePlayersPerTeamChange}></input>
            </div>
            <button onClick={handleButtonClick}>Submit</button>
        </div>
    );
}