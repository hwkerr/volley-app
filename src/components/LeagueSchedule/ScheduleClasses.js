// const weekConstructor = (blocks) => {
//     return {// week object
//         blocks: blocks.map(block => (
//             [
//                 block.map(round => (
//                     {//game-list object
//                         matches: round,
//                         get teams() {
//                             let allTeams = [];
//                             for (let team in this.matches) {
//                                 allTeams.push(team);
//                             }
//                             return allTeams;
//                         }
//                     }
//                 ))
//             ]
//         )),
//         get early() {
//             return this.blocks[0];
//         },
//         get late() {
//             if (this.blocks.length > 1)
//                 return this.blocks[1];
//             else return undefined;
//         }
//     };
// }

// const scheduleConstructor = (weeksObj) => {
//     const schedule = {
//         weeks: weeksObj,
//         getWeek: num => {
//             return schedule.weeks[num];
//         },
//         getGames: (weeknum, block) => {
//             const week = schedule.weeks[weeknum];
//             if (typeof block === number) 
//                 return week.blocks[block];

//             if (block === "early")
//                 return week.early;
//             else if (block === "late")
//                 return week.late;
//             else
//                 return week.blocks[0];
//         }
//     };

//     return schedule;
// }

const gameList = (round) => ({
    matches: round,
    get teams() {
        let allTeams = [];
        for (let team in this.matches) {
            allTeams.push(team);
        }
        return allTeams;
    }
});

// const blocks = [
//     [ // early
//         [[1,2], [3,4], [5,6]],
//         [[1,6], [2,5], [3,4]]
//     ],
//     [ // late
//         [[1,2], [3,4], [5,6]],
//         [[1,6], [2,5], [3,4]]
//     ]
// ]

export class Week {
    constructor(blocks) {
        this.blocks = blocks.map(block => (
            block.map(round => gameList(round))
        ));
    }

    get early() {
        return this.blocks[0];
    }

    get late() {
        if (this.blocks.length > 1)
            return this.blocks[1];
        else return undefined;
    }

    getAllMatches() {
        let allMatches = [];
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            for (let j = 0; j < block.length; j++) {
                const round = block[j].matches;
                allMatches = [...allMatches, round];
            }
        }
        return allMatches;
    }
}

export class Schedule {
    constructor(weeksList) {
        this.weeks = weeksList;
    }

    getWeek(num) {
        return this.weeks[num];
    }

    getGames(weeknum, block) {
        const week = this.weeks[weeknum];
        if (typeof block === Number)
            return week.blocks[block];

        if (block === "early")
            return week.early;
        else if (block === "late")
            return week.late;
        else
            return week.blocks[0];
    }

    getAllMatches() {
        let allMatches = [];
        for (let i = 0; i < this.weeks.length; i++) {
            const week = this.weeks[i];
            allMatches = [...allMatches, ...(week.getAllMatches())]
        }
        return allMatches
    }

    getAllTeams() {
        let allTeams = [];
        const allMatches = this.getAllMatches();
        for (let i = 0; i < allMatches.length; i++) {
            const [team1, team2] = allMatches[i];
            if (!allTeams.includes(team1) && team1 !== undefined)
                allTeams.push(team1)
            if (!allTeams.includes(team2) && team2 !== undefined)
                allTeams.push(team2)
        }
        return allTeams;
    }
}