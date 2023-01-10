import { schedule as twelveTeamSchedule } from "./12Teams";

export const getSchedule = (teamCount) => {
    switch (teamCount) {
        case 12:
            return twelveTeamSchedule;
        default:
            return generateSchedule(teamCount);
    }
};

const courts = 3;

// code for even number of teams first
// TODO: odd number of teams
const generateSchedule = (teamCount) => {
    if (teamCount % 2 != 0) // if odd
        return {};
    if (teamCount <= 6) { // only need 1 block per day. use normal round robin
        
    }
}

const normalRoundRobin = () => {

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