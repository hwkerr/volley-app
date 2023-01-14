import React, { useEffect, useState } from "react";
import { tableStyles, getColStyles } from "./LeagueScheduleDisplay";
import MatchupTracker from "./MatchupTracker";
import { Schedule, Week } from "./ScheduleClasses";

const roundCount = 2;
const courtCount = 3;
const teamsPerCourt = 2;
export default function ManualSchedulingTool({ teamCount, weekCount, blockCount }) {
    const [schedule, setSchedule] = useState(new Schedule([]));
    const [cellValues, setCellValues] = useState(Array(weekCount).fill(Array(blockCount).fill(Array(roundCount).fill(Array(courtCount).fill(Array(teamsPerCourt).fill(""))))));
    
    const getCell = (week, block, round, court, teamnum) => {
        let style = {};
        style = getColStyles(court, block);
        const blockIndex = (block === "early" ? 0 : 1);
        
        return (
            <td key={court} style={style}>
                <input type="number"
                        style={{width: "8rem", backgroundColor: "transparent", border: "none", textAlign: "center"}}
                        onChange={handleCellValueChange}
                        placeholder="-"
                        data-week={week}
                        data-block={block}
                        data-round={round}
                        data-court={court}
                        data-teamnum={teamnum}
                        value={cellValues[week][blockIndex][round][court][teamnum]}
                />
            </td>
        );
    }

    // UNEXPECTED BEHAVIOR - TODO: cellValues changes multiple values to the same thing
    const handleCellValueChange = event => {
        const { value, dataset: { week, block, round, court, teamnum } } = event.target;
        const blockIndex = (block === "early" ? 0 : 1);
        console.log("Event:", value, "// Week: ", week);
        setCellValues((prevState) => {
            const newState = prevState;
            newState[week][blockIndex][round][court][teamnum] = value;
            updateSchedule(newState);
            return newState;
        });
    };

    // useEffect(() => {
    //     console.log("Update Schedule")
    //     updateSchedule(cellValues);
    // }, [cellValues]);

    const updateSchedule = cellValues => {
        setSchedule(new Schedule(
            cellValues.map(week => (
                new Week(week)
            ))
        ));
    };


    const range = (n) => { // 4 => 0 1 2 3
        return [...Array(n).keys()];
    }

    const rangeBetween = (a, b) => { // 2, 6 => 2 3 4 5
        if (b === undefined) return range(a);
        return range(b-a).map(el => el+a);
    }

    const cellsPerBlock = Math.ceil(teamCount/4);
    
    return (
        <div className="container row">
            <div className="col" style={{overflowY: "scroll", height: "calc(100vh)"}}>
                {range(teamCount).map(week => (
                    <div key={week}>
                        <h3>Week {week+1}</h3>
                        <div className="row">
                            <div className="col" style={tableStyles.tableLeft}>
                                <h6 style={{textAlign: "left"}}>Early</h6>
                                <table>
                                    <tbody>
                                        <tr>
                                            {range(Math.ceil(cellsPerBlock)).map((cell, court) => 
                                                getCell(week, "early", 0, court, 0)
                                            )}
                                        </tr>
                                        <tr>
                                            {range(Math.ceil(cellsPerBlock)).map((cell, court) => 
                                                getCell(week, "early", 0, court, 1)
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                                <br />
                                <table>
                                    <tbody>
                                        <tr>
                                            {range(Math.ceil(cellsPerBlock)).map((cell, court) => 
                                                getCell(week, "early", 1, court, 0)
                                            )}
                                        </tr>
                                        <tr>
                                            {range(Math.ceil(cellsPerBlock)).map((cell, court) => 
                                                getCell(week, "early", 1, court, 1)
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col" style={tableStyles.tableRight}>
                                <h6 style={{textAlign: "left"}}>Late</h6>
                                <table>
                                    <tbody>
                                        <tr>
                                            {range(Math.ceil(cellsPerBlock)).map((cell, court) => 
                                                getCell(week, "late", 0, court, 0)
                                            )}
                                        </tr>
                                        <tr>
                                            {range(Math.ceil(cellsPerBlock)).map((cell, court) => 
                                                getCell(week, "late", 0, court, 1)
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                                <br />
                                <table>
                                    <tbody>
                                        <tr>
                                            {range(Math.ceil(cellsPerBlock)).map((cell, court) => 
                                                getCell(week, "late", 1, court, 0)
                                            )}
                                        </tr>
                                        <tr>
                                            {range(Math.ceil(cellsPerBlock)).map((cell, court) => 
                                                getCell(week, "late", 1, court, 1)
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <br />
                    </div>
                ))}
            </div>
            <div className="col">
                <MatchupTracker schedule={schedule} />
            </div>
        </div>
    );
}