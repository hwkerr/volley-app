import { useState } from "react";
import './PeopleTool.css';

import { newPlayer } from "./players";

export default function NewPlayerForm() {
    const [name, setName] = useState("");
    const [maleGender, setMaleGender] = useState(false);
    const [femaleGender, setFemaleGender] = useState(false);
    const [positionString, setPositionString] = useState("");
    const [contact, setContact] = useState("");

    const handleChangeGenderMale = event => {
        const checked = event.target.value;
        if (checked) {
            setFemaleGender(false);
            setMaleGender(true);
        }
    };

    const handleChangeGenderFemale = event => {
        const checked = event.target.value;
        if (checked) {
            setMaleGender(false);
            setFemaleGender(true);
        }
    };

    const handleChangePositionString = event => {
        setPositionString(event.target.value);
    };

    const handleContactChange = event => {
        setContact(event.target.value);
    };

    const handleAddButton = event => {
        event.preventDefault();
        
        let gender = "";
        if (maleGender) gender = "m";
        else if (femaleGender) gender = "f";

        let positions = positionString.replaceAll(" ", "").split(",");

        const player = newPlayer(name, gender, positions, contact);
        // TODO: use API call to send new player to database

        resetFormFields();
    }

    const resetFormFields = () => {
        setName("");
        setMaleGender(false);
        setFemaleGender(false);
        setPositionString("");
        setContact("");
    }

    return (
        <>
            <div className="row form-group">
                <input className="col-12 form-control form-control-lg header-input" placeholder="New Player" onChange={e => setName(e.target.value)} value={name}></input>
                <div className="col-6">
                    <p className="mb-0">Gender:</p>
                    <div className="form-check form-check-inline no-highlight" onChange={handleChangeGenderMale} >
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="m" onChange={() => {return}} checked={maleGender} />
                        <label className="form-check-label" htmlFor="inlineRadio1"><p>Male</p></label>
                    </div>
                    <div className="form-check form-check-inline no-highlight" onChange={handleChangeGenderFemale}>
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="f" onChange={() => {return}} checked={femaleGender} />
                        <label className="form-check-label" htmlFor="inlineRadio2"><p>Female</p></label>
                    </div>
                </div>
                <div className="col-6">
                    <p className="mb-0">Positions:</p>
                    <input type="text" placeholder="S, M, L, Wing" className="form-control form-control-sm" onChange={handleChangePositionString} value={positionString}/>
                </div>
                <div className="col-6">
                    <p className="mb-0">Contact:</p>
                    <select className="form-control form-control-sm" value={contact} onChange={handleContactChange}>
                        <option value="phone">Phone</option>
                        <option value="facebook">Facebook</option>
                        <option value="groupme">GroupMe</option>
                        <option value="email">Email</option>
                        <option value="add">Add</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <button className="btn btn-primary" onClick={handleAddButton}>Add Player</button>
            </div>
        </>
    );
}