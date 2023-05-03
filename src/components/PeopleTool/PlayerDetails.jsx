import { useState, useEffect } from "react";
import { newPlayerObj } from "./players";
import StaticPlayerForm from "./StaticPlayerForm";
import EditablePlayerForm from "./EditablePlayerForm";

export default function PlayerDetails({ player, onSave, onCancel, onDelete }) {
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

    const handleSave = async (newPlayer) => {
        if (newPlayer.id !== newPlayerObj.id) {
            const res = await onSave(newPlayer);
            setEditMode(false);
            return res;
        } else {
            alert("Incomplete form. Could not save.");
            return false;
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        onCancel();
    }

    const getFormState = () => ({
        skillsChecked: skillsChecked,
        setSkillsChecked: setSkillsChecked
    });

    return (
        <div className="container" style={{backgroundColor: "#888888"}}>
            {editMode ?
                <EditablePlayerForm player={player} formState={getFormState()} onSave={handleSave} onCancel={handleCancel} onDelete={onDelete} /> :
                <StaticPlayerForm player={player} formState={getFormState()} onEdit={handleEdit} />
            }
        </div>
    );
}