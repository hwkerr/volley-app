import { useState } from "react";
import NewPlayerForm from "./NewPlayerForm";
import './PeopleTool.css';

export default function PlayerStatsPanel({ player, newPlayer }) {

    const getGenderSpan = gender => {
        if (gender) {
            if (gender.toLowerCase() === 'm')
                return <span style={{color: 'blue'}}>♂</span>
            else if (gender.toLowerCase() === 'f')
                return <span style={{color: 'red'}}>♀</span>
        }
        return <span style={{color: 'purple'}}>⚥</span>
    }

    const getDetails = (player) => (
        <>
            <h3>{player.name}</h3>
            <div className="row">
                <p className="col-6">Gender: {player.gender.toUpperCase()} {getGenderSpan(player.gender)}</p>
                <p className="col-6">Positions: {player.positions.join(', ')}</p>
                <p className="col-6">Contact: {player.contact}</p>
                <p className="col-6">Played: {player.timesPlayed} time(s)</p>
            </div>
        </>
    );
    
    return (
        <>
            {
                !newPlayer ?
                getDetails(player) :
                <NewPlayerForm />
            }
        </>
    );
}