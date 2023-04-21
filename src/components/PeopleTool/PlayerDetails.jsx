import { useState } from "react";
import { newPlayerObj } from "./players";
import PlayerForm from "./PlayerForm";
import { useEffect } from "react";

export default function PlayerDetails({ player, onSave, onDelete }) {
    const [loaded, setLoaded] = useState(true);
    const [editMode, setEditMode] = useState(player === newPlayerObj);

    useEffect(() => {
        console.log("Set player", player.name);
        if (player !== newPlayerObj && editMode) {
            setEditMode(false);
        } else if (player === newPlayerObj && !editMode) {
            setEditMode(true);
        }
    }, [player]);

    const getGenderSpan = gender => {
        if (gender) {
            if (gender.toLowerCase() === 'm')
                return <span style={{color: 'blue'}}>♂</span>
            else if (gender.toLowerCase() === 'f')
                return <span style={{color: 'red'}}>♀</span>
        }
        return <span style={{color: 'purple'}}>⚥</span>
    }

    const startLoading = duration => {
        setLoaded(false);
        if (duration !== undefined)
            setTimeout(() => setLoaded(true), duration);
    }

    const handleEdit = () => {
        setEditMode(true);
    }

    const handleDelete = (player) => {
        onDelete(player);
    }

    const handleSave = (newPlayer) => {
        onSave(newPlayer);
        if (newPlayer !== newPlayerObj)
            setEditMode(false);
    }

    const getDetails = (player) => {
        return (
            <>
                <h3>{player.name.first + ' ' + player.name.last}</h3>
                <div className="row">
                    <p className="col-6">Gender: {player.gender.toUpperCase()} {getGenderSpan(player.gender)}</p>
                    <p className="col-6">Roles: {player.roles.join(', ')}</p>
                    <p className="col-6">Contact: {player.contact.info}</p>
                </div>
                <button className="btn btn-secondary" onClick={handleEdit}>Edit</button>
            </>
        );
    };

    return (
        <div className="container" style={{backgroundColor: "#888888"}}>
            {loaded ? (
                    editMode ?
                    <PlayerForm player={player} onSave={handleSave} onEdit={handleEdit} onDelete={handleDelete} /> :
                    getDetails(player)
                ) :
                (
                    <p>...</p>
                )
            }
        </div>
    );
}