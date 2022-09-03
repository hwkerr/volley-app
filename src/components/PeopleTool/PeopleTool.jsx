import { useState } from 'react';
import './PeopleTool.css';
import PlayerDetails from './PlayerDetails';
import PlayerSearch from './PlayerSearch';

import { playerList } from './players'; // TODO: Use database

export default function PeopleTool() {
    const [players, setPlayers] = useState(playerList);
    const [selectedPlayer, setSelectedPlayer] = useState({});

    const handleChangeSelectedPlayer = player => {
        if (player === selectedPlayer)
            setSelectedPlayer({});
        else
            setSelectedPlayer(player);
    }

    const addPlayer = player => {
        const newPlayers = [...players, player];
        setPlayers(newPlayers);
    }

    const updatePlayer = player => {
        const idToUpdate = player.id;
        const playerToUpdate = players.find(p => p.id === idToUpdate);
        playerToUpdate.name = player.name;
        playerToUpdate.gender = player.gender;
        playerToUpdate.positions = player.positions;
        playerToUpdate.contact = player.contact;
        playerToUpdate.timesPlayed = player.timesPlayed;
    }

    const addOrUpdatePlayer = player => {
        const idToUpdate = player.id;
        const playerToUpdate = players.find(p => p.id === idToUpdate);
        if (playerToUpdate === undefined) {
            const newPlayers = [...players, player];
            setPlayers(newPlayers);
        } else {
            playerToUpdate.name = player.name;
            playerToUpdate.gender = player.gender;
            playerToUpdate.positions = player.positions;
            playerToUpdate.contact = player.contact;
            playerToUpdate.timesPlayed = player.timesPlayed;
        }
    }

    const handleSavePlayer = (player) => {
        addOrUpdatePlayer(player);
        // TODO: add or update in database
        setSelectedPlayer(player);
    };

    return (
        <div className="PeopleTool" style={{backgroundColor: "#444444"}}>
            <h3 className="Center" onClick={() => console.log(players)}>People Tool</h3>
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <PlayerSearch players={players} onChangeSelectedPlayer={handleChangeSelectedPlayer} />
                    </div>
                    <div className="col-sm">
                        {selectedPlayer && Object.keys(selectedPlayer).length > 0 ? (
                            <PlayerDetails player={selectedPlayer} onSave={handleSavePlayer} />
                        ) : (
                            <p>No player selected.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}