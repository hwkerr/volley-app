import React, { useEffect, useState } from "react";
import { tableStyles, getColStyles } from "./LeagueScheduleDisplay";
import MatchupTracker from "./MatchupTracker";
import { initWeeksList, Schedule, Week } from "./ScheduleClasses";

const roundCount = 2;
let courtCount = 3;
const teamsPerCourt = 2;
export default function ManualSchedulingTool({ teamCount, weekCount, blockCount }) {
    const [schedule, setSchedule] = useState(new Schedule({}));
    const [cellValues, setCellValues] = useState({});
    
    const getCell = (week, block, round, court, teamnum) => {
        let style = {};
        style = getColStyles(court, block);
        const blockIndex = (block === "early" ? 0 : 1);

        const cellKey = getCellKey(week, blockIndex, round, court, teamnum);
        
        return (
            <td key={court} style={style} onClick={() => console.log(cellKey, cellValues[cellKey])}>
                <input type="number"
                        style={{width: "8rem", backgroundColor: "transparent", border: "none", textAlign: "center"}}
                        onChange={handleCellValueChange}
                        placeholder="-"
                        data-week={week}
                        data-block={block}
                        data-round={round}
                        data-court={court}
                        data-teamnum={teamnum}
                        value={cellValues[cellKey] || ""}
                />
            </td>
        );
    }

    // UNEXPECTED BEHAVIOR - TODO: cellValues changes multiple values to the same thing
    const handleCellValueChange = event => {
        const { value, dataset: { week, block, round, court, teamnum } } = event.target;
        const blockIndex = (block === "early" ? 0 : 1);
        console.log("New Cell Value:", value, "(Week "+week+")");
        setCellValues((prevState) => {
            const newState = prevState;
            // newState[week][blockIndex][round][court][teamnum] = value;
            newState[getCellKey(week, blockIndex, round, court, teamnum)] = value;
            updateSchedule(newState);
            return newState;
        });
    };

    const delim = ';';
    const getCellKey = (week, block, round, court, teamNum) => {
        return `${week};${block};${round};${court};${teamNum}`.replaceAll(';', delim);
    }

    // useEffect(() => {
    //     console.log("Update Schedule")
    //     updateSchedule(cellValues);
    // }, [cellValues]);

    

    function* cellKeyGenerator() {
        let val = getCellKey(0, 0, 0, 0, 0).split(delim);
        let done = false;
        while (!done) {
            const next = val.join(delim);
            yield next;
            val[4]++;
            if (val[4] >= teamsPerCourt) {
                val[4] = 0;
                val[3]++;
            }
            if (val[3] >= courtCount) {
                val[3] = 0;
                val[2]++;
            }
            if (val[2] >= roundCount) {
                val[2] = 0;
                val[1]++;
            }
            if (val[1] >= blockCount) {
                val[1] = 0;
                val[0]++;
            }
            if (val[0] >= weekCount) {
                done = true;
                return;
            }
        }
    }
    const updateSchedule = cellValues => {
        console.log("cellValues", cellValues);

        let weeks; // = initWeeksList(weekCount, blockCount, roundCount, courtCount, teamsPerCourt);

        const cells = cellKeyGenerator();

        const getNextCellValue = () => cellValues[cells.next().value] || '';
        const getNextMatch = () => [...(Array(teamsPerCourt).keys())].map(getNextCellValue);
        const getNextRound = () => [...(Array(courtCount).keys())].map(getNextMatch);
        const getNextBlock = () => [...(Array(roundCount).keys())].map(getNextRound);
        const getNextWeek = () => [...(Array(blockCount).keys())].map(getNextBlock);
        const getSchedule = () => [...(Array(weekCount).keys())].map(getNextWeek); // doesn't work for some reason??? too deep?
        
        weeks = getSchedule();

        setSchedule(new Schedule(
            weeks.map(week => (
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

    courtCount = Math.ceil(teamCount/4);
    
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
                                            {range(Math.ceil(courtCount)).map((cell, court) => 
                                                getCell(week, "early", 0, court, 0)
                                            )}
                                        </tr>
                                        <tr>
                                            {range(Math.ceil(courtCount)).map((cell, court) => 
                                                getCell(week, "early", 0, court, 1)
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                                <br />
                                <table>
                                    <tbody>
                                        <tr>
                                            {range(Math.ceil(courtCount)).map((cell, court) => 
                                                getCell(week, "early", 1, court, 0)
                                            )}
                                        </tr>
                                        <tr>
                                            {range(Math.ceil(courtCount)).map((cell, court) => 
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
                                            {range(Math.ceil(courtCount)).map((cell, court) => 
                                                getCell(week, "late", 0, court, 0)
                                            )}
                                        </tr>
                                        <tr>
                                            {range(Math.ceil(courtCount)).map((cell, court) => 
                                                getCell(week, "late", 0, court, 1)
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                                <br />
                                <table>
                                    <tbody>
                                        <tr>
                                            {range(Math.ceil(courtCount)).map((cell, court) => 
                                                getCell(week, "late", 1, court, 0)
                                            )}
                                        </tr>
                                        <tr>
                                            {range(Math.ceil(courtCount)).map((cell, court) => 
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