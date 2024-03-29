import { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerDetails from './PlayerDetails';
import PlayerSearch from './PlayerSearch';
import { newPlayerObj } from './players';

import { getPlayerFromDatabase, savePlayerToDatabase, deletePlayerFromDatabase } from './playersDB';
const ADDED_DELAY = 100;

export default function PeopleTool() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState({});
    const [loadedDetails, setLoadedDetails] = useState(false);

    useEffect(() => {
        getPlayerFromDatabase("all")
        .then(res => {
            console.log(`Found ${res.data.Count} item(s) in database`);
            setPlayers(res.data.Items);
        }).catch(err => {
            console.log(err);
        });
    }, []);
    
    const handleChangeSelectedPlayer = player => {
        if (player === selectedPlayer)
            setSelectedPlayer({});
        else {
            setSelectedPlayer(player);
            setLoadedDetails(false);
            setTimeout(() => setLoadedDetails(true), ADDED_DELAY);
        }
    };

    const PlayerKit = {
        save: async player => {
            console.log("Save player", player.id, player.name);
            try {
                const res = await savePlayerToDatabase(player);
                console.log(res);
                addOrUpdatePlayer(player); // local
                setSelectedPlayer(player);
                return true;
            } catch (err) {
                console.error("Error:", err);
                alert("Failed to save player to database. Check console for logs");
                return false
            }
        },
        cancel: () => {
            if (selectedPlayer.id === newPlayerObj.id)
                setSelectedPlayer({});
        },
        delete: async player => {
            if (!window.confirm(`Are you sure you would like to delete the player: ${player.name.first} ${player.name.last}?`)) {
                alert("Cancelled delete");
                return false;
            };
            console.log("Remove player", player.id);
            try {
                const res = await deletePlayerFromDatabase(player.id); // database
                console.log(res);
                removePlayer(player); // local
                setSelectedPlayer({});
                return true;
            } catch (err) {
                console.error("Error:", err);
                alert("Failed to delete player from database. Check console for logs");
                return false;
            }
        }
    };

    const addOrUpdatePlayer = player => {
        const idToUpdate = player.id;
        let playerToUpdate = players.find(p => p.id === idToUpdate);
        if (playerToUpdate === undefined) { // doesn't exist yet -> ADD
            playerToUpdate = player;
            setPlayers(prev => ([...prev, player]))
        } else { // aleady exists -> UPDATE
            for (const property in playerToUpdate) {
                playerToUpdate[property] = player[property];
            }
        }
        return playerToUpdate;
    };

    const removePlayer = player => {
        const originalSize = players.length;
        const idToRemove = player.id;
        const newPlayers = players.filter(p => p.id !== idToRemove);
        setPlayers(newPlayers);
        return originalSize > newPlayers.length; // removed any
    };

    return (
        <div className="PeopleTool" style={{backgroundColor: "#444444"}}>
            <h3 className="center">People Tool</h3>
            <div className="container">
                <div className="row">
                    <div className="col-sm scroll">
                        <PlayerSearch players={players} selectedPlayerId={selectedPlayer.id} onChangeSelectedPlayer={handleChangeSelectedPlayer} />
                    </div>
                    <div className="col-sm">
                        {loadedDetails ?
                            selectedPlayer && Object.keys(selectedPlayer).length > 0 ? (
                                <PlayerDetails player={selectedPlayer} onSave={PlayerKit.save} onCancel={PlayerKit.cancel} onDelete={PlayerKit.delete} />
                            ) : (
                                <p>No player selected.</p>
                            ) :
                            <p>...</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}