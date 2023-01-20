import React, { useState } from "react";
import isEmpty from "lodash/isEmpty";

export const tableStyles = {
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
        borderRight: "1px solid white"
    },
    earlyB: {
        backgroundColor: "lightseagreen",
        color: "black",
        borderRight: "1px solid white"
    },
    lateA: {
        backgroundColor: "plum",
        color: "white",
        borderLeft: "1px solid white"
    },
    lateB: {
        backgroundColor: "purple",
        color: "white",
        borderLeft: "1px solid white"
    },
    selected: {
        backgroundColor: "gray",
        color: "black"
    },
    all: {
        width: "10px"
    }
}

export const getColStyles = (index, block) => {
    let styles = {};
    if (block === "early") {
        if (index % 2 === 0)
            styles = tableStyles.earlyA;
        else styles = tableStyles.earlyB;
    } else if (block === "late") {
        if (index % 2 === 0)
            styles = tableStyles.lateA;
        else styles = tableStyles.lateB;
    }
    styles = {
        ...styles,
        ...tableStyles.all
    }
    return styles;
}

export default function LeagueScheduleDisplay({ schedule, empty }) {
    const [selectedTeam, setSelectedTeam] = useState("");

    const getCell = (court, block, team) => {
        let style = {};
        if (selectedTeam && team && selectedTeam.toString() === team.toString())
            style = tableStyles.selected;
        else
            style = getColStyles(court, block);
        
        return (
            <td key={court}
                    style={style}
                    onClick={handleMouseClick}
                    data-team={team}>
                {team || ""}
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
        <React.Fragment>
            {!isEmpty(schedule) && schedule.weeks.map((week, num) => (
                <div key={num+1} className="">
                    <h3>Week {num+1}</h3>
                    <div className="row">
                        <div className="col" style={tableStyles.tableLeft}>
                            {week.late && <h6 style={{textAlign: "left"}}>Early</h6>}
                            <table>
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
                            <table>
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
                        </div>
                        {week.late && <div className="col" style={tableStyles.tableRight}>
                            <h6 style={{textAlign: "left"}}>Late</h6>
                            <table>
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
                            <table>
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
                        </div>}
                    </div>
                    <br />
                </div>
            ))}
        </React.Fragment>
    );
}