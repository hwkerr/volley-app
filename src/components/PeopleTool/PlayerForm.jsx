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

import { newPlayer, newPlayerObj } from "./players";

const USE_SKILL_SLIDERS = true;

export default function PlayerForm({ player, onSave, onDelete }) {
    const [firstName, setFirstName] = useState(player.name.first);
    const [lastName, setLastName] = useState(player.name.last);
    const [gender, setGender] = useState(player.gender);
    const [handedness, setHandedness] = useState(player.handedness);
    const [roles, setRoles] = useState(player.roles);
    const [skills, setSkills] = useState(player.skills);
    const [contactType, setContactType] = useState(player.contact.type);
    const [contactInfo, setContactInfo] = useState(player.contact.info);
    const [newAffiliation, setNewAffiliation] = useState("");
    const [affiliations, setAffiliations] = useState([]);
    const [notes, setNotes] = useState("");

    const [contact, setContact] = useState(player.contact);
    const [nickChecked, setNickChecked] = useState(false);
    const [skillsChecked, setSkillsChecked] = useState(false);

    const contactTypesWithInfo = ["Phone", "Add", ""];
    const skillTypes = ["Setting", "Hitting", "Defense", "Blocking", "Chemistry", "Leadership"];

    const handleChangeFirstName = event => {
        const firstName = event.target.value;
        console.log(firstName);
        setFirstName(firstName);
    }

    const handleChangeLastName = event => {
        const lastName = event.target.value;
        console.log(lastName);
        setLastName(lastName);
    }

    const handleNickChecked = event => {
        const checked = event.currentTarget.checked;
        setNickChecked(checked);
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
        console.log("Change Contact Info", info);
        setContactInfo(info);
    }

    const handleChangePhoneNumber = event => {
        const phoneNumber = event.target.value;
        console.log("Change Phone Number", phoneNumber);
        setContactInfo(phoneNumber);
    }

    const handleNewAffiliationButton = event => {
        console.log("Add New Affiliation:", newAffiliation);
        if (!affiliations.includes(newAffiliation))
            setAffiliations(prev => [...prev, newAffiliation]);
        setNewAffiliation("");
    }

    // remove an affiliation if it is clicked
    const handleAffiliationButton = event => {
        const affiliationToRemove = event.target.dataset.value;
        console.log("Remove Affiliation:", affiliationToRemove);
        setAffiliations(prev => prev.filter(item => item !== affiliationToRemove));
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
        let id = (player.id === newPlayerObj.id ? undefined : player.id);
        let mySkills = {};
        skillTypes.forEach(skillType => {
            mySkills[skillType.toLowerCase()] = skills[skillType.toLowerCase()];
        });

        const p = {
            id: firstName + " " + lastName,
            gender: gender,
            handedness: handedness,
            name: {
                first: firstName,
                last: lastName
            },
            roles: roles,
            skills: mySkills,
            contact: {
                type: contactType,
                info: contactInfo
            },
            affiliation: affiliations,
            notes: notes
        };

        return p;
    }

    const resetFormFields = () => {
        setFirstName("");
        setLastName("");
        setNickChecked(false);
        setSkillsChecked(false);
        setGender(null);
        setHandedness(null);
        setRoles([]);
        setSkills({});
        setContact("");
    }

    return (
        <>
            <Form id="react-bootstrap-forms-test" className="pt-3 pb-3">
                <Form.Group as={Row} className={nickChecked ? "" : "mb-3"}>
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
                            className="mb-2"
                            id="toggle-check-nick"
                            type="checkbox"
                            variant="outline-light"
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
                        <Form.Control placeholder="For multiple nicknames, separate with ;" />
                    </Col>
                </Form.Group>}
                <hr />
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column="true" sm={2}>
                        Sex
                    </Form.Label>
                    <Col sm={10}>
                        <ToggleButtonGroup column="true" type="radio" name="gender" value={gender} onChange={handleChangeGender}>
                            <ToggleButton id="tbg-radio-male" value={"M"}>
                                Male
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-female" value={"F"}>
                                Female
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column="true" sm={2}>
                        Handedness
                    </Form.Label>
                    <Col sm={10}>
                        <ToggleButtonGroup column="true" type="radio" name="handedness" value={handedness} onChange={handleChangeHandedness}>
                            <ToggleButton id="tbg-radio-left" value={"Left"}>
                                Left
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-right" value={"Right"}>
                                Right
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column="true" sm={2}>
                        Roles
                    </Form.Label>
                    <Col sm={10}>
                        <ToggleButtonGroup type="checkbox" value={roles} onChange={handleChangeRoles}>
                            <ToggleButton id="tbg-check-pin" value={"Pin"}>
                                Pin
                            </ToggleButton>
                            <ToggleButton id="tbg-check-middle" value={"Middle"}>
                                Middle
                            </ToggleButton>
                            <ToggleButton id="tbg-check-libero" value={"Libero"}>
                                Libero
                            </ToggleButton>
                            <ToggleButton id="tbg-check-setter" value={"Setter"}>
                                Setter
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Form.Group>
                <hr />
                <Form.Group as={Row} className={contactTypesWithInfo.includes(contactType) ? "mb-2" : "mb-3"}>
                    <Form.Label column="true" sm={2}>
                        Contact
                    </Form.Label>
                    <Col sm={10}>
                        <ToggleButtonGroup column="true" type="radio" name="contact-type" value={contactType} onChange={handleChangeContactType}>
                            <ToggleButton id="tbg-radio-phone" value={"Phone"}>
                                Phone
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-facebook" value={"Facebook"}>
                                Facebook
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-groupme" value={"GroupMe"}>
                                GroupMe
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-add" value={"Add"}>
                                Add
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-other" value={""}>
                                &#60;&#62;
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Form.Group>
                {contactTypesWithInfo.includes(contactType) &&
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column="true" sm={2}>
                        {contactType}
                    </Form.Label>
                    {contactType === "Phone" ?
                        <Col sm={10}>
                            <Form.Control value={contactInfo} onChange={handleChangePhoneNumber} />
                        </Col> :
                    contactType === "Add" ?
                        <Col sm={10}>
                            <Form.Control value={contactInfo} onChange={handleChangeContactInfo} />
                        </Col> :
                    // contactType - other
                        <Col sm={10}>
                            <Form.Control value={contactInfo} onChange={handleChangeContactInfo} />
                        </Col>
                    }
                </Form.Group>}
                <hr />
                <div>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Add Affiliation"
                            aria-label="Add New Affiliation"
                            aria-describedby="basic-addon2"
                            value={newAffiliation}
                            onChange={e => setNewAffiliation(e.target.value)}
                        />
                        <Button variant="outline-light" id="button-addon2" onClick={handleNewAffiliationButton}>+</Button>
                    </InputGroup>
                    {affiliations.map(affiliationName => (
                        <span key={affiliationName}>
                            <Button variant="secondary" data-value={affiliationName} onClick={handleAffiliationButton}>
                                {affiliationName}
                            </Button>{' '}
                        </span>
                    ))}
                </div>
                <hr />
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column="true" sm={2}>
                        Skills
                    </Form.Label>
                    <Col>
                        <ToggleButton
                            className="mb-2"
                            id="toggle-check-skills"
                            type="checkbox"
                            variant="outline-light"
                            checked={skillsChecked}
                            value="1"
                            onChange={(e) => setSkillsChecked(e.currentTarget.checked)}
                        >
                            {skillsChecked ? "Hide" : "Show"}
                        </ToggleButton>
                    </Col>
                </Form.Group>
                {skillsChecked && (USE_SKILL_SLIDERS ? (skillTypes.map(skillType => (
                    <Form.Group key={skillType} as={Row} className="mb-3">
                        <Col sm={1} />
                        <Form.Label column="true" sm={2}>
                            {skillType}
                        </Form.Label>
                        <Col sm={6}>
                            <RangeSlider
                                value={skills[skillType.toLowerCase()] || 0}
                                onChange={e => setSkills(skills => ({
                                    ...skills,
                                    [skillType.toLowerCase()]: e.target.value
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
                                    [skillType.toLowerCase()]: e.target.value
                                }))}
                                min={0}
                                max={10}
                            />
                        </Col>
                    </Form.Group>
                ))) : (
                    skillTypes.map(skillType => (
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
                                    [skillType.toLowerCase()]: val
                            }))}>
                                {[...Array(11).keys()].map(num => (
                                    <ToggleButton key={num} id={`tbg-radio-${skillType}-${num}`} value={num}>
                                        {num}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Col>
                    </Form.Group>
                ))))}
                <hr />
                <div className="d-grid gap-2">
                    <Button variant="primary" size="lg" type="submit" onClick={handleSaveButton}>Done</Button>
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