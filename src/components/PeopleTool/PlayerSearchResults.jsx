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
                <p>{i+1}. {player.name.first + ' ' + player.name.last}</p>
            </div>
        );
    };

    const fullName = (nameObj) => (nameObj.first + ' ' + nameObj.last);

    const getFilteredPlayersList = () => {
        let filteredPlayers = players;
        if (searchTerm !== "" && searchTerm !== undefined)
            filteredPlayers = players.filter(player => fullName(player.name).toLowerCase().includes(searchTerm.toLowerCase()));
        
        const comparePlayersByName = (a, b) => {
            if (a.name.first && b.name.first) {
                if (a.name.first < b.name.first) return -1;
                else if (a.name.first > b.name.first) return 1;
            } else if (a.name.last && b.name.last) {
                if (a.name.last < b.name.last) return -1;
                else if (a.name.last > b.name.last) return 1;
            } else return 0;
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