import { useState } from "react";
import PlayerForm from "./PlayerForm";
import './PeopleTool.css';

export default function PlayerStatsPanel({ player, useEditMode, addOrUpdatePlayer }) {
    const [currentPlayer, setCurrentPlayer] = useState(player)
    const [editMode, setEditMode] = useState(useEditMode);

    const getGenderSpan = gender => {
        if (gender) {
            if (gender.toLowerCase() === 'm')
                return <span style={{color: 'blue'}}>♂</span>
            else if (gender.toLowerCase() === 'f')
                return <span style={{color: 'red'}}>♀</span>
        }
        return <span style={{color: 'purple'}}>⚥</span>
    }

    const handleEditButtonClicked = event => {
        event.preventDefault();
        setEditMode(true);
    }

    const handleSaveButtonClicked = (newPlayer) => {
        setCurrentPlayer(newPlayer);
        setEditMode(false);
    }

    const getDetails = (player) => {
        console.log(editMode, player);
        return (
            <>
                <h3>{player.name}</h3>
                <div className="row">
                    <p className="col-6">Gender: {player.gender.toUpperCase()} {getGenderSpan(player.gender)}</p>
                    <p className="col-6">Positions: {player.positions.join(', ')}</p>
                    <p className="col-6">Contact: {player.contact}</p>
                    <p className="col-6">Played: {player.timesPlayed} time(s)</p>
                </div>
                <button className="btn btn-secondary" onClick={handleEditButtonClicked}>Edit</button>
            </>
        );
    };

    return (
        <>
            {
                editMode ?
                <PlayerForm player={player} onSave={handleSaveButtonClicked} addOrUpdatePlayer={addOrUpdatePlayer} /> :
                getDetails(player)
            }
        </>
    );
}