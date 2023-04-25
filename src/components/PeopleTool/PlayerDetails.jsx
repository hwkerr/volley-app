import { useState, useEffect } from "react";
import { newPlayerObj } from "./players";
import PlayerForm from "./PlayerForm";

import Form from 'react-bootstrap/Form';
import InputGroup from "react-bootstrap/InputGroup";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import RangeSlider from 'react-bootstrap-range-slider';

export const CONTACT_TYPES_WITH_INFO = ["Phone", "Add", ""];
export const SKILL_TYPES = ["Setting", "Hitting", "Defense", "Blocking", "Chemistry", "Leadership"];
export const USE_SKILL_SLIDERS = true;

const FORM_VARIANT = "primary";
const FORM_VARIANT_TAG = "secondary";
const FORM_VARIANT_TOGGLE = "outline-light";

export default function PlayerDetails({ player, onSave, onDelete }) {
    const [loaded, setLoaded] = useState(true);
    const [editMode, setEditMode] = useState(player === newPlayerObj);

    const [skillsChecked, setSkillsChecked] = useState(false);

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
    
    const renderNameFields = () => (
        <>
            <Form.Group as={Row} className={player.name.nicks ? "mb-1" : "mb-3"}>
                <Form.Label column="true" sm={2}>
                    Name
                </Form.Label>
                <Col sm={4}>
                    <Form.Control placeholder="First" value={player.name.first} disabled />
                </Col>
                <Col sm={4}>
                    <Form.Control placeholder="Last" value={player.name.last} disabled />
                </Col>
            </Form.Group>
            {player.name.nicks && /* TODO: Use CSS instead to add a transition to the Nickname form group */
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    Nickname(s)
                </Form.Label>
                <Col sm={"10"}>
                    <Form.Control placeholder="For multiple nicknames, separate with ;" value={player.name.nicks.join(';')} disabled />
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
                <ToggleButtonGroup column="true" type="radio" name="gender" value={player.gender}>
                    <ToggleButton id="tbg-radio-male" variant={FORM_VARIANT} value={"M"} disabled>
                        Male
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-female" variant={FORM_VARIANT} value={"F"} disabled>
                        Female
                    </ToggleButton>
                </ToggleButtonGroup>
            </Col>
        </Form.Group>
    );

    const renderHandednessField = () => (
        <>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    Handedness
                </Form.Label>
                <Col sm={10}>
                    <ToggleButtonGroup column="true" type="radio" name="handedness" value={player.handedness}>
                        <ToggleButton id="tbg-radio-left" variant={FORM_VARIANT} value={"Left"} disabled>
                            Left
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-right" variant={FORM_VARIANT} value={"Right"} disabled>
                            Right
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
            </Form.Group>
        </>
    );

    const renderRolesField = () => (
        <>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    Roles
                </Form.Label>
                <Col sm={10}>
                    <ToggleButtonGroup type="checkbox" value={player.roles}>
                        <ToggleButton id="tbg-check-pin" variant={FORM_VARIANT} value={"Pin"} disabled>
                            Pin
                        </ToggleButton>
                        <ToggleButton id="tbg-check-middle" variant={FORM_VARIANT} value={"Middle"} disabled>
                            Middle
                        </ToggleButton>
                        <ToggleButton id="tbg-check-libero" variant={FORM_VARIANT} value={"Libero"} disabled>
                            Libero
                        </ToggleButton>
                        <ToggleButton id="tbg-check-setter" variant={FORM_VARIANT} value={"Setter"} disabled>
                            Setter
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
            </Form.Group>
        </>
    );

    const renderContactFields = () => (
        <>
            <Form.Group as={Row} className={CONTACT_TYPES_WITH_INFO.includes(player.contact.type) ? "mb-2" : "mb-3"}>
                <Form.Label column="true" sm={2}>
                    Contact
                </Form.Label>
                <Col sm={10}>
                    <ToggleButtonGroup column="true" type="radio" name="contact-type" value={player.contact.type}>
                        <ToggleButton id="tbg-radio-phone" variant={FORM_VARIANT} value={"Phone"} disabled>
                            Phone
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-facebook" variant={FORM_VARIANT} value={"Facebook"} disabled>
                            Facebook
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-groupme" variant={FORM_VARIANT} value={"GroupMe"} disabled>
                            GroupMe
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-add" variant={FORM_VARIANT} value={"Add"} disabled>
                            Add
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-other" variant={FORM_VARIANT} value={""} disabled>
                            &#60;&#62;
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
            </Form.Group>
            {CONTACT_TYPES_WITH_INFO.includes(player.contact.type) &&
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    {player.contact.type}
                </Form.Label>
                {player.contact.type === "Phone" ?
                    <Col sm={10}>
                        <Form.Control value={player.contact.info} disabled />
                    </Col> :
                    player.contact.type === "Add" ?
                    <Col sm={10}>
                        <Form.Control value={player.contact.info} disabled />
                    </Col> :
                // player.contact.type - other
                    <Col sm={10}>
                        <Form.Control value={player.contact.info} disabled />
                    </Col>
                }
            </Form.Group>}
        </>
    );

    const renderAffiliationField = () => (
        <div>
            {player.affiliation.map(affiliationName => (
                <span key={affiliationName}>
                    <Button variant={FORM_VARIANT_TAG} data-value={affiliationName} disabled>
                        {affiliationName}
                    </Button>{' '}
                </span>
            ))}
        </div>
    );

    const renderSkillFields = () => (
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
                        checked={skillsChecked}
                        value="1"
                        onChange={(e) => setSkillsChecked(e.currentTarget.checked)}
                    >
                        {skillsChecked ? "Hide" : "Show"}
                    </ToggleButton>
                </Col>
            </Form.Group>
            {skillsChecked && (USE_SKILL_SLIDERS ? (SKILL_TYPES.map(skillType => (
                <Form.Group key={skillType} as={Row} className="mb-3">
                    <Col sm={1} />
                    <Form.Label column="true" sm={2}>
                        {skillType}
                    </Form.Label>
                    <Col sm={6}>
                        <RangeSlider
                            variant={FORM_VARIANT}
                            value={player.skills[skillType.toLowerCase()] || 0}
                            min={0}
                            max={10}
                            disabled
                        />
                    </Col>
                    <Col sm={2}>
                        <Form.Control
                            className="text-center"
                            placeholder="Value"
                            type="number"
                            value={player.skills[skillType.toLowerCase()] || ""}
                            min={0}
                            max={10}
                            disabled
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
                            value={player.skills[skillType.toLowerCase()] || 0}
                        >
                            {[...Array(11).keys()].map(num => (
                                <ToggleButton key={num} id={`tbg-radio-${skillType}-${num}`} variant={FORM_VARIANT} value={num} disabled>
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
                <Form.Control placeholder="Miscellaneous Notes" value={player.notes} disabled />
            </Col>
        </Form.Group>
    );

    const getDetails = (player) => {
        return (
            <Form id="react-bootstrap-forms-player" className="pt-3 pb-3">
                {renderNameFields()}
                <hr />
                {renderGenderField()}
                {renderHandednessField()}
                {renderRolesField()}
                <hr />
                {renderContactFields()}
                <hr />
                {renderAffiliationField()}
                <hr />
                {renderSkillFields()}
                <hr />
                {renderNotesField()}
                <hr />
                <div className="d-grid gap-2">
                    <Button variant="warning" size="lg" onClick={handleEdit}>Edit</Button>
                </div>
            </Form>
        );
    };

    const getFormState = () => ({
        skillsChecked: skillsChecked,
        setSkillsChecked: setSkillsChecked
    });

    return (
        <div className="container" style={{backgroundColor: "#888888"}}>
            {loaded ? (
                    editMode ?
                    <PlayerForm player={player} formState={getFormState()} onSave={handleSave} onEdit={handleEdit} onDelete={handleDelete} /> :
                    getDetails(player)
                ) :
                (
                    <p>...</p>
                )
            }
        </div>
    );
}