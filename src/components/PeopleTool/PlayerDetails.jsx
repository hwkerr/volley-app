import { useState } from "react";
import { newPlayerObj } from "./players";
import PlayerForm from "./PlayerForm";

export default function PlayerDetails({ player, onSave }) {
    const [currentPlayer, setCurrentPlayer] = useState(player)
    const [editMode, setEditMode] = useState(player === newPlayerObj);

    const getGenderSpan = gender => {
        if (gender) {
            if (gender.toLowerCase() === 'm')
                return <span style={{color: 'blue'}}>♂</span>
            else if (gender.toLowerCase() === 'f')
                return <span style={{color: 'red'}}>♀</span>
        }
        return <span style={{color: 'purple'}}>⚥</span>
    }

    const handleEdit = () => {
        setEditMode(true);
    }

    const handleSave = (newPlayer) => {
        onSave(newPlayer);
        setCurrentPlayer(newPlayer);
        setEditMode(false);
    }

    const getDetails = (player) => {
        return (
            <>
                <h3>{player.name}</h3>
                <div className="row">
                    <p className="col-6">Gender: {player.gender.toUpperCase()} {getGenderSpan(player.gender)}</p>
                    <p className="col-6">Positions: {player.positions.join(', ')}</p>
                    <p className="col-6">Contact: {player.contact}</p>
                    <p className="col-6">Played: {player.timesPlayed} time(s)</p>
                </div>
                <button className="btn btn-secondary" onClick={handleEdit}>Edit</button>
            </>
        );
    };

    return (
        <div className="container" style={{backgroundColor: "#888888"}}>
            {
                editMode ?
                <PlayerForm player={currentPlayer} onSave={handleSave} onEdit={handleEdit} /> :
                getDetails(player)
            }
        </div>
    );
}