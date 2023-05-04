import { newPlayerObj } from './players';
import Spinner from 'react-bootstrap/Spinner';

export default function PlayerSearchResults({ searchTerm, players, selectedPlayerId, onClick, setResultsCount }) {

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

    const includesMatch = (word, term) => {
        let wordStr = word.replaceAll(/[^A-Za-z]/ig, '').toLowerCase();
        let termStr = term.toLowerCase();
        return (wordStr.includes(termStr));
    };

    const SEARCH_ANYROLE = 'role:';
    const SEARCH_ALLROLES = 'roles:';
    const SEARCH_GENDER = 'gender:';

    /**
     * @requires term is a string including a colon, e.g. 'gender:xyz'
     * @returns true if playerGender matches search term; false otherwise
     */
    const matchesGender = (playerGender, term) => {
        let searchGender = term.split(':')[1];
        const maleMatches = ['m', 'male', 'man', 'men', 'guy'];
        const femaleMatches = ['f', 'fem', 'female', 'woman', 'women', 'girl'];
        const anyMatches = ['any', 'all', 'm,f', 'f,m', 'm;f', 'f;m', ''];
        const otherMatches = ['other'];
        if (anyMatches.includes(searchGender)) return true;
        else if (otherMatches.includes(searchGender))
            return playerGender !== 'M' && playerGender !== 'F';
        else if (maleMatches.includes(searchGender))
            return playerGender === 'M';
        else if (femaleMatches.includes(searchGender))
            return playerGender === 'F';
        else
            return playerGender.toLowerCase() === searchGender;
    }

    const addRoleNicknames = (roles) => {
        let allRoleNames = [...roles];
        if (roles.includes("Setter")) allRoleNames.push('s', 'set', 'hands');
        if (roles.includes("Pin")) allRoleNames.push('hitter', 'w', 'oh', 'wing', 'outside hitter', 'wing hitter', 'wing spiker');
        if (roles.includes("Libero")) allRoleNames.push('l', 'lib', 'ds', 'short', 'small');
        if (roles.includes("Middle")) allRoleNames.push('m', 'mb', 'middle blocker', 'block', 'blocker', 'tall');
        return allRoleNames;
    }
    
    /**
     * @requires term is a string including a colon, e.g. 'role:xyz'
     * @returns true if playerRoles contains every role from search term; false otherwise
     */
    const matchesAnyRole = (playerRoles, term) => {
        const allPlayerRoles = addRoleNicknames(playerRoles);
        const searchRoles = term.split(':')[1]
                            .replaceAll(';', ',')
                            .split(',')
                            .filter(s => s !== '');
        return searchRoles.find(role => allPlayerRoles.map(pr => pr.toLowerCase()).includes(role)) ? true : false;
    };

    /**
     * @requires term is a string including a colon, e.g. 'roles:xyz'
     * @returns true if playerRoles contains every role from search term; false otherwise
     */
    const matchesAllRoles = (playerRoles, term) => {
        const allPlayerRoles = addRoleNicknames(playerRoles);
        const searchRoles = term.split(':')[1]
                            .replaceAll(';', ',')
                            .split(',')
                            .filter(s => s !== '');
        return searchRoles.every(role => allPlayerRoles.map(pr => pr.toLowerCase()).includes(role)) ? true : false;
    }

    const matchesTerm = (player, searchTerm) => {
        let term = searchTerm.toLowerCase();

        // special filters
        if (term.startsWith(SEARCH_ANYROLE)) // Any role
            return matchesAnyRole(player.roles, term);
        else if (term.startsWith(SEARCH_ALLROLES)) // All roles
            return matchesAllRoles(player.roles, term);
        else if (term.startsWith(SEARCH_GENDER) || term.startsWith('sex:')) // Gender
            return matchesGender(player.gender, term);
        else { // name
            if (includesMatch(player.name.first, term) ||
                includesMatch(player.name.last, term) ||
                (player.name.nicks && player.name.nicks.find(nick => includesMatch(nick, term)))) {
                    return true;
            }
        }
    };
    
    const getFilteredPlayersList = () => {
        let filteredPlayers = players;
        if (searchTerm !== "" && searchTerm !== undefined) {
            let searchTerms = searchTerm.split(' ');
            filteredPlayers = players.filter(player =>
                searchTerms.every(st => matchesTerm(player, st))
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

        setResultsCount(filteredPlayers.length);

        return (
            filteredPlayers.length ?
            filteredPlayers.map((player, i) => getRow(player, i)) :
            <Spinner animation="border" />
        );
    }
    
    return (
        <div>
            <div className={`listitem-name ${(selectedPlayerId === newPlayerObj.id ) ? "selected" : ""}`} onClick={handleNewPlayerButton}>
                <p>+ add player</p>
            </div>
            {getFilteredPlayersList()}
        </div>
    );
}