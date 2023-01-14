import { Schedule, Week } from "./ScheduleClasses";
import premadeSchedules from "./premadeSchedules";

const courtCount = 3;
const BYE = "BYE";

export const getSchedule = (teams) => {
    switch (teams) {
        case 12:
            return new Schedule(premadeSchedules[12]);
        default:
            let teamsList = teams;
            if (typeof teams !== Array) {
                teamsList = [...Array(teams+1).keys()];
                teamsList.shift();
            }
            return generateSchedule(teamsList);
    }
};

// code for even number of teams first
// TODO: number of teams > courtCount * 2
// TODO: odd number of teams
const generateSchedule = (teams) => {
    if (teams.length % 2 != 0) // if odd
        return new Schedule([]);
    if (teams.length <= (courtCount*2)) { // only need 1 block per day. use normal round robin
        const weeks = [];
        const rr = normalRoundRobin(teams);
        let i = 7;
        while (i > 0) {
            const round1 = rr.next().value;
            const round2 = rr.next().value;
            const blocks = [[round1, round2]];
            weeks.push(new Week(blocks));
            i--;
        }
        return new Schedule(weeks);
    }
    if ((teams.length > courtCount*2) && (teams.length <= 12)) {
        const weeks = [];
        return new Schedule(weeks);
    }
}

function* normalRoundRobin(teams) {
    let teamsCopy = [...teams];
    if (teams.length % 2 == 1) teamsCopy.push(BYE);
    while (true) {
        yield listToRound(teamsCopy);
        teamsCopy = rotateTeams(teamsCopy);
    }
}

// round robin with an early and late block
// all teams play 2 matches in their pool, then pools are "shuffled"
// function* blockRoundRobin(teams) {
//     let teamsCopy = [...teams];
//     if (teams.length % 2 == 1) teamsCopy.push(BYE);
    
//     while (true) {
//         // get round 1 - 4 (week 1 and 2)
//         let [group1, group2] = splitTeamsIntoBlocks(teamsCopy);
//         const rr = normalRoundRobin(group1);
//         const g1round1 = rr.next().value();
//         const g1round2 = rr.
//     }
// }

const splitTeamsIntoBlocks = teams => {
    const teamsCopy = [...teams];
    const group1 = [], group2 = [];
    if (teams.length % 4 == 0) { // 8, 12 teams
        group1 = teamsCopy.slice(0, teams.length/2);
        group2 = teamsCopy.slice(teams.length/2);
    } else if (teams.length % 2 == 0) { // 10 teams
        group1 = teamsCopy.slice(0, (teams.length/2)+1);
        group2 = teamsCopy.slice((teams.length/2)+1);
    }
    return [group1, group2];
}

const listToRound = list => {
    const round = [];
    const listCopy = [...list];
    while (listCopy.length > 0) {
        const team1 = listCopy.shift();
        const team2 = listCopy.pop();
        const match = [team1, team2];
        round.push(match);
    }
    return round;
}

const rotateTeams = teams => {
    const unfrozenTeams = [...teams];
    const frozenTeam = unfrozenTeams.shift();

    // move last element to front
    const end = unfrozenTeams.pop();
    unfrozenTeams.unshift(end);

    return [frozenTeam, ...unfrozenTeams];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

const makeRounds = (teams, courts) => {
    let matchList = [];
    let teamsList = [];
    let frozenTeam;
    if (teams % 2 === 1) { // ODD number of teams
        const totalMatchesPlusByes = ((teams+1)/2)*teams
        console.log(totalMatchesPlusByes);
        
        // frozenTeam = teams;
        // for (let i = teams-1; i > 0; i--)
        //     teamsList.push(i);
        frozenTeam = 1;
        for (let i = 2; i <= teams; i++)
            teamsList.push(i);
        teamsList.push(BYE)

        while (matchList.length < totalMatchesPlusByes) {
            const lastItemIndex = teamsList.length-1;
            matchList.push([frozenTeam, teamsList[lastItemIndex]]);
            let i, j;
            for (i=0, j=lastItemIndex-1; i<j; i++, j--) {
                matchList.push([teamsList[i], teamsList[j]]);
            }

            teamsList = rotateTeams(teamsList);
        }
    } else { // EVEN number of teams
        const totalMatches = (teams/2)*(teams-1);

        frozenTeam = 1;
        for (let i = 2; i <= teams; i++)
            teamsList.push(i);

        while (matchList.length < totalMatches) {
            const lastItemIndex = teamsList.length-1;
            matchList.push([frozenTeam, teamsList[lastItemIndex]]);
            for (let i=0, j=lastItemIndex-1; i<j; i++, j--) {
                matchList.push([teamsList[i], teamsList[j]]);
            }

            teamsList = rotateTeams(teamsList);
        }
    }

    console.log("matchList", matchList);

    const rounds = [];
    const matchesPerRound = (teams%2===0) ? (teams / 2) : (teams-1)/2;
    const maxPlayableMatchesPerRound = Math.min(matchesPerRound, courts);

    let round = [];
    let matchesInRound = 0;
    for (let i = 0; i < matchList.length; i++) {
        const nextGame = matchList[i];
        if (!nextGame.includes(BYE)) {
            round.push(nextGame);
            matchesInRound++;
        }

        if (matchesInRound >= maxPlayableMatchesPerRound) {
            rounds.push(round);
            round = [];
            matchesInRound = 0;
        }
    }

    return rounds;
}