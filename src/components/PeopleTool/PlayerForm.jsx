import { useState } from "react";
import './PeopleTool.css';
import Form from 'react-bootstrap/Form';
import InputGroup from "react-bootstrap/InputGroup";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import RangeSlider from 'react-bootstrap-range-slider';

import { newPlayerObj } from "./players";

import { CONTACT_TYPES_WITH_INFO, SKILL_TYPES, USE_SKILL_SLIDERS } from "./PlayerDetails";
const FORM_VARIANT = "danger";
const FORM_VARIANT_TAG = "info";
const FORM_VARIANT_TOGGLE = "outline-light";

// TODO: Consolidate PlayerDetails and PlayerForm using the render functions I created
// TODO: Access API Gateway functions to save, add, and delete data

export default function PlayerForm({ player, formState, onSave, onDelete }) {
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

    const handleChangeFirstName = event => {
        const firstName = event.target.value;
        setFirstName(firstName);
    }

    const handleChangeLastName = event => {
        const lastName = event.target.value;
        setLastName(lastName);
    }

    const handleNickChecked = event => {
        const checked = event.currentTarget.checked;
        setNickChecked(checked);
    }

    const handleChangeNickname = event => {
        const nicknameValues = event.target.value.split(';').filter(name => name !== '');
        setNicknames(nicknameValues);
    }

    const handleChangeHandedness = val => {
        setHandedness(val);
    }

    const handleChangeGender = val => {
        setGender(val);
    }

    const handleChangeRoles = val => {
        setRoles(val);
    }

    const handleChangeContactType = val => {
        console.log("Change Contact Type", val);
        setContactType(val);
    };

    const handleChangeContactInfo = event => {
        const info = event.target.value;
        setContactInfo(info);
    }

    const handleChangePhoneNumber = event => {
        const phoneNumber = event.target.value;
        setContactInfo(phoneNumber);
    }

    const handleNewAffiliationButton = event => {
        if (newAffiliation !== "" && !affiliations.includes(newAffiliation))
            setAffiliations(prev => [...prev, newAffiliation]);
        setNewAffiliation("");
    }

    // remove an affiliation if it is clicked
    const handleAffiliationButton = event => {
        const affiliationToRemove = event.target.dataset.value;
        console.log("Remove Affiliation:", affiliationToRemove);
        setAffiliations(prev => prev.filter(item => item !== affiliationToRemove));
    }

    const handleChangeNotes = event => {
        const notesInput = event.target.value;
        setNotes(notesInput);
    }

    const handleSaveButton = event => {
        event.preventDefault();

        const player = makePlayerFromForm();

        onSave(player);
        resetFormFields();
    }

    const handleDeleteButton = event => {
        event.preventDefault();

        onDelete(player);
    }

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
    }

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
    }

    const renderNameFields = () => (
        <>
            <Form.Group as={Row} className={nickChecked ? "mb-1" : "mb-3"}>
                <Form.Label column="true" sm={2}>
                    Name
                </Form.Label>
                <Col sm={4}>
                    <Form.Control placeholder="First" value={firstName} onChange={handleChangeFirstName} />
                </Col>
                <Col sm={4}>
                    <Form.Control placeholder="Last" value={lastName} onChange={handleChangeLastName} />
                </Col>
                <Col>
                    <ToggleButton
                        className=""
                        id="toggle-check-nick"
                        type="checkbox"
                        variant={FORM_VARIANT_TOGGLE}
                        checked={nickChecked}
                        value="1"
                        onChange={(e) => setNickChecked(e.currentTarget.checked)}
                    >
                        ...
                    </ToggleButton>
                </Col>
            </Form.Group>
            {nickChecked && /* TODO: Use CSS instead to add a transition to the Nickname form group */
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    Nickname(s)
                </Form.Label>
                <Col sm={"10"}>
                    <Form.Control placeholder="For multiple nicknames, separate with ;" value={nicknames.join(';')} onChange={handleChangeNickname} />
                </Col>
            </Form.Group>}
        </>
    );

    const renderGenderField = () => (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column="true" sm={2}>
                Sex
            </Form.Label>
            <Col sm={10}>
                <ToggleButtonGroup column="true" type="radio" name="gender" value={gender} onChange={handleChangeGender}>
                    <ToggleButton id="tbg-radio-male" variant={FORM_VARIANT} value={"M"}>
                        Male
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-female" variant={FORM_VARIANT} value={"F"}>
                        Female
                    </ToggleButton>
                </ToggleButtonGroup>
            </Col>
        </Form.Group>
    );

    const renderHandednessField = () => (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column="true" sm={2}>
                Handedness
            </Form.Label>
            <Col sm={10}>
                <ToggleButtonGroup column="true" type="radio" name="handedness" value={handedness} onChange={handleChangeHandedness}>
                    <ToggleButton id="tbg-radio-left" variant={FORM_VARIANT} value={"Left"}>
                        Left
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-right" variant={FORM_VARIANT} value={"Right"}>
                        Right
                    </ToggleButton>
                </ToggleButtonGroup>
            </Col>
        </Form.Group>
    );

    const renderRolesField = () => (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column="true" sm={2}>
                Roles
            </Form.Label>
            <Col sm={10}>
                <ToggleButtonGroup type="checkbox" value={roles} onChange={handleChangeRoles}>
                    <ToggleButton id="tbg-check-pin" variant={FORM_VARIANT} value={"Pin"}>
                        Pin
                    </ToggleButton>
                    <ToggleButton id="tbg-check-middle" variant={FORM_VARIANT} value={"Middle"}>
                        Middle
                    </ToggleButton>
                    <ToggleButton id="tbg-check-libero" variant={FORM_VARIANT} value={"Libero"}>
                        Libero
                    </ToggleButton>
                    <ToggleButton id="tbg-check-setter" variant={FORM_VARIANT} value={"Setter"}>
                        Setter
                    </ToggleButton>
                </ToggleButtonGroup>
            </Col>
        </Form.Group>
    );

    const renderContactFields = () => (
        <>
            <Form.Group as={Row} className={CONTACT_TYPES_WITH_INFO.includes(contactType) ? "mb-2" : "mb-3"}>
                <Form.Label column="true" sm={2}>
                    Contact
                </Form.Label>
                <Col sm={10}>
                    <ToggleButtonGroup column="true" type="radio" name="contact-type" value={contactType} onChange={handleChangeContactType}>
                        <ToggleButton id="tbg-radio-phone" variant={FORM_VARIANT} value={"Phone"}>
                            Phone
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-facebook" variant={FORM_VARIANT} value={"Facebook"}>
                            Facebook
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-groupme" variant={FORM_VARIANT} value={"GroupMe"}>
                            GroupMe
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-add" variant={FORM_VARIANT} value={"Add"}>
                            Add
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-other" variant={FORM_VARIANT} value={""}>
                            &#60;&#62;
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
            </Form.Group>
            {CONTACT_TYPES_WITH_INFO.includes(contactType) &&
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    {contactType}
                </Form.Label>
                {contactType === "Phone" ?
                    <Col sm={10}>
                        <Form.Control placeholder="Phone Number" value={contactInfo} onChange={handleChangePhoneNumber} />
                    </Col> :
                contactType === "Add" ?
                    <Col sm={10}>
                        <Form.Control placeholder="Source (name of contact)" value={contactInfo} onChange={handleChangeContactInfo} />
                    </Col> :
                // contactType - other
                    <Col sm={10}>
                        <Form.Control placeholder="Details" value={contactInfo} onChange={handleChangeContactInfo} />
                    </Col>
                }
            </Form.Group>}
        </>
    );

    const renderAffiliationFields = () => (
        <div>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Add Affiliation"
                    aria-label="Add New Affiliation"
                    aria-describedby="basic-addon2"
                    value={newAffiliation}
                    onChange={e => setNewAffiliation(e.target.value)}
                />
                <Button variant={FORM_VARIANT_TOGGLE} id="button-addon2" onClick={handleNewAffiliationButton}>
                    +
                </Button>
            </InputGroup>
            {affiliations.map(affiliationName => (
                <span key={affiliationName}>
                    <Button variant={FORM_VARIANT_TAG} data-value={affiliationName} onClick={handleAffiliationButton}>
                        {affiliationName}
                    </Button>{' '}
                </span>
            ))}
        </div>
    );

    const renderSkillsFields = () => (
        <>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    Skills
                </Form.Label>
                <Col>
                    <ToggleButton
                        className=""
                        id="toggle-check-skills"
                        type="checkbox"
                        variant={FORM_VARIANT_TOGGLE}
                        checked={formState.skillsChecked}
                        value="1"
                        onChange={(e) => formState.setSkillsChecked(e.currentTarget.checked)}
                    >
                        {formState.skillsChecked ? "Hide" : "Show"}
                    </ToggleButton>
                </Col>
            </Form.Group>
            {formState.skillsChecked && (USE_SKILL_SLIDERS ? (SKILL_TYPES.map(skillType => (
                <Form.Group key={skillType} as={Row} className="mb-3">
                    <Col sm={1} />
                    <Form.Label column="true" sm={2}>
                        {skillType}
                    </Form.Label>
                    <Col sm={6}>
                        <RangeSlider
                            variant={FORM_VARIANT}
                            value={skills[skillType.toLowerCase()] || 0}
                            onChange={e => setSkills(skills => ({
                                ...skills,
                                [skillType.toLowerCase()]: parseInt(e.target.value)
                            }))}
                            min={0}
                            max={10}
                        />
                    </Col>
                    <Col sm={2}>
                        <Form.Control
                            className="text-center"
                            placeholder="Value"
                            type="number"
                            value={skills[skillType.toLowerCase()] || ""}
                            onChange={e => setSkills(skills => ({
                                ...skills,
                                [skillType.toLowerCase()]: e.target.value <= 10 && e.target.value >= 0 ? parseInt(e.target.value) : skills[skillType.toLowerCase()]
                            }))}
                            min="0"
                            max="10"
                        />
                    </Col>
                </Form.Group>
            ))) : (SKILL_TYPES.map(skillType => (
                <Form.Group key={skillType} as={Row} className="mb-3">
                    <Col sm={1} />
                    <Form.Label column="true" sm={2}>
                        {skillType}
                    </Form.Label>
                    <Col sm={8}>
                        <ToggleButtonGroup type="radio" name={`skill-value-${skillType}`}
                            value={skills[skillType.toLowerCase()] || 0}
                            onChange={val => setSkills(skills => ({
                                ...skills,
                                [skillType.toLowerCase()]: parseInt(val)
                        }))}>
                            {[...Array(11).keys()].map(num => (
                                <ToggleButton key={num} id={`tbg-radio-${skillType}-${num}`} variant={FORM_VARIANT} value={num}>
                                    {num}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Col>
                </Form.Group>
            ))))}
        </>
    );

    const renderNotesField = () => (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column="true" sm={2}>
                Notes
            </Form.Label>
            <Col sm={10}>
                <Form.Control placeholder="Miscellaneous Notes" value={notes} onChange={handleChangeNotes} />
            </Col>
        </Form.Group>
    );

    return (
        <>
            <Form id="react-bootstrap-forms-test" className="pt-3 pb-3">
                {renderNameFields()}
                <hr />
                {renderGenderField()}
                {renderHandednessField()}
                {renderRolesField()}
                <hr />
                {renderContactFields()}
                <hr />
                {renderAffiliationFields()}
                <hr />
                {renderSkillsFields()}
                <hr />
                {renderNotesField()}
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