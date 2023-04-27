import { useState, useEffect } from "react";
import { newPlayerObj } from "./players";
import StaticPlayerForm from "./StaticPlayerForm";
import EditablePlayerForm from "./EditablePlayerForm";

export default function PlayerDetails({ player, onSave, onDelete }) {
    const [editMode, setEditMode] = useState(player === newPlayerObj);

    const [skillsChecked, setSkillsChecked] = useState(false);

    useEffect(() => {
        console.log("View details for player:", player.id);
        if (player !== newPlayerObj && editMode) {
            setEditMode(false);
        } else if (player === newPlayerObj && !editMode) {
            setEditMode(true);
        }
    }, [player]);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleDelete = (player) => {
        onDelete(player);
    };

    const handleSave = (newPlayer) => {
        if (newPlayer.id !== newPlayerObj.id) {
            onSave(newPlayer);
            setEditMode(false);
        } else {
            alert("No changes were made. Nothing to save.");
        }
    };

    const getFormState = () => ({
        skillsChecked: skillsChecked,
        setSkillsChecked: setSkillsChecked
    });

    return (
        <div className="container" style={{backgroundColor: "#888888"}}>
            {editMode ?
                <EditablePlayerForm player={player} formState={getFormState()} onSave={handleSave} onDelete={handleDelete} /> :
                <StaticPlayerForm player={player} formState={getFormState()} onEdit={handleEdit} />
            }
        </div>
    );
}