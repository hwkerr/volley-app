export const exampleRounds = [
    {
        courts: [
            {
                teams: [
                    [1,2],
                    [3,4]
                ]
            },
            {
                teams: [
                    [5,6],
                    [7,8]
                ]
            }
        ]
    },
    {
        courts: [
            {
                teams: [
                    [1,3],
                    [2,4]
                ]
            },
            {
                teams: [
                    [5,7],
                    [6,8]
                ]
            }
        ]
    }
];

const roundAsString = (round) => {
    return (`[${round.courts[0].teams[0][0]},${round.courts[0].teams[0][1]}]vs[${round.courts[0].teams[1][0]},${round.courts[0].teams[1][1]}] and 
            [${round.courts[1].teams[0][0]},${round.courts[1].teams[0][1]}]vs[${round.courts[1].teams[1][0]},${round.courts[1].teams[1][1]}]`);
};

export const getRounds = (courts=2, players=10, playersPerTeam=2) => {
    
    if (players/playersPerTeam/2 >= courts) {
        console.log("There are enough players for " + courts + " courts")
        console.log("There will be " + ((players/playersPerTeam)-(2*courts)) + " player(s) sitting at a time")
    }

    const attemptsPerRound = 4;
    const rounds = [];
    let minPairings = 1;
    let minMeetings = 1;
    let playersWithSufficientPairings = [];
    let playersWithSufficientMeetings = [];

    const generatePlayerGrid = (players, defaultValue=0) => {
        const playerGrid = {};
        for (let i = 1; i <= players; i++) {
            playerGrid[i] = {};
            for (let j = 1; j <= players; j++) {
                playerGrid[i][j] = defaultValue;
            }
        }
        return playerGrid;
    }
    const pairingGrid = generatePlayerGrid(players);
    const meetingGrid = generatePlayerGrid(players);
    const recencyLimit = 4;
    const pairingCountdownGrid = generatePlayerGrid(players, recencyLimit);
    const meetingCountdownGrid = generatePlayerGrid(players, recencyLimit);

    let sittingGames = {};
    for (let i = 1; i <= players; i++) {
        sittingGames[i] = 0;
    }
    let playedGames = {};
    for (let i = 1; i <= players; i++) {
        playedGames[i] = 0;
    }

    const minPlayedInARow = 3;
    let playedInARowGames = {};
    for (let i = 1; i <= players; i++) {
        playedInARowGames[i] = 0;
    }

    const fromSimpleRounds = rounds => {
        return rounds.map(round => {
            return {
                courts: [
                    {
                        teams: [
                            [round[0], round[1]],
                            [round[2], round[3]]
                        ]
                    },
                    {
                        teams: [
                            [round[4], round[5]],
                            [round[6], round[7]]
                        ]
                    }
                ]
            };
        })
    }
    
    const convertToRoundFormat = (teams=[ [ [], [] ], [ [], [] ] ]) => {
        return {
            courts: [
                {
                    teams: [
                        teams[0][0],
                        teams[0][1]
                    ]
                },
                {
                    teams: [
                        teams[1][0],
                        teams[1][1]
                    ]
                }
            ]
        };
    }

    const generateRoundsBruteForce = () => {
        const roundsToGenerate = 10;
        while (rounds.length != 10) {
            let round = [];
            for (let a=1; a<=players; a++) {
                round = [a];
                for (let b=1; b<=players; b++) {
                    if (round.includes(b)) continue;
                    round = [a,b];
                    for (let c=1; c<=players; c++) {
                        if (round.includes(c)) continue;
                        round = [a,b,c];
                        for (let d=1; d<=players; d++) {
                            if (round.includes(d)) continue;
                            round = [a,b,c,d];
                            for (let e=1; e<=players; e++) {
                                if (round.includes(e)) continue;
                                round = [a,b,c,d,e];
                                for (let f=1; f<=players; f++) {
                                    if (round.includes(f)) continue;
                                    round = [a,b,c,d,e,f];
                                    for (let g=1; g<=players; g++) {
                                        if (round.includes(g)) continue;
                                        round = [a,b,c,d,e,f,g];
                                        for (let h=1; h<=players; h++) {
                                            if (round.includes(h)) continue;
                                            round = [a,b,c,d,e,f,g,h];
                                            for (let i=1; i<=players; i++) {
                                                if (round.includes(i)) continue;
                                                round = [a,b,c,d,e,f,g,h,i];
                                                for (let j=1; j<=players; j++) {
                                                    if (round.includes(j)) continue;
                                                    round = [a,b,c,d,e,f,g,h,i,j];
                                                    let valid = checkValidity([...rounds, round]);
                                                    if (valid) {
                                                        console.log(round);
                                                        rounds.push(round);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        console.log("done", rounds);
        return rounds;
    }

    const checkValidity = (rounds) => {
        let valid = true;
        const setValid = (val) => valid=val;

        rounds.forEach(round => {
            if (hasDuplicates(round)) valid = false;
        }); if (!valid) {
            console.log("Has duplicates");
            return false;
        }

        let usedTeams = [];
        const checkForUsedTeams = (round) => {
            let repeatTeams = false;
            let teams = [
                `[${round[0]},${round[1]}]`,
                `[${round[2]},${round[3]}]`,
                `[${round[4]},${round[5]}]`,
                `[${round[6]},${round[7]}]`,
                `[${round[1]},${round[0]}]`,
                `[${round[3]},${round[2]}]`,
                `[${round[5]},${round[4]}]`,
                `[${round[7]},${round[6]}]`
            ]
            usedTeams.forEach(team => {
                teams.forEach(newTeam => {
                    if (team === newTeam)
                        repeatTeams = true;
                })
            })
            return repeatTeams;
        };
        const addTeams = (round) => {
            usedTeams.push(`[${round[0]},${round[1]}]`);
            usedTeams.push(`[${round[2]},${round[3]}]`);
            usedTeams.push(`[${round[4]},${round[5]}]`);
            usedTeams.push(`[${round[6]},${round[7]}]`);
            usedTeams.push(`[${round[1]},${round[0]}]`);
            usedTeams.push(`[${round[3]},${round[2]}]`);
            usedTeams.push(`[${round[5]},${round[4]}]`);
            usedTeams.push(`[${round[7]},${round[6]}]`);
        };
        
        rounds.forEach(round => {
            if (checkForUsedTeams(round))
                setValid(false);
            addTeams(round);
        }); if (!valid) {
            console.log("Has repeat teams");
            return false;
        }

        const teamData = {};
        const minConsecutiveRounds = 3;
        rounds.forEach(round => {
            for (let player=0; player<=players; player++) {
                teamData[player] = {};
                let count = 100;
                if (round.includes(player)) {
                    count++;
                    if ("games" in teamData[player])
                        teamData[player]["games"]++;
                    else
                        teamData[player]["games"]=1;
                    
                    if (teamData[player].games > 8) {
                        valid = false;
                        return;
                    }
                } else {
                    if (count < minConsecutiveRounds) {
                        valid = false;
                        return;
                    }
                    count=0;
                    if ("sit" in teamData[player])
                        teamData[player]["sit"]++;
                    else
                        teamData[player]["sit"]=1;

                    if (teamData[player].sit > 2) {
                        valid = false;
                        return;
                    }
                }
            }
        }); if (!valid) {
            console.log("Has uneven game counts");
            return false;
        }

        return valid;
    }

    function hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    const generateRoundsSequentially = () => {
        // Manually set number of total rounds
        for (let i = 0; i < 10; i++) {
            generateNewRound();
        }
    }
    
    const generateNewRound = () => {
        let teams = [ [ [], [] ], [ [], [] ] ];
        let usedPlayers = [];
        let backlog = [];

        const addToFirstOpenTeam = (player, repeats=0) => {
            let success = false;
            teams.forEach(court => {
                court.forEach(team => {
                    if (!usedPlayers.includes(player) && team.length < playersPerTeam) {
                        let teammates = getTeammates(team);
                        let opponents = getOpponents(court, team);
    
                        if (isOkPairing(player, teammates, opponents) && (playedGames[player] === Math.min(...Object.values(playedGames))) && (playedInARowGames[player] < minPlayedInARow)) {
                            addToTeam(player, team, teammates, opponents);
                            success = true;
                        } else if (repeats>=1 && canPlayWith(player, teammates) && (playedGames[player] === Math.min(...Object.values(playedGames))) && (playedInARowGames[player] < minPlayedInARow)) {
                            addToTeam(player, team, teammates, opponents);
                            success = true;
                        } else if (repeats>=2 && canPlayWith(player, teammates) && (playedGames[player] === Math.min(...Object.values(playedGames)))) {
                            addToTeam(player, team, teammates, opponents);
                            success = true;
                        } else if (repeats>=3 && (playedGames[player] === Math.min(...Object.values(playedGames)))) {
                            addToTeam(player, team, teammates, opponents);
                            success = true;
                        } else if (repeats>=4) {
                            addToTeam(player, team, teammates, opponents);
                            success = true;
                        } else {
                            backlog.push(player);
                            success = false;
                        }
                    }
                })
            })
            return success;
        }

        const addToTeam = (player, team, teammates, opponents) => {
            team.push(player);
            addToRepeatGrids(player, teammates, opponents);
            usedPlayers.push(player);
            playedGames[player]++;
            playedInARowGames[player]++;
        }
    
        const getTeammates = team => team;
    
        const getOpponents = (court, ownTeam) => {
            court.forEach(team => {
                if (team !== ownTeam) {
                    return team;
                }
            });
            return [];
        }
    
        const addToRepeatGrids = (player, teammates, opponents) => {
            teammates.forEach(teammate => {
                pairingGrid[player][teammate]++;
                pairingGrid[teammate][player]++;
            });
            opponents.forEach(opponent => {
                meetingGrid[player][opponent]++;
                meetingGrid[opponent][player]++;
            });
        }
    
        /////////////////////////////////////////////////////////
        // Check for previous pairings/meetings and avoid them //
        const isOkPairing = (player, teammates, opponents) => {
            return canPlayWith(player, teammates) && canPlayAgainst(player, opponents);
        }

        const canPlayWith = (player, teammates) => {
            let recency = recencyLimit;
            for (let i = 0; i < teammates.length; i++) {
                recency = Math.min(recency, pairingCountdownGrid[player][teammates[i]]);
            }
            return (recency >= recencyLimit);
            // let pairings = 0;
            // for (let i = 0; i < teammates.length; i++) {
            //     pairings += getNumberOfPairings(player, teammates[i])
            // }
            // return pairings < minPairings;
        }

        const canPlayAgainst = (player, opponents) => {
            let meetings = 0;
            for (let i = 0; i < opponents.length; i++) {
                meetings += getNumberOfMeetings(player, opponents[i])
            }
            return meetings < minMeetings;
        }
    
        const getNumberOfPairings = (a, b) => {
            return pairingGrid[a][b];
            
            // let pairingCount = 0;
            // rounds.forEach(round => {
            //     if (pairingInRound(round, a, b))
            //         pairingCount++;
            // });
        }
    
        const getNumberOfMeetings = (a, b) => {
            return meetingGrid[a][b];
            
            // let meetingCount = 0;
            // rounds.forEach(round => {
            //     if (meetingInRound(round, a, b))
            //         meetingCount++;
            // });
        }
    
        const pairingInRound = (round, a, b) => {
            let pairInRound = false;
            round.forEach(({ courts }) => {
                courts.forEach(({ teams }) => {
                    if ((teams[0].includes(a) && teams[0].includes(b)) || (teams[1].includes(a) && teams[1].includes(b)))
                        pairInRound = true;
                })
            })
        }
    
        const meetingInRound = (round, a, b) => {
            let meetInRound = false;
            round.forEach(({ courts }) => {
                courts.forEach(({ teams }) => {
                    if ((teams[0].includes(a) && teams[1].includes(b)) || (teams[0].includes(b) && teams[1].includes(a)))
                        meetInRound = true;
                })
            })
        }

        const increaseMinPairings = () => {
            const completedAllPairings = player => {
                if (!playersWithSufficientPairings.includes(player)) {
                    // If all pairings are at the minimum threshold (aside from self)
                    if ((Object.values(pairingGrid[player]).filter(pairing => pairing >= minPairings).length) === (players-1))
                        return true;
                }
                return false;
            }
            for (let player = 1; player <= players; player++) {
                if (completedAllPairings(player))
                    playersWithSufficientPairings.push(player)
            }
            
            if (playersWithSufficientPairings.length === players) {
                minPairings = minPairings+1;
                playersWithSufficientPairings = [];
            }
        }
    
        const increaseMinMeetings = () => {
            const completedAllMeetings = player => {
                if (!playersWithSufficientMeetings.includes(player)) {
                    // If all pairings are at the minimum threshold (aside from self)
                    if ((Object.values(meetingGrid[player]).filter(meeting => meeting >= minMeetings).length) === (players-1))
                        return true;
                }
                return false;
            };
            for (let player = 1; player <= players; player++) {
                if (completedAllMeetings(player)) {
                    playersWithSufficientMeetings.push(player)
                }
            }
            
            if (playersWithSufficientMeetings.length === players) {
                minMeetings = minMeetings+1;
                playersWithSufficientMeetings = [];
            }
        }
        /////////////////////////////////////////////////////////

        let gamePriority = [];
        for (let i = 1; i <= players; i++) { // Have sat too much
            if (sittingGames[i] === Math.max(...Object.values(sittingGames))) {
                gamePriority.push(i)
            }
        }
        console.log(pairingGrid);
        // for (let i = 1; i <= players; i++) { // Have played with the same players too much
        //     if (Object.values(pairingGrid[i]) === Math.max(...Object.values(sittingGames))) {
        //         gamePriority.push(i)
        //     }
        // }
        for (let i = 1; i <= players; i++) { // Everything else
            if (sittingGames[i] < Math.max(...Object.values(sittingGames))) {
                gamePriority.push(i)
            }
        }

        gamePriority.forEach(player => {
            addToFirstOpenTeam(player);
        });
        gamePriority = [];
        for (let i = 1; i < attemptsPerRound; i++) {
            backlog.forEach(player => {
                addToFirstOpenTeam(player, i);
            });
        }
        backlog = [];

        increaseMinPairings();
        increaseMinMeetings();
        
        rounds.push({
            courts: [
                {
                    teams: [
                        teams[0][0],
                        teams[0][1]
                    ]
                },
                {
                    teams: [
                        teams[1][0],
                        teams[1][1]
                    ]
                }
            ]
        });

        for (let i = 1; i < players; i++) {
            for (let j = 1; j < players; j++) {
                pairingCountdownGrid[i][j]++;
            }
        }
        
        // Keep track of who sat out
        for (let i = 1; i <= players; i++) {
            let played = false;
            for (let j = 0; j < courts; j++) {
                for (let k = 0; k < 2; k++) { // 2 teams per court
                    const playerA = teams[j][k][0];
                    const playerB = teams[j][k][1];
                    // Reset recency counter
                    console.log(playerA, playerB, pairingCountdownGrid);
                    pairingCountdownGrid[playerA][playerB] = 0;
                    pairingCountdownGrid[playerB][playerA] = 0;
                    for (let l = 0; l < playersPerTeam; l++) {
                        if (teams[j][k][l] === i) {
                            played = true;
                        }
                    }
                }
            }
            if (!played) {
                sittingGames[i]++;
                playedInARowGames[i] = 0;
            }
        }
    }

    // generateRoundsSequentially();

    return fromSimpleRounds(generateRoundsBruteForce());
    
    return rounds;
};