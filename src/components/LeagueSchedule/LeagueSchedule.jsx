import React, { useState } from 'react';
import { schedule as twelveTeamSchedule } from './12Teams';

export default function LeagueSchedule() {
    const [selectedTeam, setSelectedTeam] = useState("");
    const initialPos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const teamCount = initialPos.length;
    const teamsPerTime = teamCount/2;
    const posList = [];
    const getMatchupObject = pos => {
        let matchupObj = {};
        for (let i = 0; i < pos.length; i++) {
            const team = pos[i];
            const opponent = pos[pos.length-1-i]
            matchupObj[team] = opponent;
        }
        return matchupObj;
    }
    const getMatchups = pos => {
        let matchups = [];
        for (let i = 0; i < pos.length/2; i++) {
            const team = pos[i];
            const opponent = pos[pos.length-1-i]
            matchups.push(team < opponent ? [team, opponent] : [opponent, team]);
        }
        return matchups;
    }
    const getAllMatchups = posList => {
        const matchupsList = [];
        for (let i = 0; i < posList.length; i++) {
            const matchups = getMatchups(posList[i]);
            matchupsList.push(matchups);
        }
        return matchupsList;
    }

    const swap = (arr, i1, i2) => {
        const newArr = [];
        for (let i = 0; i < arr.length; i++) {
            let element;
            if (i === i1)
                element = arr[i2];
            else if (i === i2)
                element = arr[i1];
            else
                element = arr[i]
            newArr.push(element);
        }
        return newArr;
    }

    const rotateWithDoubleFreeze = (pos, frozen) => {
        // first element always frozen
        // indicate second frozen element with "frozen" parameter
        // value of -1 means only freeze first element

        const queue = [...pos];
        const newPos = [];
            
        const first = queue.shift();
        newPos.push(first); // first (locked)

        const last = queue.pop();
        newPos.push(last); // last
        while (queue.length > 0) {
            if (newPos.length === frozen) {
                newPos.push(pos[frozen]);
            } else {
                let next = queue.shift();
                if (next === pos[frozen])
                    next = queue.shift();
                newPos.push(next);
            }
        }

        return swap(newPos, 4, 9);
    }
    
    const rotate = (pos, rotateAll) => {
        if (rotateAll) {
            return rotateWithDoubleFreeze(pos, -1);
        } else {
            return rotateWithDoubleFreeze(pos, 3);
        }
    }

    const getSchedule = () => {
        let pos_early = [];
        let pos_late = [];
        for (let day = 1; day <= 8; day++) {
            const lastPos = pos_late;
            if (day === 1) pos_early = initialPos;
            else pos_early = rotate(lastPos, true);
            pos_late = rotate(pos_early, false);

            posList.push(pos_early);
            posList.push(pos_late);
        }
        return posList;
    }

    const validate = (arr) => {
        const allMatchups = [];
        let repeats = 0;
        for (let roundIndex = 0; roundIndex < arr.length; roundIndex++) {
            const round = arr[roundIndex];
            const matchups = getMatchups(round);
            matchups.forEach(matchup => {
                if (allMatchups.includes(matchup)) {
                    repeats++;
                }
                allMatchups.push(matchup);
                // console.log("matchup", matchup);
            });
        };
        return repeats;
    }

    const schedule = getSchedule();
    const allMatchups = getAllMatchups(schedule);
    // console.log(validate(allMatchups) + " repeats");
    
    const tableStyles = {
        tableLeft: {
            textAlign: "center",
            marginRight: "2rem"
        },
        tableRight: {
            textAlign: "center",
            marginLeft: "2rem"
        },
        earlyA: {
            backgroundColor: "lightgreen",
            color: "black",
            borderRight: "1px solid white",
            width: "100px"
        },
        earlyB: {
            backgroundColor: "lightseagreen",
            color: "black",
            borderRight: "1px solid white",
            width: "100px"
        },
        lateA: {
            backgroundColor: "plum",
            color: "white",
            borderLeft: "1px solid white",
            width: "100px"
        },
        lateB: {
            backgroundColor: "purple",
            color: "white",
            borderLeft: "1px solid white",
            width: "100px"
        },
        selected: {
            backgroundColor: "black",
            color: "white",
            width: "100px"
        }
    }

    const getColStylesEarly = index => {
        if (index % 2 === 0)
            return tableStyles.earlyA;
        else return tableStyles.earlyB;
    }

    const getColStylesLate = index => {
        if (index % 2 === 0)
            return tableStyles.lateA;
        else return tableStyles.lateB;
    }

    const getCell = (court, block, team) => {
        let style = {};
        if (selectedTeam.toString() === team.toString()) {
            style = tableStyles.selected;
        }
        else {
            if (block === "early") {
                style = getColStylesEarly(court);
            } else if (block === "late") {
                style = getColStylesLate(court);
            }
        }
        
        return (
            <td key={court}
                    style={style}
                    onClick={handleMouseClick}
                    data-team={team}>
                {team}
            </td>
        );
    }

    const handleMouseClick = event => {
        const clicked = event.target.dataset.team;
        if (clicked.toString() === selectedTeam.toString())
            setSelectedTeam("");
        else
            setSelectedTeam(clicked.toString());
    }
    
    return (
        <div className="App-body">
            <p>League Schedule component</p>
            {twelveTeamSchedule.weeks.map((week, num) => (
                <div key={num+1} className="">
                    <h3>Week {num+1}</h3>
                    <div className="row">
                        <div className="col">
                            <table style={tableStyles.tableLeft}>
                                <tbody>
                                    <tr>
                                        {week.early[0].matches.map((match, court) => 
                                            getCell(court, "early", match[0])
                                        )}
                                    </tr>
                                    <tr>
                                        {week.early[0].matches.map((match, court) => 
                                            getCell(court, "early", match[1])
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                            <br />
                            <table style={tableStyles.tableLeft}>
                                <tbody>
                                    <tr>
                                        {week.early[1].matches.map((match, court) =>  
                                            getCell(court, "early", match[0])
                                        )}
                                    </tr>
                                    <tr>
                                        {week.early[1].matches.map((match, court) =>  
                                            getCell(court, "early", match[1])
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        </div> {/*col*/}
                        <div className="col">
                            <table style={tableStyles.tableRight}>
                                <tbody>
                                    <tr>
                                        {week.late[0].matches.map((match, court) =>  
                                            getCell(court, "late", match[0])
                                        )}
                                    </tr>
                                    <tr>
                                        {week.late[0].matches.map((match, court) =>  
                                            getCell(court, "late", match[1])
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                            <br />
                            <table style={tableStyles.tableRight}>
                                <tbody>
                                    <tr>
                                        {week.late[1].matches.map((match, court) =>  
                                            getCell(court, "late", match[0])
                                        )}
                                    </tr>
                                    <tr>
                                        {week.late[1].matches.map((match, court) =>  
                                            getCell(court, "late", match[1])
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        </div> {/*col*/}
                    </div> {/*row*/}
                    <br />
                </div>
            ))}
            
            {/* <div>
                {posList.map((pos, i) => (
                        <React.Fragment key={i}>
                            <table>
                                <tbody>
                                    <tr>
                                        {pos.slice(0,teamsPerTime/2).map((team, j) => (
                                            <td style={tableStyles.earlyA} key={j}>{team}</td>
                                        ))}
                                        {pos.slice(teamsPerTime/2,teamsPerTime).map((team, j) => (
                                            <td style={tableStyles.lateA} key={j}>{team}</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        {pos.slice(teamsPerTime, teamsPerTime+(teamsPerTime/2)).reverse().map((team, j) => (
                                            <td style={tableStyles.earlyB} key={j}>{team}</td>
                                        ))}
                                        {pos.slice(teamsPerTime+(teamsPerTime/2), teamCount).reverse().map((team, j) => (
                                            <td style={tableStyles.lateB} key={j}>{team}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                            <hr />
                        </React.Fragment>
                    )
                )}
            </div> */}
        </div>
    );
}