import { useState } from 'react';
import { newPlayerObj } from './players';

export default function PlayerSearchResults({ searchTerm, players, onClick }) {
    const [selectedPlayer, setSelectedPlayer] = useState({});

    const handlePlayerClicked = (player) => {
        if (player === selectedPlayer)
            setSelectedPlayer({});
        else
            setSelectedPlayer(player);
        onClick(player);
    }

    const handleNewPlayerButton = () => {
        console.log(JSON.stringify(players));
        if (newPlayerObj === selectedPlayer)
            setSelectedPlayer({});
        else
            setSelectedPlayer(newPlayerObj);
        onClick(newPlayerObj);
    }

    const getRow = (player, i) => (
        <div key={player.id} className={`listitem-name ${(selectedPlayer === player) ? "selected" : ""}`} onClick={() => handlePlayerClicked(player)}>
            <p>{i+1}. {player.name}</p>
        </div>
    );

    const getFilteredPlayersList = () => {
        let filteredPlayers = players;
        if (searchTerm !== "" && searchTerm !== undefined)
            filteredPlayers = players.filter(player => player.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return (
            filteredPlayers.length ?
            filteredPlayers.map((player, i) => getRow(player, i)) :
            <p>No players found.</p>
        );
    }
    
    return (
        <div>
            {getFilteredPlayersList()}
            <div className={`listitem-name ${(selectedPlayer === newPlayerObj ) ? "selected" : ""}`} onClick={handleNewPlayerButton}>
                <p>+ add player</p>
            </div>
        </div>
    );
}