import React from "react";

export default function MatchupTracker({ schedule }) {
    
    return (
        <React.Fragment>
            <h3>Tracker</h3>
            <button onClick={() => console.log("Schedule:", schedule)}>Log</button>
        </React.Fragment>
    );
}