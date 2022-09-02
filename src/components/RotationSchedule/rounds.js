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

const complexRoundAsString = (round) => {
    return (`[${round.courts[0].teams[0][0]},${round.courts[0].teams[0][1]}]vs[${round.courts[0].teams[1][0]},${round.courts[0].teams[1][1]}] and 
            [${round.courts[1].teams[0][0]},${round.courts[1].teams[0][1]}]vs[${round.courts[1].teams[1][0]},${round.courts[1].teams[1][1]}]`);
};

const simpleToComplexRounds = (rounds=[]) => {
    return rounds.map(orderedTeams => {
        return {
            courts: [
                {
                    teams: [
                        [orderedTeams[0], orderedTeams[1]],
                        [orderedTeams[2], orderedTeams[3]]
                    ]
                },
                {
                    teams: [
                        [orderedTeams[4], orderedTeams[5]],
                        [orderedTeams[6], orderedTeams[7]]
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

const generatePlayerGrid = (playerList, defaultValue=0) => {
    const playerGrid = {};
    playerList.forEach(playerN => {
        playerGrid[playerN] = {};
        playerList.forEach(playerM => {
            playerGrid[playerN][playerM] = defaultValue;
        });
    });
    return playerGrid;
}

export const getRounds = (courts=2, players=10, playersPerTeam=2, numberOfRounds=10) => {
    const playerList = Array.from(Array(players).keys());
    const sittingPlayers = players-(2*playersPerTeam*courts);

    if (players/playersPerTeam/2 >= courts) {
        console.log("There ARE enough players for " + courts + " courts")
        console.log("There will be " + sittingPlayers + " player(s) sitting at a time")
    } else {
        courts = Math.trunc(players/playersPerTeam/2)
        console.log("Only " + courts + " courts will be used.");
        console.log("There will be " + sittingPlayers + " player(s) sitting at a time")
    }
    
    const rounds = [];

    const pairings = [];
    const getNewPairing = (playerList, round, sittingPlayersList) => {
        let newPairing = [];
        const alreadyUsed = candidate => pairings.some(existingPair => equalSets(candidate, existingPair));
        
        
        // @returns name of potential pair if found, otherwise returns undefined
        const findUnusedPairing = player1 => ( // TODO: only works if playersPerTeam=2
            playerList.find(player2 => (
                player1 !== player2
                    && !round.includes(player2)
                    && !sittingPlayersList.includes(player2)
                    && !alreadyUsed([player1, player2])
            ))
        );

        // @return true/false success status of generating a new team
        const status = playerList.every(player => {
            if (!round.includes(player)
                    && !sittingPlayersList.includes(player))
            {
                console.log("poo",newPairing);
                newPairing.push(player); // pick first player
                let player2 = findUnusedPairing(player);
                if (player2 !== undefined) {
                    newPairing.push(player2); // pick second player
                    return true;
                }
                else {
                    console.log("Failed to find a second player for " + player);
                    return false; // failed to find a second player
                }
            }
            return (newPairing.length >= playersPerTeam); // exit early
        });
        if (status !== undefined)
            return Array.from(newPairing);
        else
            return false;
    }

    const equalSets = (arrA, arrB) => {
        return arrA.length === arrB.length
                && arrA.every(item => arrB.includes(item));
    }

    const isSubset = (subArr, supArr) => {
        return subArr.length <= supArr.length
                && subArr.every(item => supArr.includes(item));
    }
    
    let nextToSit = playerList.length-1;
    const getNextRound = () => {
        console.log("Start round------------------------------------------");
        const sittingPlayersList = [];
        for (let i=0; i<sittingPlayers; i++) {
            sittingPlayersList.push(playerList[nextToSit]);
            nextToSit--;
            if (nextToSit < 0) nextToSit = playerList.length-1;
        }

        const round = [];
        let circularPlayerList = Array.from(playerList);
        let rotations = 0;
        const getNextPair = () => {
            const pair = getNewPairing(circularPlayerList, round, sittingPlayersList);
            if (pair && pair !== undefined) {
                return pair;
            } else if (rotations > players*players) {
                console.log(`Terminated recursive loop after ${rotations} recursions`);
            } else {
                 // TODO: needs to try permutations if it failed to find a new pair
                 circularPlayerList.push(circularPlayerList.shift()); // rotate circular list
                 rotations++;
                 console.log("Recursion", rotations);
                 getNextPair();
            }
        };
        console.log("Sitting: " + sittingPlayersList.toString());
        while ((round.length + sittingPlayersList.length) < (playerList.length)) {
            // console.log("while", round.length, round);
            const pair = getNextPair();
            pairings.push(pair);
            round.push(...pair);
        }
        return round;
    }

    for (let i=0; i < numberOfRounds; i++) {
        const nextRound = getNextRound(rounds);
        // console.log("Round "+(i+1), nextRound);
        rounds.push(nextRound);
    }
    

    ///////////////////////////////////////////////
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
    ///////////////////////////////////////////////

    return simpleToComplexRounds(rounds);
};