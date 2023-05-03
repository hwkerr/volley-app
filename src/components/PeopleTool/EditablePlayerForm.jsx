import { useState } from "react";
import './PeopleTool.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { newPlayerObj } from "./players";
import PlayerForm, { SKILL_TYPES } from "./PlayerFormFields";

export default function EditablePlayerForm({ player, formState, onSave, onCancel, onDelete }) {
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

    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    const handleChangeContactType = val => {
        setContactType(val);
        if (val === "Phone")
            setContactInfo('');
    };

    const handleChangePhoneNumber = event => {
        const phoneInput = event.target.value;
        setContactInfo(phoneInput.replace(/\D/g,''));
    };

    const validate = () => {
        if (firstName.length === 0) return false;
        else if (lastName.length === 0) return false;
        else return true;
    };
    
    const handleSaveButton = async event => {
        event.preventDefault();

        if (validate()) {
            const player = makePlayerFromForm();

            setSaveLoading(true);
            onSave(player)
            .then(res => {
                if (res)
                    resetFormFields();
            })
            .finally(() => setSaveLoading(false));
        } else {
            alert("Please include a first and last name.")
        }
    };

    const handleDeleteButton = event => {
        event.preventDefault();
        setDeleteLoading(true);
        onDelete(player)
        .finally(() => setDeleteLoading(false));
    };

    const makePlayerFromForm = () => {
        let id = (player.id === newPlayerObj.id && firstName && lastName ?
            (firstName.trim() + "_" + lastName.trim()).replaceAll(" ", "_").replaceAll(/[^A-Za-z]/ig, "") :
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
                type: contactType || '',
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
            <Form id="react-bootstrap-forms-player" className="pt-3 pb-3">
                <fieldset disabled={saveLoading || deleteLoading}>
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
                        contactType={contactType} onChangeContactType={handleChangeContactType}
                        contactInfo={contactInfo} onChangeContactInfo={e => setContactInfo(e.target.value)}
                        onChangePhoneNumber={handleChangePhoneNumber}
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
                        <div className="btn-group">
                            <Button variant="success" size="lg" type="submit" onClick={handleSaveButton}>
                                {saveLoading ?
                                    <Spinner 
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : 'Save'
                                }
                            </Button>
                            <Button variant="secondary" size="lg" type="button" onClick={onCancel}>Cancel</Button>
                            <Button variant="danger" size="lg" type="button" onClick={handleDeleteButton}>
                                {deleteLoading ?
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : 'Delete'
                                }
                            </Button>
                        </div>
                    </div>
                </fieldset>
            </Form>
        </>
    );
}