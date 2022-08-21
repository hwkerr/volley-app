import React, { useState } from 'react';

export default function VolleyDisplay({ rounds }) {
    const [hoverNum, setHoverNum] = useState(0);
    
    const hasRightBorder = {
        borderRight: "2px solid gray",
        padding: "0 2rem"
    };

    const hoveredCell = {
        color: "black",
        background: "lavender"
    };

    const handleMouseOver = event => {
        setHoverNum(event.target.dataset.value);
    }

    const handleMouseLeave = event => {
        setHoverNum(0);
    }
    
    return (
        <div>
            <table border="1" frame="void" rules="rows">
                <thead>
                    <tr>
                        <th style={hasRightBorder}>Round</th>
                        <th colSpan="4">Court 1</th>
                        <th colSpan="4">Court 2</th>
                    </tr>
                </thead>
                <tbody>
                    {rounds.map((round, i) =>
                        <tr key={i+"test"}>
                            <td style={hasRightBorder}>{i+1}</td>
                            {round.courts.map((court, j) =>
                                court.teams.map((team, k) =>
                                    <React.Fragment key={`${i}.${j}.${k}`}>
                                        <td style={parseInt(hoverNum)===team[0] ? hoveredCell : {}}
                                                onMouseOver={handleMouseOver}
                                                onMouseLeave={handleMouseLeave}
                                                data-value={team[0]}>
                                            {team[0]}
                                        </td>
                                        <td style={parseInt(hoverNum)===team[1] ? hoveredCell : {}}
                                                onMouseOver={handleMouseOver}
                                                onMouseLeave={handleMouseLeave}
                                                data-value={team[1]}>
                                            {team[1]}
                                        </td>
                                    </React.Fragment>
                                )
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}