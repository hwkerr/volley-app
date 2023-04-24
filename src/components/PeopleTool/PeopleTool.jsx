import { useState } from 'react';
import './PeopleTool.css';
import PlayerDetails from './PlayerDetails';
import PlayerSearch from './PlayerSearch';

import { playerList } from './players'; // TODO: Use database

const ADDED_DELAY = 100;

export default function PeopleTool() {
    const [players, setPlayers] = useState(playerList);
    const [selectedPlayer, setSelectedPlayer] = useState({});
    const [loadedDetails, setLoadedDetails] = useState(false);

    const handleChangeSelectedPlayer = player => {
        if (player === selectedPlayer)
            setSelectedPlayer({});
        else {
            setSelectedPlayer(player);
            setLoadedDetails(false);
            setTimeout(() => setLoadedDetails(true), ADDED_DELAY);
        }
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

    const PlayerKit = {
        save: player => {
            console.log("Save player", player.id);
            addOrUpdatePlayer(player); // local
            // TODO: add or update in database
            setSelectedPlayer(player);
            console.log(player);
            return true;
        },
        delete: player => {
            console.log("Remove player", player.id);
            alert("Will delete player: " + player.name);
            const result = removePlayer(player); // local
            // TODO: remove in database
            setSelectedPlayer({});
            return result;
        }
    }

    const addOrUpdatePlayer = player => {
        const idToUpdate = player.id;
        const playerToUpdate = players.find(p => p.id === idToUpdate);
        if (playerToUpdate === undefined) { // doesn't exist yet -> ADD
            setPlayers(prev => ([...prev, player]))
        } else { // aleady exists -> UPDATE
            for (const property in playerToUpdate) {
                playerToUpdate[property] = player[property];
            }
        }
    }

    const removePlayer = player => {
        const originalSize = players.length;
        const idToRemove = player.id;
        const newPlayers = players.filter(p => p.id !== idToRemove);
        setPlayers(newPlayers);
        return originalSize > newPlayers.length; // removed any
    }

    const handleSavePlayer = (player) => {
        addOrUpdatePlayer(player);
        console.log("Save player", player);
        // TODO: add or update in database
        setSelectedPlayer(player);
    };

    return (
        <div className="PeopleTool" style={{backgroundColor: "#444444"}}>
            <h3 className="Center" onClick={() => console.log(players)}>People Tool</h3>
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <PlayerSearch players={players} selectedPlayerId={selectedPlayer.id} onChangeSelectedPlayer={handleChangeSelectedPlayer} />
                    </div>
                    <div className="col-sm">
                        {loadedDetails ?
                            selectedPlayer && Object.keys(selectedPlayer).length > 0 ? (
                                <PlayerDetails player={selectedPlayer} onSave={PlayerKit.save} onDelete={PlayerKit.delete} />
                            ) : (
                                <p>No player selected.</p>
                            ) :
                            <p>loading...</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}