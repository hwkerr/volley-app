import { newPlayerObj } from './players';
import Spinner from 'react-bootstrap/Spinner';
import { useEffect, useState } from 'react';
import { playerMatchesTerm } from '../../search';

export default function PlayerSearchResults({ searchTerm, players, selectedPlayerId, onClick, setResultsCount }) {

    const [filteredPlayers, setFilteredPlayers] = useState([]);

    useEffect(() => {
        const newFilteredPlayersList = getFilteredPlayersList(searchTerm, players);
        setResultsCount(newFilteredPlayersList.length);
        setFilteredPlayers(newFilteredPlayersList);
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
    
    const getFilteredPlayersList = (searchTerm, players) => {
        let filteredPlayers = players;
        if (searchTerm !== "" && searchTerm !== undefined) {
            let searchTerms = searchTerm.split(' ');
            filteredPlayers = players.filter(player =>
                searchTerms.every(st => playerMatchesTerm(player, st))
            )
        }
        
        const comparePlayersByName = (a, b) => {
            if (a.name.first && b.name.first) {
                if (a.name.first < b.name.first) return -1;
                else if (a.name.first > b.name.first) return 1;
            } else if (a.name.last && b.name.last) {
                if (a.name.last < b.name.last) return -1;
                else if (a.name.last > b.name.last) return 1;
            } else return 0;
        };

        filteredPlayers.sort(comparePlayersByName);

        return filteredPlayers;
    };
    
    return (
        <div>
            <div className={`list-item item ${(selectedPlayerId === newPlayerObj.id ) ? "selected" : ""}`} onClick={handleNewPlayerButton}>
                <p>+ add player</p>
            </div>
            {filteredPlayers.length ?
                filteredPlayers.map((player, i) => getRow(player, i)) :
                <Spinner animation="border" />
            }
        </div>
    );
}