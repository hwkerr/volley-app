import Form from 'react-bootstrap/Form';
import InputGroup from "react-bootstrap/InputGroup";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import RangeSlider from 'react-bootstrap-range-slider';

import { FORM_VARIANT, EDITABLE_FORM_VARIANT } from '../PeopleTool/PlayerFormFields';

const EventForm = {
    Static: {
        Name: ({ name }) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Name
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="Event Name" value={name} disabled />
                </Col>
            </Form.Group>
        ),
        Date: ({ date }) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Date
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="Event Date" type="date" value={date} disabled />
                </Col>
            </Form.Group>
        ),
        Format: ({ format }) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Format
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="Event Format" value={format} disabled />
                </Col>
            </Form.Group>
        ),
        Host: ({ host }) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Host
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="Event Host" value={host} disabled />
                </Col>
            </Form.Group>
        ),
        Location: ({ location }) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Location
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="Event Location" value={location} disabled />
                </Col>
            </Form.Group>
        ),
        Notes: ({ notes }) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Notes
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="Additional Notes" value={notes} disabled />
                </Col>
            </Form.Group>
        )
    },
    Editable: {
        Name: ({value, onChange}) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Name
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="First" value={value} onChange={onChange} />
                </Col>
            </Form.Group>
        ),
        Date: ({ value, onChange }) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Date
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="Event Date" type="date" value={value} onChange={onChange} />
                </Col>
            </Form.Group>
        ),
        Format: ({ value, onChange }) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Format
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="Event Format" value={value} onChange={onChange} />
                </Col>
            </Form.Group>
        ),
        Host: ({ value, onChange }) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Host
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="Event Host" value={value} onChange={onChange} />
                </Col>
            </Form.Group>
        ),
        Location: ({ value, onChange }) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Location
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="Event Location" value={value} onChange={onChange} />
                </Col>
            </Form.Group>
        ),
        Notes: ({ value, onChange }) => (
            <Form.Group as={Row} className={"mb-3"}>
                <Form.Label column="true" sm={2}>
                    Notes
                </Form.Label>
                <Col sm={8}>
                    <Form.Control placeholder="Additional Notes" value={value} onChange={onChange} />
                </Col>
            </Form.Group>
        )
    }
};

export default EventForm;