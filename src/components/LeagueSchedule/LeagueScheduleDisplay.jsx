import React, { useState } from "react";
import isEmpty from "lodash/isEmpty";

export default function LeagueScheduleDisplay({ schedule }) {
    const [selectedTeam, setSelectedTeam] = useState("");

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

    const getColStyles = (index, block) => {
        if (block === "early") {
            if (index % 2 === 0)
                return tableStyles.earlyA;
            else return tableStyles.earlyB;
        } else if (block === "late") {
            if (index % 2 === 0)
                return tableStyles.lateA;
            else return tableStyles.lateB;
        }
    }

    const getCell = (court, block, team) => {
        let style = {};
        if (selectedTeam.toString() === team.toString())
            style = tableStyles.selected;
        else
            style = getColStyles(court, block);
        
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
        <React.Fragment>
            {!isEmpty(schedule) && schedule.weeks.map((week, num) => (
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
                        </div>
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
                        </div>
                    </div>
                    <br />
                </div>
            ))}
        </React.Fragment>
    );
}