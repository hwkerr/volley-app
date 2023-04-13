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
    const [selectedTeam, setSelectedTeam] = useState('');
    const [importText, setImportText] = useState('');

    const handleCellValueChange = event => {
        const { value, dataset: { week, block, round, court, teamnum } } = event.target;
        updateCell({week, block, round, court, teamnum}, value);
    };

    const updateCell = ({week, block, round, court, teamnum}, value) => {
        console.log("Update cell to "+ value);
        const blockIndex = (block.toLowerCase() === "early" ? 0 : 1);
        setCellValues((prevState) => {
            const newState = prevState;
            // newState[week][blockIndex][round][court][teamnum] = value;
            newState[getCellKey(week, blockIndex, round, court, teamnum)] = value;
            updateSchedule(newState);
            return newState;
        });
    }

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

    const formatSchedule = schedule => {
        return schedule.csvFormat();
    }
    
    const exportSchedule = e => {
        let text = formatSchedule(schedule);
        navigator.clipboard.writeText(text); // copy to clipboard
        console.log("Copied to clipboard")
        alert('Copied to clipboard');
    }

    const importSchedule = e => {
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
        console.log("Imported schedule");
        const allRows = importText.split('\n').slice(1).map(row => row.split(','));
        console.log(allRows);
        const maxWeekNumber = allRows.reduce((max, row) => row[0]>max ? row[0] : max);
        const newSchedule = [];
        for (let weekNumber = 0; weekNumber < maxWeekNumber; weekNumber++) {
            const week = [];
            for (let blockNumber = 0; blockNumber < 2; blockNumber++) {
                const blockName = (blockNumber === 0 ? "Early" : "Late");
                const block = [];
                for (let roundNumber = 0; roundNumber < 2; roundNumber++) {
                    const row = allRows.filter(row => ((parseInt(row[0]) === (weekNumber+1) && row[1] === blockName && parseInt(row[2]) === (roundNumber+1))))[0];
                    const matches = [];
                    let court = 0;
                    console.log(row, row.length);
                    for (let i = 3; i+1 < row.length; i+=2) {
                        updateCell({week: weekNumber, block: blockName, round: roundNumber, court, teamnum: 0}, row[i]);
                        updateCell({week: weekNumber, block: blockName, round: roundNumber, court, teamnum: 1}, row[i+1]);
                        court++;
                    }
                    block.push(matches);
                }
                week.push(block);
            }
            newSchedule.push(new Week(week));
        }
        // setSchedule(new Schedule(newSchedule));
    }


    const range = (n) => { // 4 => 0 1 2 3
        return [...Array(n).keys()];
    }

    const rangeBetween = (a, b) => { // 2, 6 => 2 3 4 5
        if (b === undefined) return range(a);
        return range(b-a).map(el => el+a);
    }

    courtCount = Math.ceil(teamCount/4);

    const makeCell = (week, block, round, court, teamnum) => {
        const blockIndex = (block === "early" ? 0 : 1);

        const cellKey = getCellKey(week, blockIndex, round, court, teamnum);

        const team = cellValues[cellKey] || "";
        let style, selected;
        if (selectedTeam && team && selectedTeam.toString() === team.toString()) {
            style = tableStyles.selected;
            selected = true;
        }
        else
            style = getColStyles(court, block);
        style = {
            ...style,
            padding: "0",
            minWidth: "4rem"
        }
        
        return (
            <td key={court} style={style}>
                <input type="number"
                        className="no-arrows"
                        style={{width: "100%", backgroundColor: "transparent", border: "none", textAlign: "center"}}
                        onChange={handleCellValueChange}
                        onWheel={e => e.target.blur()}
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

    const makeTableRow = (week, block, round, teamnum) => (
        <tr key={teamnum}>
            {range(Math.ceil(courtCount)).map((cell, court) => 
                makeCell(week, block, round, court, teamnum)
            )}
        </tr>
    )

    const makeClearButton = (week, block, round) => {
        const handleClick = e => {
            for (let court = 0; court < courtCount; court++)
                for (let teamnum = 0; teamnum < teamsPerCourt; teamnum++)
                    updateCell({week, block, round, court, teamnum}, 0);
        };
        const styles = {
            padding: "1em",
            margin: "0",
            border: "0",
            borderRadius: "5px",
            fontSize: "0.5em",
            textAlign: "left"
        };
        return (
            <button onClick={handleClick} style={styles}>clear</button>
        )
    };
    
    return (
        <div className="container-xl row">
            <div className="col-4" style={{overflowY: "scroll", height: "calc(100vh)"}}>
                {range(teamCount).map(week => (
                    <div key={week}>
                        <h3>Week {week+1}</h3>
                        <div className="row">
                            <div className="" style={tableStyles.tableLeft}> {/* col */}
                                <h6 style={{textAlign: "left"}}>Early</h6>
                                <div className="row">
                                    <table className="col">
                                        <tbody>
                                            {range(teamsPerCourt).map(i => (
                                                makeTableRow(week, "early", 0, i)
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="col">{makeClearButton(week, "early", 0)}</div>
                                </div>
                                <br />
                                <div className="row">
                                    <table className="col">
                                        <tbody>
                                            {range(teamsPerCourt).map(i => (
                                                makeTableRow(week, "early", 1, i)
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="col">{makeClearButton(week, "early", 1)}</div>
                                </div>
                            </div>
                            <div className="" style={tableStyles.tableLeft}> {/* col */}
                                <h6 style={{textAlign: "left"}}>Late</h6>
                                <div className="row">
                                    <table className="col">
                                        <tbody>
                                            {range(teamsPerCourt).map(i => (
                                                makeTableRow(week, "late", 0, i)
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="col">{makeClearButton(week, "late", 0)}</div>
                                </div>
                                <br />
                                <div className="row">
                                    <table className="col">
                                        <tbody>
                                            {range(teamsPerCourt).map(i => (
                                                makeTableRow(week, "late", 1, i)
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="col">{makeClearButton(week, "late", 1)}</div>
                                </div>
                            </div>
                        </div>
                        <br />
                    </div>
                ))}
            </div>
            <div className="col-8">
                <MatchupTracker schedule={schedule} setSelectedTeam={setSelectedTeam}/>
            </div>
            <hr />
            <div>
                <h2>Export</h2>
                <button onClick={exportSchedule}>Export</button>
            </div>
            <div>
                <h2>Import</h2>
                <textarea value={importText} onChange={e => setImportText(e.target.value)} />
                <button onClick={importSchedule}>Import</button>
            </div>
        </div>
    );
}