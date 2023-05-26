import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { newPlayerObj } from './players';
import PlayerSearchResults from './PlayerSearchResults';
import { getFilteredPlayersList } from '../../search';

export default function PlayerSearch({ players, selectedPlayerId, onChangeSelectedPlayer }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [resultsCount, setResultsCount] = useState(0);

    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const handleInputChange = event => {
        const newInput = event.target.value;
        setSearchTerm(newInput);
    }

    const handlePlayerClick = newPlayer => {
        onChangeSelectedPlayer(newPlayer);
    }

    useEffect(() => {
        const newFilteredPlayersList = getFilteredPlayersList(players, searchTerm);
        setResultsCount(newFilteredPlayersList.length);
        setFilteredPlayers(newFilteredPlayersList);
        setLoaded(true);
    }, [searchTerm, players]);

    const handlePlayerClicked = (player) => {
        handlePlayerClick(player);
    }

    const handleNewPlayerButton = () => {
        handlePlayerClick(newPlayerObj);
    }

    const getRow = (player, i) => {
        const isSelected = (
            player !== {} &&
            player !== undefined &&
            selectedPlayerId === player.id
        );
        return (
            <div key={i} className={`list-item item ${isSelected ? "selected" : ""}`} onClick={() => handlePlayerClicked(player)}>
                <p>{i+1}. {player.name.first + ' ' + player.name.last}</p>
            </div>
        );
    };
    
    return (
        <div style={{backgroundColor: "#888888"}}>
            <h3>Players ({resultsCount})</h3>
            <div className="container">
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Name" value={searchTerm} onChange={handleInputChange}></input>
                </div>
                <div>
                    {loaded ?
                        <>
                            <div className={`list-item item ${(selectedPlayerId === newPlayerObj.id ) ? "selected" : ""}`} onClick={handleNewPlayerButton}>
                                <p>+ add player</p>
                            </div>
                            {filteredPlayers.map((player, i) => getRow(player, i))}
                        </> :
                        <div className={`list-item only-item`}>
                            <Spinner className="center" animation="border" />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}