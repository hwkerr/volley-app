import { newPlayerObj } from './players';
import Spinner from 'react-bootstrap/Spinner';
import { useEffect, useState } from 'react';
import { getFilteredPlayersList } from '../../search';

export default function PlayerSearchResults({ searchTerm, players, selectedPlayerId, onClick, setResultsCount }) {
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const newFilteredPlayersList = getFilteredPlayersList(players, searchTerm);
        setResultsCount(newFilteredPlayersList.length);
        setFilteredPlayers(newFilteredPlayersList);
        setLoaded(true);
    }, [searchTerm, players]);

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
            <div key={i} className={`list-item item ${isSelected ? "selected" : ""}`} onClick={() => handlePlayerClicked(player)}>
                <p>{i+1}. {player.name.first + ' ' + player.name.last}</p>
            </div>
        );
    };
    
    return (
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
    );
}