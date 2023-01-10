export const schedule = {
    weeks: [
        {// week object
            blocks: [
                [
                    {//game-list object
                        matches: [[1, 6], [2, 5], [3, 4]],
                    },
                    {
                        matches: [[1, 5], [6, 4], [2, 3]]
                    }
                ],
                [
                    {//game-list object
                        matches: [[7, 12], [8, 11], [9, 10]]
                    },
                    {
                        matches: [[7, 11], [12, 10], [8, 9]]
                    }
                ]
            ],
            get early() {
                return this.blocks[0];
            },
            get late() {
                if (this.blocks.length > 1)
                    return this.blocks[1];
                else return undefined;
            }
        },
        {
            blocks: [
                [
                    {
                        matches: [[1, 4], [5, 3], [6, 2]],
                    },
                    {
                        matches: [[1, 3], [4, 2], [5, 6]]
                    }
                ],
                [
                    {
                        matches: [[7, 10], [11, 9], [12, 8]]
                    },
                    {
                        matches: [[7, 9], [10, 8], [11, 12]]
                    }
                ]
            ],
            get early() {
                return this.blocks[0];
            },
            get late() {
                if (this.blocks.length > 1)
                    return this.blocks[1];
                else return undefined;
            }
        },
        {
            blocks: [
                [
                    {
                        matches: [[2, 9], [8, 1], [7, 3]],
                    },
                    {
                        matches: [[2, 1], [9, 3], [8, 7]]
                    }
                ],
                [
                    {
                        matches: [[5, 12], [11, 4], [10, 6]]
                    },
                    {
                        matches: [[5, 4], [12, 6], [11, 10]]
                    }
                ]
            ],
            get early() {
                return this.blocks[0];
            },
            get late() {
                if (this.blocks.length > 1)
                    return this.blocks[1];
                else return undefined;
            }
        },
        {
            blocks: [
                [
                    {
                        matches: [[2, 7], [3, 8], [1, 9]],
                    },
                    {
                        matches: [[2, 8], [7, 9], [3, 1]]
                    }
                ],
                [
                    {
                        matches: [[5, 10], [6, 11], [4, 12]]
                    },
                    {
                        matches: [[5, 11], [10, 12], [6, 4]]
                    }
                ]
            ],
            get early() {
                return this.blocks[0];
            },
            get late() {
                if (this.blocks.length > 1)
                    return this.blocks[1];
                else return undefined;
            }
        },
        {
            blocks: [
                [
                    {
                        matches: [[1, 11], [6, 7], [2, 12]],
                    },
                    {
                        matches: [[1, 7], [6, 12], [2, 11]]
                    }
                ],
                [
                    {
                        matches: [[4, 8], [3, 10], [5, 9]]
                    },
                    {
                        matches: [[4, 10], [3, 9], [5, 8]]
                    }
                ]
            ],
            get early() {
                return this.blocks[0];
            },
            get late() {
                if (this.blocks.length > 1)
                    return this.blocks[1];
                else return undefined;
            }
        },
        {
            blocks: [
                [
                    {
                        matches: [[3, 12], [8, 6], [4, 9]],
                    },
                    {
                        matches: [[3, 6], [12, 9], [8, 4]]
                    }
                ],
                [
                    {
                        matches: [[10, 2], [11, 1], [5, 7]]
                    },
                    {
                        matches: [[10, 1], [2, 7], [11, 5]]
                    }
                ]
            ],
            get early() {
                return this.blocks[0];
            },
            get late() {
                if (this.blocks.length > 1)
                    return this.blocks[1];
                else return undefined;
            }
        },
        {
            blocks: [
                [
                    {
                        matches: [[1, 12], [2, 8], [3, 11]],
                    },
                    {
                        matches: [[1, 8], [12, 11], [2, 3]]
                    }
                ],
                [
                    {
                        matches: [[4, 7], [6, 9], [5, 10]]
                    },
                    {
                        matches: [[4, 9], [7, 10], [6, 5]]
                    }
                ]
            ],
            get early() {
                return this.blocks[0];
            },
            get late() {
                if (this.blocks.length > 1)
                    return this.blocks[1];
                else return undefined;
            }
        }
    ],
    getWeek: num => {
        return schedule.weeks[num];
    },
    getGames: (weeknum, block) => {
        const week = schedule.weeks[weeknum];
        if (block === "early")
            return week.early;
        else if (block === "late")
            return week.late;
    }
};

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
    weekConstructor([
        [
            [[1, 6], [2, 5], [3, 4]],
            [[1, 5], [6, 4], [2, 3]]
        ],
        [
            [[7, 12], [8, 11], [9, 10]],
            [[7, 11], [12, 10], [8, 9]]
        ]
    ]),
    weekConstructor([
        [
            [[1, 4], [5, 3], [6, 2]],
            // TODO: continue copying from above
        ],
        [
            
        ]
    ]),
    weekConstructor([
        [
            
        ],
        [
            
        ]
    ]),
    weekConstructor([
        [
            
        ],
        [
            
        ]
    ]),
    weekConstructor([
        [
            
        ],
        [
            
        ]
    ]),
    weekConstructor([
        [
            
        ],
        [
            
        ]
    ]),
    weekConstructor([
        [
            
        ],
        [
            
        ]
    ])
    
];

const weekConstructor = (blocks) => {
    return {// week object
        blocks: blocks.map(block => (
            [
                block.map(round => (
                    {//game-list object
                        matches: round,
                        get teams() {
                            let allTeams = [];
                            for (let team in this.matches) {
                                allTeams.push(team);
                            }
                            return allTeams;
                        }
                    }
                ))
            ]
        )),
        get early() {
            return this.blocks[0];
        },
        get late() {
            if (this.blocks.length > 1)
                return this.blocks[1];
            else return undefined;
        }
    };
}

const scheduleConstructor = (weeks) => {
    return {
        weeks,
        getWeek: num => {
            return schedule.weeks[num];
        },
        getGames: (weeknum, block) => {
            const week = schedule.weeks[weeknum];
            if (block === "early")
                return week.early;
            else if (block === "late")
                return week.late;
        }
    };
}