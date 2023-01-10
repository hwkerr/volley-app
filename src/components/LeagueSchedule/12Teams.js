export const schedule = new Schedule(schedule12);

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

const schedule12 = [
    new Week([
        [
            [[1, 6], [2, 5], [3, 4]],
            [[1, 5], [6, 4], [2, 3]]
        ],
        [
            [[7, 12], [8, 11], [9, 10]],
            [[7, 11], [12, 10], [8, 9]]
        ]
    ]),
    new Week([
        [
            [[1, 4], [5, 3], [6, 2]],
            [[1, 3], [4, 2], [5, 6]]
        ],
        [
            [[7, 10], [11, 9], [12, 8]],
            [[7, 9], [10, 8], [11, 12]]
        ]
    ]),
    new Week([
        [
            [[2, 9], [8, 1], [7, 3]],
            [[2, 1], [9, 3], [8, 7]]
        ],
        [
            [[5, 12], [11, 4], [10, 6]],
            [[5, 4], [12, 6], [11, 10]]
        ]
    ]),
    new Week([
        [
            [[2, 7], [3, 8], [1, 9]],
            [[2, 8], [7, 9], [3, 1]]
        ],
        [
            [[5, 10], [6, 11], [4, 12]],
            [[5, 11], [10, 12], [6, 4]]
        ]
    ]),
    new Week([
        [
            [[1, 11], [6, 7], [2, 12]],
            [[1, 7], [6, 12], [2, 11]]
        ],
        [
            [[4, 8], [3, 10], [5, 9]],
            [[4, 10], [3, 9], [5, 8]]
        ]
    ]),
    new Week([
        [
            [[3, 12], [8, 6], [4, 9]],
            [[3, 6], [12, 9], [8, 4]]
        ],
        [
            [[10, 2], [11, 1], [5, 7]],
            [[10, 1], [2, 7], [11, 5]]
        ]
    ]),
    new Week([
        [
            [[1, 12], [2, 8], [3, 11]],
            [[1, 8], [12, 11], [2, 3]]
        ],
        [
            [[4, 7], [6, 9], [5, 10]],
            [[4, 9], [7, 10], [6, 5]]
        ]
    ])
    
];

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

class Schedule {
    constructor(weeksObj) {
        this.weeks = weeksObj;
    }

    getWeek(num) {
        return this.weeks[num];
    }

    getGames(weeknum, block) {
        const week = schedule.weeks[weeknum];
        if (typeof block === Number)
            return week.blocks[block];

        if (block === "early")
            return week.early;
        else if (block === "late")
            return week.late;
        else
            return week.blocks[0];
    }
}

class Week {
    constructor(blocks) {
        this.blocks = blocks.map(block => (
            [
                block.map(round => new GameList(round))
            ]
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
}

class GameList {
    constructor(matches) {
        this.matches = matches;
    }

    get teams() {
        let allTeams = [];
        for (let team in this.matches) {
            allTeams.push(team);
        }
        return allTeams;
    }
}