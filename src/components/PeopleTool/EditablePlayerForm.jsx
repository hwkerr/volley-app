import { useState } from "react";
import './PeopleTool.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { newPlayerObj } from "./players";
import PlayerForm, { SKILL_TYPES } from "./PlayerFormFields";

import { FORM_VARIANT, FORM_VARIANT_TAG, FORM_VARIANT_TOGGLE } from "./PlayerFormFields"

// TODO: Consolidate PlayerDetails and PlayerForm using the render functions I created
// TODO: Add buttons for Cancel and Delete next to Save
// TODO: Access API Gateway function to delete data

export default function EditablePlayerForm({ player, formState, onSave, onDelete }) {
    const [firstName, setFirstName] = useState(player.name.first);
    const [lastName, setLastName] = useState(player.name.last);
    const [nickChecked, setNickChecked] = useState(player.name.nicks ? true : false);
    const [nicknames, setNicknames] = useState(player.name.nicks || []);

    const [gender, setGender] = useState(player.gender);
    const [handedness, setHandedness] = useState(player.handedness);
    const [roles, setRoles] = useState(player.roles);
    const [skills, setSkills] = useState(player.skills);

    const [contactType, setContactType] = useState(player.contact.type);
    const [contactInfo, setContactInfo] = useState(player.contact.info || "");
    
    const [newAffiliation, setNewAffiliation] = useState("");
    const [affiliations, setAffiliations] = useState(player.affiliation);
    
    const [notes, setNotes] = useState(player.notes || "");

    /** adds a list of affiliations to the existing list of affiliations
      * @ensure all added strings are:
      *         trimmed of whitespace
      *         unique from existing strings and each-other
      *         non-empty
    */
    const addAffiliations = affiliationNames => {
        const trimmed = affiliationNames.map(n => n.trim());
        const filtered = trimmed.filter(n => (n !== "" && !affiliations.includes(n)));
        const uniqueOnly = [...(new Set(filtered))];
        setAffiliations(prev => [...prev, ...uniqueOnly]);
    };
    
    const handleChangeNewAffiliation = event => {
        const inputValue = event.target.value;
        if (inputValue.includes(';')) {
            const newAffiliations = inputValue.split(';').filter(val => val !== '')
            addAffiliations(newAffiliations);
            setNewAffiliation('');
        } else {
            setNewAffiliation(inputValue);
        }
    };
    
    const handleClickNewAffiliationButton = () => {
        addAffiliations([newAffiliation]);
        setNewAffiliation("");
    };

    // remove an affiliation if it is clicked
    const handleClickAffiliationTag = event => {
        const affiliationToRemove = event.target.dataset.value;
        setAffiliations(prev => prev.filter(item => item !== affiliationToRemove));
    };

    const handleChangeNotes = event => {
        const notesInput = event.target.value;
        setNotes(notesInput);
    };

    const handleSaveButton = event => {
        event.preventDefault();

        const player = makePlayerFromForm();

        onSave(player);
        resetFormFields();
    };

    const handleDeleteButton = event => {
        event.preventDefault();

        onDelete(player);
    };

    const makePlayerFromForm = () => {
        let id = (player.id === newPlayerObj.id && firstName && lastName ?
            (firstName.trim() + "_" + lastName.trim()).replaceAll(" ", "_") :
            player.id
        );
        let mySkills = {};
        SKILL_TYPES.forEach(skillType => {
            mySkills[skillType.toLowerCase()] = skills[skillType.toLowerCase()];
        });

        const p = {
            id: id,
            gender: gender,
            handedness: handedness,
            name: {
                first: firstName.trim(),
                last: lastName.trim(),
                nicks: nicknames
            },
            roles: roles,
            skills: mySkills,
            contact: {
                type: contactType,
                info: contactInfo.trim()
            },
            affiliation: affiliations,
            notes: notes.trim()
        };

        return p;
    };

    const resetFormFields = () => {
        setFirstName("");
        setLastName("");
        setNickChecked(false);
        setGender(null);
        setHandedness(null);
        setRoles([]);
        setSkills({});
        setContactType(null);
        setContactInfo("");
        setNewAffiliation("");
        setAffiliations([]);
        setNotes("");
    };

    return (
        <>
            <Form id="react-bootstrap-forms-test" className="pt-3 pb-3">
                <PlayerForm.Editable.Names
                    firstName={firstName} onChangeFirstName={e => setFirstName(e.target.value)}
                    lastName={lastName} onChangeLastName={e => setLastName(e.target.value)}
                    nicknames={nicknames} onChangeNicknames={e => setNicknames(e.target.value.split(';').filter(name => name !== ''))}
                    nickChecked={nickChecked} onNickChecked={e => setNickChecked(e.currentTarget.checked)}
                />
                <hr />
                <PlayerForm.Editable.Gender gender={gender} onChangeGender={val => setGender(val)} />
                <PlayerForm.Editable.Handedness handedness={handedness} onChangeHandedness={val => setHandedness(val)} />
                <PlayerForm.Editable.Roles roles={roles} onChangeRoles={val => setRoles(val)} />
                <hr />
                <PlayerForm.Editable.Contact
                    contactType={contactType} onChangeContactType={val => setContactType(val)}
                    contactInfo={contactInfo} onChangeContactInfo={e => setContactInfo(e.target.value)}
                    onChangePhoneNumber={e => setContactInfo(e.target.value)}
                />
                <hr />
                <PlayerForm.Editable.Affiliation
                    newAffiliation={newAffiliation} onChangeNewAffiliation={handleChangeNewAffiliation}
                    affiliations={affiliations} onClickNewAffiliationButton={handleClickNewAffiliationButton} 
                    onClickAffiliationTag={handleClickAffiliationTag}
                />
                <hr />
                <PlayerForm.Editable.Skills
                    skills={skills} setSkills={setSkills}
                    skillsChecked={formState.skillsChecked} setSkillsChecked={formState.setSkillsChecked}
                />
                <hr />
                <PlayerForm.Editable.Notes notes={notes} onChangeNotes={e => setNotes(e.target.value)} />
                <hr />
                <div className="d-grid gap-2">
                    <Button variant="success" size="lg" type="submit" onClick={handleSaveButton}>Save</Button>
                </div>
            </Form>
            {/* <div className="row form-group">
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
                <button className="btn btn-primary" onClick={handleSaveButton}>Save</button>
                {player !== newPlayerObj && <button className="btn btn-danger" onClick={handleDeleteButton}>Delete</button>}
            </div> */}
        </>
    );
}