import { useState } from 'react';
import PlayerSearchBar from './PlayerSearchBar';
import PlayerSearchResults from './PlayerSearchResults';

export default function PlayerSearch({ players, onChangeSelectedPlayer }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState({});
    
    const handleInputChange = newValue => {
        setSearchTerm(newValue);
    }

    const handlePlayerClick = newPlayer => {
        if (newPlayer === selectedPlayer) {
            setSelectedPlayer({});
        } else {
            setSelectedPlayer(newPlayer);
        }
        onChangeSelectedPlayer(newPlayer);
    }
    
    return (
        <div style={{backgroundColor: "#888888"}}>
            <h3>Player Search</h3>
            <div className="container">
                <PlayerSearchBar onChange={handleInputChange} />
                <PlayerSearchResults searchTerm={searchTerm} players={players} onClick={handlePlayerClick} />
            </div>
        </div>
    )
}