import { newPlayerObj } from './players';
import Spinner from 'react-bootstrap/Spinner';
import { SKILL_TYPES } from './PlayerFormFields';
import { useEffect, useState } from 'react';

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

    const includesMatch = (word, term) => {
        let wordStr = word.replaceAll(/[^A-Za-z]/ig, '').toLowerCase();
        let termStr = term.toLowerCase();
        return (wordStr.includes(termStr));
    };

    const SEARCH_ANYROLE = ['role:', 'isany:']; // OR
    const SEARCH_ALLROLES = ['roles:', 'isall:', 'is:']; // AND
    const SEARCH_GENDER = ['gender:', 'sex:'];
    const SEARCH_CONTACTTYPE = ['contact:', 'via:'];
    const SEARCH_AFFILIATION = ['affiliation:', 'aff:', 'with:', 'group:']; // AND

    /**
     * @requires arr is a list of search terms
     * @returns true if arr contains one of the defined keywords; false otherwise
     */
    const matchesAll = (arr) => {
        const allMatches = ['all', 'any', 'every', '*'];
        return allMatches.find(s => arr.includes(s)) ? true : false;
    };

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
    };

    const addRoleNicknames = (roles) => {
        let allRoleNames = [...roles];
        if (roles.includes("Setter")) allRoleNames.push('s', 'set', 'hands');
        if (roles.includes("Pin")) allRoleNames.push('hitter', 'w', 'oh', 'wing', 'outside hitter', 'wing hitter', 'wing spiker');
        if (roles.includes("Libero")) allRoleNames.push('l', 'lib', 'ds', 'short', 'small');
        if (roles.includes("Middle")) allRoleNames.push('m', 'mb', 'middle blocker', 'block', 'blocker', 'tall');
        return allRoleNames;
    };
    
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
        if (matchesAll(searchRoles)) return true;
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
    };

    const addContactTypeNicknames = (types) => {
        let allContactTypeNames = [...types];
        if (types.includes("Phone")) allContactTypeNames.push('phone', 'cell', 'mobile', 'text');
        if (types.includes("GroupMe")) allContactTypeNames.push('groupme', 'gm');
        if (types.includes("Facebook")) allContactTypeNames.push('facebook', 'fb');
        if (types.includes("Other")) allContactTypeNames.push('other', 'none');
        return allContactTypeNames;
    };
    const matchesContactType = (playerContactType, term) => {
        const allContactTypes = addContactTypeNicknames(playerContactType);
        let searchContactTypes = term.split(':')[1]
                                .replaceAll(';', ',')
                                .split(',')
                                .filter(s => s !== '');
        if (matchesAll(searchContactTypes)) return true;
        return searchContactTypes.find(type => allContactTypes.map(pct => pct.toLowerCase()).includes(type)) ? true : false;
    };

    /**
     * @requires term is a string including a colon, e.g. 'affiliation:xyz'
     * @returns true if playerAffiliation list includes search term; false otherwise
     */
    const matchesAffiliation = (playerAffiliation, term) => {
        const searchAffiliations = term.split(':')[1]
                                    .replaceAll(';', ',')
                                    .split(',')
                                    .filter(s => s !== '')
                                    .map(s => s.replaceAll(/[^A-Za-z]/ig, ''));
        if (matchesAll(searchAffiliations)) return true;
        return searchAffiliations.every(aff => playerAffiliation.map(pa => pa.toLowerCase().replaceAll(/[^A-Za-z]/ig, '')).includes(aff));
    };

    /**
     * @requires term is a string including a colon, e.g. 'skill:5'
     * @returns true if playerSkills matches search term; false otherwise
     * ex: setting:>7 hitting:<5 hitting:!0 blocking:10 leadership:>=4
     */
    const matchesSkill = (playerSkills, term) => {
        const [searchSkillName, searchSkillDescriptor] = term.split(':');
        const playerSkillValue = playerSkills[searchSkillName];
        
        const match = searchSkillDescriptor.match(/^([^0-9]{0,2})(\d+)$/);
        if (!match) return false;
        const [_full, inequality, valueString] = match || [];
        const value = parseInt(valueString);
        switch (inequality) {
            case '>':
                return playerSkillValue > value;
            case '<':
                return playerSkillValue < value;
            case '<=':
                return playerSkillValue <= value;
            case '>=':
                return playerSkillValue >= value;
            case '':
            case '=':
                return playerSkillValue === value;
            case '!=':
            case '!':
            case '<>':
                return playerSkillValue !== value;
            default:
                return false;
        }
    };

    const matchesTerm = (player, searchTerm) => {
        let term = searchTerm.toLowerCase();

        // special filters
        if (SKILL_TYPES.find(skill => term.startsWith(skill.toLowerCase() + ":")))
            return matchesSkill(player.skills, term);
        else if (SEARCH_ANYROLE.find(prefix => term.startsWith(prefix))) // Any role
            return matchesAnyRole(player.roles, term);
        else if (SEARCH_ALLROLES.find(prefix => term.startsWith(prefix))) // All roles
            return matchesAllRoles(player.roles, term);
        else if (SEARCH_GENDER.find(prefix => term.startsWith(prefix))) // Gender
            return matchesGender(player.gender, term);
        else if (SEARCH_CONTACTTYPE.find(prefix => term.startsWith(prefix)))
            return matchesContactType(player.contact.type, term);
        else if (SEARCH_AFFILIATION.find(prefix => term.startsWith(prefix)))
            return matchesAffiliation(player.affiliation, term);
        else { // name
            if (includesMatch(player.name.first, term) ||
                includesMatch(player.name.last, term) ||
                (player.name.nicks && player.name.nicks.find(nick => includesMatch(nick, term)))) {
                    return true;
            }
        }
    };
    
    const getFilteredPlayersList = (searchTerm, players) => {
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