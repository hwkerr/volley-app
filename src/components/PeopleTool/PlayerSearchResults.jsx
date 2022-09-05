import { useState } from 'react';
import { newPlayerObj } from './players';

export default function PlayerSearchResults({ searchTerm, players, selectedPlayerId, onClick }) {

    const handlePlayerClicked = (player) => {
        onClick(player);
    }

    const handleNewPlayerButton = () => {
        onClick(newPlayerObj);
    }

    const getRow = (player, i) => {
        const isSelected = (
            player !== {} &&
            player !== undefined &&
            selectedPlayerId === player.id
        );
        return (
            <div key={i} className={`listitem-name ${isSelected ? "selected" : ""}`} onClick={() => handlePlayerClicked(player)}>
                <p>{i+1}. {player.name}</p>
            </div>
        );
    };

    const getFilteredPlayersList = () => {
        let filteredPlayers = players;
        if (searchTerm !== "" && searchTerm !== undefined)
            filteredPlayers = players.filter(player => player.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const comparePlayersByName = (a, b) => {
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            else return 0;
        }

        filteredPlayers.sort(comparePlayersByName);

        return (
            filteredPlayers.length ?
            filteredPlayers.map((player, i) => getRow(player, i)) :
            <p>No players found.</p>
        );
    }
    
    return (
        <div>
            {getFilteredPlayersList()}
            <div className={`listitem-name ${(selectedPlayerId === newPlayerObj.id ) ? "selected" : ""}`} onClick={handleNewPlayerButton}>
                <p>+ add player</p>
            </div>
        </div>
    );
}