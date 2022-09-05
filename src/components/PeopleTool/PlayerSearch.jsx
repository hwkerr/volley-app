import { useState } from 'react';
import PlayerSearchBar from './PlayerSearchBar';
import PlayerSearchResults from './PlayerSearchResults';

export default function PlayerSearch({ players, selectedPlayerId, onChangeSelectedPlayer }) {
    const [searchTerm, setSearchTerm] = useState("");
    
    const handleInputChange = newValue => {
        setSearchTerm(newValue);
    }

    const handlePlayerClick = newPlayer => {
        onChangeSelectedPlayer(newPlayer);
    }
    
    return (
        <div style={{backgroundColor: "#888888"}}>
            <h3>Player Search</h3>
            <div className="container">
                <PlayerSearchBar onChange={handleInputChange} />
                <PlayerSearchResults searchTerm={searchTerm} players={players} selectedPlayerId={selectedPlayerId} onClick={handlePlayerClick} />
            </div>
        </div>
    )
}