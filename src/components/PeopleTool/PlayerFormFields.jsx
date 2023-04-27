import Form from 'react-bootstrap/Form';
import InputGroup from "react-bootstrap/InputGroup";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import RangeSlider from 'react-bootstrap-range-slider';

export const CONTACT_TYPES_WITH_INFO = ["Phone", "Add", ""],
            SKILL_TYPES = ["Setting", "Hitting", "Defense", "Blocking", "Chemistry", "Leadership"],
            USE_SKILL_SLIDERS = true;

export const FORM_VARIANT = {
    MAIN: "primary",
    TAG: "secondary",
    TOGGLE: "outline-light"
};

export const EDITABLE_FORM_VARIANT = {
    MAIN: "danger",
    TAG: "info",
    TOGGLE: "outline-light"
};

const PlayerForm = {
    Static: {
        Names: ({ name }) => (
            <>
                <Form.Group as={Row} className={name.nicks ? "mb-1" : "mb-3"}>
                    <Form.Label column="true" sm={2}>
                        Name
                    </Form.Label>
                    <Col sm={4}>
                        <Form.Control placeholder="First" value={name.first} disabled />
                    </Col>
                    <Col sm={4}>
                        <Form.Control placeholder="Last" value={name.last} disabled />
                    </Col>
                </Form.Group>
                {name.nicks && name.nicks.length > 0 && /* TODO: Use CSS instead to add a transition to the Nickname form group */
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column="true" sm={2}>
                        Nickname(s)
                    </Form.Label>
                    <Col sm={"10"}>
                        <Form.Control placeholder="For multiple nicknames, separate with ;" value={name.nicks.join(';')} disabled />
                    </Col>
                </Form.Group>}
            </>
        ),
        Gender: ({ gender }) => (
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    Sex
                </Form.Label>
                <Col sm={10}>
                    <ToggleButtonGroup column="true" type="radio" name="gender" value={gender}>
                        <ToggleButton id="tbg-radio-male" variant={FORM_VARIANT.MAIN} value={"M"} disabled>
                            Male
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-female" variant={FORM_VARIANT.MAIN} value={"F"} disabled>
                            Female
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
            </Form.Group>
        ),
        Handedness: ({ handedness }) => (
            <>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column="true" sm={2}>
                        Handedness
                    </Form.Label>
                    <Col sm={10}>
                        <ToggleButtonGroup column="true" type="radio" name="handedness" value={handedness}>
                            <ToggleButton id="tbg-radio-left" variant={FORM_VARIANT.MAIN} value={"Left"} disabled>
                                Left
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-right" variant={FORM_VARIANT.MAIN} value={"Right"} disabled>
                                Right
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Form.Group>
            </>
        ),
        Roles: ({ roles }) => (
            <>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column="true" sm={2}>
                        Roles
                    </Form.Label>
                    <Col sm={10}>
                        <ToggleButtonGroup type="checkbox" value={roles}>
                            <ToggleButton id="tbg-check-pin" variant={FORM_VARIANT.MAIN} value={"Pin"} disabled>
                                Pin
                            </ToggleButton>
                            <ToggleButton id="tbg-check-middle" variant={FORM_VARIANT.MAIN} value={"Middle"} disabled>
                                Middle
                            </ToggleButton>
                            <ToggleButton id="tbg-check-libero" variant={FORM_VARIANT.MAIN} value={"Libero"} disabled>
                                Libero
                            </ToggleButton>
                            <ToggleButton id="tbg-check-setter" variant={FORM_VARIANT.MAIN} value={"Setter"} disabled>
                                Setter
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Form.Group>
            </>
        ),
        Contact: ({ contact }) => (
            <>
                <Form.Group as={Row} className={CONTACT_TYPES_WITH_INFO.includes(contact.type) ? "mb-2" : "mb-3"}>
                    <Form.Label column="true" sm={2}>
                        Contact
                    </Form.Label>
                    <Col sm={10}>
                        <ToggleButtonGroup column="true" type="radio" name="contact-type" value={contact.type}>
                            <ToggleButton id="tbg-radio-phone" variant={FORM_VARIANT.MAIN} value={"Phone"} disabled>
                                Phone
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-facebook" variant={FORM_VARIANT.MAIN} value={"Facebook"} disabled>
                                Facebook
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-groupme" variant={FORM_VARIANT.MAIN} value={"GroupMe"} disabled>
                                GroupMe
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-add" variant={FORM_VARIANT.MAIN} value={"Add"} disabled>
                                Add
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-other" variant={FORM_VARIANT.MAIN} value={""} disabled>
                                &#60;&#62;
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Form.Group>
                {CONTACT_TYPES_WITH_INFO.includes(contact.type) &&
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column="true" sm={2}>
                        {contact.type}
                    </Form.Label>
                    {contact.type === "Phone" ?
                        <Col sm={10}>
                            <Form.Control value={contact.info} disabled />
                        </Col> :
                        contact.type === "Add" ?
                        <Col sm={10}>
                            <Form.Control value={contact.info} disabled />
                        </Col> :
                    // contact.type - other
                        <Col sm={10}>
                            <Form.Control value={contact.info} disabled />
                        </Col>
                    }
                </Form.Group>}
            </>
        ),
        Affiliation: ({ affiliation }) => (
            <div>
                {affiliation.map(affiliationName => (
                    <span key={affiliationName}>
                        <Button variant={FORM_VARIANT.TAG} data-value={affiliationName} disabled>
                            {affiliationName}
                        </Button>{' '}
                    </span>
                ))}
            </div>
        ),
        Skills: ({ skills, skillsChecked, onSkillsChecked }) => (
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
                            variant={FORM_VARIANT.TOGGLE}
                            checked={skillsChecked}
                            value="1"
                            onChange={e => onSkillsChecked(e.currentTarget.checked)}
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
                                variant={FORM_VARIANT.MAIN}
                                value={skills[skillType.toLowerCase()] || 0}
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
                                value={skills[skillType.toLowerCase()] || ""}
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
                                value={skills[skillType.toLowerCase()] || 0}
                            >
                                {[...Array(11).keys()].map(num => (
                                    <ToggleButton key={num} id={`tbg-radio-${skillType}-${num}`} variant={FORM_VARIANT.MAIN} value={num} disabled>
                                        {num}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Col>
                    </Form.Group>
                ))))}
            </>
        ),
        Notes: ({ notes }) => (
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    Notes
                </Form.Label>
                <Col sm={10}>
                    <Form.Control placeholder="Miscellaneous Notes" value={notes} disabled />
                </Col>
            </Form.Group>
        )
    },
    Editable: {
        Names: ({ firstName, lastName, nicknames, nickChecked, onChangeFirstName, onChangeLastName, onChangeNicknames, onNickChecked }) => (
            <>
                <Form.Group as={Row} className={nickChecked ? "mb-1" : "mb-3"}>
                    <Form.Label column="true" sm={2}>
                        Name
                    </Form.Label>
                    <Col sm={4}>
                        <Form.Control placeholder="First" value={firstName} onChange={onChangeFirstName} />
                    </Col>
                    <Col sm={4}>
                        <Form.Control placeholder="Last" value={lastName} onChange={onChangeLastName} />
                    </Col>
                    <Col>
                        <ToggleButton
                            className=""
                            id="toggle-check-nick"
                            type="checkbox"
                            variant={EDITABLE_FORM_VARIANT.TOGGLE}
                            checked={nickChecked}
                            value="1"
                            onChange={onNickChecked}
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
                        <Form.Control placeholder="For multiple nicknames, separate with ;" value={nicknames.join(';')} onChange={onChangeNicknames} />
                    </Col>
                </Form.Group>}
            </>
        ),
        Gender: ({ gender, onChangeGender }) => (
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    Sex
                </Form.Label>
                <Col sm={10}>
                    <ToggleButtonGroup column="true" type="radio" name="gender" value={gender} onChange={onChangeGender}>
                        <ToggleButton id="tbg-radio-male" variant={EDITABLE_FORM_VARIANT.MAIN} value={"M"}>
                            Male
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-female" variant={EDITABLE_FORM_VARIANT.MAIN} value={"F"}>
                            Female
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
            </Form.Group>
        ),
        Handedness: ({ handedness, onChangeHandedness }) => (
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    Handedness
                </Form.Label>
                <Col sm={10}>
                    <ToggleButtonGroup column="true" type="radio" name="handedness" value={handedness} onChange={onChangeHandedness}>
                        <ToggleButton id="tbg-radio-left" variant={EDITABLE_FORM_VARIANT.MAIN} value={"Left"}>
                            Left
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-right" variant={EDITABLE_FORM_VARIANT.MAIN} value={"Right"}>
                            Right
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
            </Form.Group>
        ),
        Roles: ({ roles, onChangeRoles }) => (
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    Roles
                </Form.Label>
                <Col sm={10}>
                    <ToggleButtonGroup type="checkbox" value={roles} onChange={onChangeRoles}>
                        <ToggleButton id="tbg-check-pin" variant={EDITABLE_FORM_VARIANT.MAIN} value={"Pin"}>
                            Pin
                        </ToggleButton>
                        <ToggleButton id="tbg-check-middle" variant={EDITABLE_FORM_VARIANT.MAIN} value={"Middle"}>
                            Middle
                        </ToggleButton>
                        <ToggleButton id="tbg-check-libero" variant={EDITABLE_FORM_VARIANT.MAIN} value={"Libero"}>
                            Libero
                        </ToggleButton>
                        <ToggleButton id="tbg-check-setter" variant={EDITABLE_FORM_VARIANT.MAIN} value={"Setter"}>
                            Setter
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
            </Form.Group>
        ),
        Contact: ({ contactType, contactInfo, onChangeContactType, onChangeContactInfo, onChangePhoneNumber }) => (
            <>
                <Form.Group as={Row} className={CONTACT_TYPES_WITH_INFO.includes(contactType) ? "mb-2" : "mb-3"}>
                    <Form.Label column="true" sm={2}>
                        Contact
                    </Form.Label>
                    <Col sm={10}>
                        <ToggleButtonGroup column="true" type="radio" name="contact-type" value={contactType} onChange={onChangeContactType}>
                            <ToggleButton id="tbg-radio-phone" variant={EDITABLE_FORM_VARIANT.MAIN} value={"Phone"}>
                                Phone
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-facebook" variant={EDITABLE_FORM_VARIANT.MAIN} value={"Facebook"}>
                                Facebook
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-groupme" variant={EDITABLE_FORM_VARIANT.MAIN} value={"GroupMe"}>
                                GroupMe
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-add" variant={EDITABLE_FORM_VARIANT.MAIN} value={"Add"}>
                                Add
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-other" variant={EDITABLE_FORM_VARIANT.MAIN} value={""}>
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
                            <Form.Control placeholder="Phone Number" value={contactInfo} onChange={onChangePhoneNumber} />
                        </Col> :
                    contactType === "Add" ?
                        <Col sm={10}>
                            <Form.Control placeholder="Source (name of contact)" value={contactInfo} onChange={onChangeContactInfo} />
                        </Col> :
                    // contactType - other
                        <Col sm={10}>
                            <Form.Control placeholder="Details" value={contactInfo} onChange={onChangeContactInfo} />
                        </Col>
                    }
                </Form.Group>}
            </>
        ),
        Affiliation: ({ newAffiliation, affiliations, onChangeNewAffiliation, onClickNewAffiliationButton, onClickAffiliationTag }) => (
            <div>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="Add Affiliation"
                        aria-label="Add New Affiliation"
                        aria-describedby="basic-addon2"
                        value={newAffiliation}
                        onChange={onChangeNewAffiliation}
                    />
                    <Button variant={EDITABLE_FORM_VARIANT.TOGGLE} id="button-addon2" onClick={onClickNewAffiliationButton}>
                        +
                    </Button>
                </InputGroup>
                {affiliations.map(affiliationName => (
                    <span key={affiliationName}>
                        <Button variant={EDITABLE_FORM_VARIANT.TAG} data-value={affiliationName} onClick={onClickAffiliationTag}>
                            {affiliationName}
                        </Button>{' '}
                    </span>
                ))}
            </div>
        ),
        Skills: ({ skills, setSkills, skillsChecked, setSkillsChecked }) => (
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
                            variant={EDITABLE_FORM_VARIANT.TOGGLE}
                            checked={skillsChecked}
                            value="1"
                            onChange={e => setSkillsChecked(e.currentTarget.checked)}
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
                                variant={EDITABLE_FORM_VARIANT.MAIN}
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
                                    <ToggleButton key={num} id={`tbg-radio-${skillType}-${num}`} variant={EDITABLE_FORM_VARIANT.MAIN} value={num}>
                                        {num}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Col>
                    </Form.Group>
                ))))}
            </>
        ),
        Notes: ({ notes, onChangeNotes }) => (
            <Form.Group as={Row} className="mb-3">
                <Form.Label column="true" sm={2}>
                    Notes
                </Form.Label>
                <Col sm={10}>
                    <Form.Control placeholder="Miscellaneous Notes" value={notes} onChange={onChangeNotes} />
                </Col>
            </Form.Group>
        )
    }
}

export default PlayerForm;