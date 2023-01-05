export const manualSchedule = {
    3: [
        [1,3],
        [2,3],
        [1,2]
    ],
    4: [
        [1,4],
        [2,3],
        [1,3],
        [4,2],
        [3,4],
        [1,2],
    ],
    5: [
        [2,5],
        [3,4],
        [1,5],
        [2,3],
        [1,4],
        [5,3],
        [4,2],
        [1,3],
        [4,5],
        [1,2],
    ],
    6: [
        [1,6],
        [2,5],
        [3,4],
        [5,1],
        [4,6],
        [3,2],
        [1,4],
        [5,3],
        [6,2],
        [3,1],
        [2,4],
        [6,5],
        [1,2],
        [6,3],
        [4,5]
    ]
};

const BYE = "BYE";
export const makeRounds = (teams, courts) => {
    let matchList = [];
    if (teams in manualSchedule)
        matchList = manualSchedule[teams];
    else {
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

    // for (let i = 0; i < matchList.length;) {
    //     let round = [];
    //     let matchesInRound = 0;
    //     for (let j = 0; matchesInRound < maxMatchesPerRound, i+j < matchList.length; i++, j++) {
    //         const nextGame = matchList[i+j];
    //         if (nextGame && !nextGame.includes(BYE)) {
    //             round.push(nextGame);
    //             matchesInRound++;
    //         }
    //     }
    //     rounds.push(round);
    // }

    console.log(rounds);
    return rounds;
}

const rotateTeams = teamsList => {
    teamsList.unshift(teamsList.pop());
    return teamsList;
}


const warmUpTime = 10;
const allowedOvertime = 10;
const matchOptions = [
    {games: 1, points: 15},
    {games: 1, points: 18},
    {games: 1, points: 21},
    {games: 1, points: 25},
    {games: 1, points: 28},
    {games: 1, points: 30},
    {games: 2, points: 15},
    {games: 2, points: 18},
    {games: 2, points: 21},
    {games: 2, points: 25},
    {games: 2, points: 28},
    {games: 2, points: 30},
    {games: 3, points: 15, tiebreak: 15},
    {games: 3, points: 18, tiebreak: 15},
    {games: 3, points: 21, tiebreak: 15},
    {games: 3, points: 25, tiebreak: 15},
    {games: 3, points: 28, tiebreak: 15},
    {games: 3, points: 30, tiebreak: 15},
    {games: 5, points: 25, tiebreak: 15}
]
export const formatFinder = ({teams, courts, hours}) => {
    const maxMinutes = (hours*60) + warmUpTime + allowedOvertime;
    const rounds = getRoundRobinRounds(teams, courts);
    matchOptions.forEach(option => 
        option.duration = getRoundRobinTime(rounds, option)
    );
    return matchOptions.filter(option => (option.duration <= maxMinutes));
}

const getGameDuration = points => {
    const minutesFor25Points = 25;
    let gameDuration = minutesFor25Points * (points/25);
    gameDuration += 4;
    return gameDuration;
}

const getRoundRobinRounds = (teams, courts) => {
    const totalMatches = (teams/2)(teams-1);
    const maxMatchesPerRound = Math.min((teams % 2 === 0) ? teams/2 : ((teams-1)/2), courts);
    const rounds = totalMatches/maxMatchesPerRound;
    return rounds;
}

const getRoundRobinTime = (rounds, options) => {
    let matchDuration = 0;
    if (options.games > 2 && options.games%2 !== 0) {
        matchDuration += getGameDuration(options.points) * (options.games-1);
        matchDuration += getGameDuration(options.tiebreak);
    } else {
        matchDuration += getGameDuration(options.points) * options.games;
    }
    return rounds * matchDuration;
}