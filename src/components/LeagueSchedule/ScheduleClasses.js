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

import { round } from "lodash";

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

export const initWeeksList = (weekCount, blockCount, roundCount, courtCount, teamsPerCourt) => {
    return Array(weekCount).fill(Array(blockCount).fill(Array(roundCount).fill(Array(courtCount).fill(Array(teamsPerCourt).fill("")))));
}

const matchIsEmpty = (match) => {
    return (match.every(team => (team === undefined || team === '')))
}

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

    // team = optional parameter to filter out matches for a specific team
    getAllMatches(team) {
        let allMatches = [];
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            for (let j = 0; j < block.length; j++) {
                const round = block[j].matches;
                for (let k = 0; k < round.length; k++) {
                    const match = round[k];
                    if ((!(team && team !== undefined) || match.includes(team)) && !matchIsEmpty(match) )
                        allMatches = [...allMatches, match];
                }
            }
        }
        return allMatches;
    }
}

const delim = ",", nl = "\n";
const csvFormatHeader = `Week${delim}Block${delim}Round${delim}Court 1${delim}${delim}Court 2${delim}${delim}Court 3${nl}`;

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

    // team = optional parameter to filter out matches for a specific team
    getAllMatches(team) {
        let allMatches = [];
        for (let i = 0; i < this.weeks.length; i++) {
            const week = this.weeks[i];
            allMatches = [...allMatches, ...(week.getAllMatches(team))];
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
        return allTeams.filter(team => team !== "");
    }

    csvFormat() {
        let rows = [];
        for (let w = 0; w < this.weeks.length; w++) {
            const week = this.weeks[w];
            for (let b = 0; b < week.blocks.length; b++) {
                const block = week.blocks[b];
                for (let r = 0; r < block.length; r++) {
                    const round = block[r];
                    let row = "" + (w+1) + delim + (b===0?"Early":"Late") + delim + (r+1) + delim;
                    console.log(round.matches);
                    for (let c = 0; c < round.matches.length; c++) {
                        const court = round.matches[c];
                        for (let t = 0; t < court.length; t++) {
                            const team = court[t];
                            row = row + team.toString() + delim;
                        }
                    }
                    rows.push(row);
                }
            }
        }

        return csvFormatHeader + rows.join(nl);
    }
}