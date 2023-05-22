import { SKILL_TYPES } from "./components/PeopleTool/PlayerFormFields";

//////// Reusable Components ////////

const addAliases = (itemTerms, termAliases) => {
    let equivalentTerms = [...itemTerms];
    for (let originalTerm in termAliases) {
        if (itemTerms.includes(originalTerm.toLowerCase()))
            equivalentTerms.push(...termAliases[originalTerm]);
    }
    return equivalentTerms;
};

const searchTermAsList = (searchTerm, prefix) => {
    return searchTerm.split(prefix)[1]
        .replaceAll(';', ',')
        .split(',')
        .filter(s => s !== '');
};

/**
 * @requires arr is a list of search terms
 * @returns true if arr contains one of the defined 'ALL' keywords; false otherwise
 */
const matchesAll = (arr) => {
    const allMatches = ['all', 'any', 'every', '*'];
    return allMatches.find(s => arr.includes(s)) ? true : false;
};

/**
 * @returns true if the term is in the word (checks after removing special characters)
 */
const includesMatch = (word, term) => {
    let wordStr = word.replaceAll(/[^A-Za-z]/ig, '').toLowerCase();
    let termStr = term.toLowerCase();
    return (wordStr.includes(termStr));
};

//////// PLAYER Search ////////

const SEARCH_ANYROLE = ['role:', 'isany:']; // OR
const SEARCH_ALLROLES = ['roles:', 'isall:', 'is:']; // AND
const SEARCH_GENDER = ['gender:', 'sex:'];
const SEARCH_CONTACTTYPE = ['contact:', 'via:'];
const SEARCH_AFFILIATION = ['affiliation:', 'aff:', 'with:', 'group:', 'in:']; // AND

const roleAliases = {
    "setter": ['s', 'set', 'hands'],
    "pin": ['hitter', 'w', 'oh', 'wing', 'outside hitter', 'wing hitter', 'wing spiker'],
    "libero": ['l', 'lib', 'ds', 'short', 'small'],
    "middle": ['m', 'mb', 'middle blocker', 'block', 'blocker', 'tall'],
};

const genderAliases = {
    "m": ['m', 'male', 'man', 'men', 'guy'],
    "f": ['f', 'fem', 'female', 'woman', 'women', 'girl']
};

const contactTypeAliases = {
    "phone": ['cell', 'mobile', 'text'],
    "groupme": ['gm'],
    "facebook": ['fb'],
    "other": ['other', 'none']
};

/**
 * @requires terms is a string array
 * @param { any } : false to find an exact match of all listed roles, true if searching for a match with any of the listed roles
 * @returns true if playerRoles contains any/every role from search term; false otherwise
 */
const matchesRole = (playerRoles, terms, { any }) => {
    const allPlayerRoles = addAliases(playerRoles, roleAliases);
    if (matchesAll(terms)) return true;
    if (any)
        return terms.find(role => allPlayerRoles.map(pr => pr.toLowerCase()).includes(role)) ? true : false;
    else
        return terms.every(role => allPlayerRoles.map(pr => pr.toLowerCase()).includes(role)) ? true : false;
};

/**
 * @requires term is a string including a colon, e.g. 'gender:xyz'
 * @returns true if playerGender matches search term; false otherwise
 */
const matchesGender = (playerGender, term) => {
    if (matchesAll([playerGender])) return true;
    return genderAliases[playerGender.toLowerCase()].includes(term)
}

/**
 * @requires terms is a string array
 * @returns true if playerAffiliation list includes search term; false otherwise
 */
const matchesContactType = (playerContactType, terms) => {
    const allContactTypes = addAliases(playerContactType, contactTypeAliases);
    if (matchesAll(terms)) return true;
    return terms.find(type => allContactTypes.map(pct => pct.toLowerCase()).includes(type)) ? true : false;
};

/**
 * @requires terms is a string array
 * @returns true if playerAffiliation list includes search term; false otherwise
 */
const matchesAffiliation = (playerAffiliation, terms) => {
    if (matchesAll(terms)) return true;
    return terms.every(aff => playerAffiliation.map(pa => pa.toLowerCase().replaceAll(/[^A-Za-z]/ig, '')).includes(aff));
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

export const playerMatchesTerm = (player, searchTerm) => {
    let term = searchTerm.toLowerCase();

    // special filters
    if (SKILL_TYPES.find(skill => term.startsWith(skill.toLowerCase() + ":")))
        return matchesSkill(player.skills, term);
    else if (SEARCH_ANYROLE.find(prefix => term.startsWith(prefix))) // Any role
        return matchesRole(player.roles, searchTermAsList(term, ':'), { any: true });
    else if (SEARCH_ALLROLES.find(prefix => term.startsWith(prefix))) // All roles
        return matchesRole(player.roles, searchTermAsList(term, ':'),  { any: false });
    else if (SEARCH_GENDER.find(prefix => term.startsWith(prefix))) // Gender
        return matchesGender(player.gender, term.split(':')[1]);
    else if (SEARCH_CONTACTTYPE.find(prefix => term.startsWith(prefix)))
        return matchesContactType(player.contact.type, term.split(':')[1]);
    else if (SEARCH_AFFILIATION.find(prefix => term.startsWith(prefix)))
        return matchesAffiliation(player.affiliation, searchTermAsList(term, ':'));
    else { // name
        if (includesMatch(player.name.first, term) ||
            includesMatch(player.name.last, term) ||
            (player.name.nicks && player.name.nicks.find(nick => includesMatch(nick, term)))) {
                return true;
        }
    }
};

//////// EVENT Search ////////

const matchesYear = (year, input) => {
    const date = new Date();
    date.setFullYear(year);
    if (date.getFullYear() === parseInt(input) ||
        date.getFullYear() % 100 === parseInt(input))
            return true;
};

const matchesMonth = (month, input) => {
    const date = new Date();
    date.setMonth(month);
    if (month+1 === parseInt(input) ||
        date.toLocaleString('default', { month: 'long' }).toLowerCase() === input.toLowerCase() ||
        date.toLocaleString('default', { month: 'short' }).toLowerCase() === input.toLowerCase())
            return true;
};

export const eventMatchesTerm = (event, term) => {
    const eventDate = new Date(Date.parse(event.date));
    if (event.name.toLowerCase().includes(term.toLowerCase())) return true;
    else if (eventDate === new Date(Date.parse(term))) return true;
    else if (term.startsWith('year:') && matchesYear(eventDate.getFullYear(), term.split('year:')[1])) return true;
    else if (term.startsWith('month:') && matchesMonth(eventDate.getMonth(), term.split('month:')[1])) return true;
    return false;
};