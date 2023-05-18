import { useState } from 'react';
import moment from 'moment';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import EventForm from "./EventFormFields";
import EventPlayers from './EventPlayers';
import { NEW_EVENT } from './EventTool';

const TODAY = moment().format('YYYY-MM-DD');

export default function EventDetails({ event, onCancel, onSave, onDelete }) {
    const [editMode, setEditMode] = useState(event === NEW_EVENT);
    
    const [name, setName] = useState(event.name || '');
    const [date, setDate] = useState(event.date || TODAY);
    const [format, setFormat] = useState(event.format || '');
    const [host, setHost] = useState(event.host || '');
    const [location, setLocation] = useState(event.location || '');
    const [notes, setNotes] = useState(event.notes || '');

    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleEditButtonClicked = e => {
        e.preventDefault();
        setEditMode(true);
    };

    const handleCancelEditButtonClicked = e => {
        e.preventDefault();
        if (event === NEW_EVENT)
            onCancel();
        else {
            resetEvent();
            setEditMode(false);
        }
    };

    const handleSaveButtonClicked = e => {
        e.preventDefault();
        const newEvent = makeEventFromForm();
        if (onSave) {
            setSaveLoading(true);
            onSave(newEvent)
            .finally(() => {
                setSaveLoading(false);
                setEditMode(false);
            });
        }
    };

    const handleDeleteButtonClicked = e => {
        e.preventDefault();
        if (onDelete) {
            setDeleteLoading(true);
            onDelete(event)
            .finally(() => setDeleteLoading(false));
        }
    };

    const makeEventFromForm = () => {
        let id = (event.id === NEW_EVENT.id ?
            date :
            event.id
        );

        const e = {
            id,
            name,
            date,
            format,
            host,
            location,
            notes: notes.trim()
        };

        return e;
    };

    const resetEvent = () => {
        setName(event.name);
        setDate(event.date);
        setFormat(event.format);
        setHost(event.host);
        setLocation(event.location);
        setNotes(event.notes);
    };

    const isDisabled = () => (!editMode || saveLoading || deleteLoading);

    return (
        <div className="pt-3 pb-3">
            <Row>
                <Col>
                    <fieldset disabled={isDisabled()}>
                        <Form id="react-bootstrap-forms-event">
                            <EventForm.Multipurpose.Name value={name} onChange={e => setName(e.target.value)} disabled={isDisabled()} />
                            <EventForm.Multipurpose.Date value={date} onChange={e => setDate(e.target.value)} disabled={isDisabled()} />
                            <EventForm.Multipurpose.Format value={format} onChange={e => setFormat(e.target.value)} disabled={isDisabled()} />
                            <EventForm.Multipurpose.Host value={host} onChange={e => setHost(e.target.value)} disabled={isDisabled()} />
                            <EventForm.Multipurpose.Location value={location} onChange={e => setLocation(e.target.value)} disabled={isDisabled()} />
                            <EventForm.Multipurpose.Notes value={notes} onChange={e => setNotes(e.target.value)} disabled={isDisabled()} />
                        </Form>
                    </fieldset>
                </Col>
                <Col>
                    <EventPlayers players={event.players} />
                </Col>
            </Row>
            <hr />
            {editMode ?
            <div className="d-grid gap-2">
                <div className="btn-group">
                    <Button variant="success" size="lg" type="button" onClick={handleSaveButtonClicked}>
                        {saveLoading ?
                            <Spinner 
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> : (event === NEW_EVENT ? 'Create Event' : 'Save')}
                    </Button>
                    <Button variant="secondary" size="lg" type="button" onClick={handleCancelEditButtonClicked}>Cancel</Button>
                    {event !== NEW_EVENT &&
                    <Button variant="danger" size="lg" type="button" onClick={handleDeleteButtonClicked}>
                        {deleteLoading ?
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> : 'Delete'}
                    </Button>}
                </div>
            </div> :
            <div className="d-grid gap-2">
                <div className="btn-group">
                    <Button variant="warning" size="lg" type="button" onClick={handleEditButtonClicked}>Edit</Button>
                    <Button variant="secondary" size="lg" type="button" onClick={onCancel}>Back</Button>
                </div>
            </div>}
        </div>
    );
}