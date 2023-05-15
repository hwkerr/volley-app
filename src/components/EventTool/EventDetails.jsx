import { useState } from 'react';
import EventForm from "./EventFormFields";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function EventDetails({ event, onCancel, onEdit, onCancelEdit, onSave }) {
    const [editMode, setEditMode] = useState(false);
    
    const [name, setName] = useState(event.name);
    const [date, setDate] = useState(event.date);
    const [format, setFormat] = useState(event.format);
    const [host, setHost] = useState(event.host);
    const [location, setLocation] = useState(event.location);
    const [notes, setNotes] = useState(event.notes);

    const handleEditButtonClicked = event => {
        setEditMode(true);
        if (onEdit)
            onEdit(event);
    };

    const handleCancelEditButtonClicked = event => {
        resetEvent();
        setEditMode(false);
        if (onCancelEdit)
            onCancelEdit(event);
    };

    const handleSaveButtonClicked = event => {
        setEditMode(false);
        // TODO: make object with fields from Editable form
        const newEvent = {};
        if (onSave)
            onSave(newEvent);
    };

    const resetEvent = () => {
        setName(event.name);
        setDate(event.date);
        setFormat(event.format);
        setHost(event.host);
        setLocation(event.location);
        setNotes(event.notes);
    };

    // TODO: add buttons for Edit, Save, Cancel, Delete, and connect them to the database where necessary
    return (
        <div className="container pt-3 pb-3">
            <fieldset disabled={!editMode}>
                <Form id="react-bootstrap-forms-event">
                    <EventForm.Multipurpose.Name value={name} onChange={e => setName(e.target.value)} disabled={!editMode} />
                    <EventForm.Multipurpose.Date value={date} onChange={e => setDate(e.target.value)} disabled={!editMode} />
                    <EventForm.Multipurpose.Format value={format} onChange={e => setFormat(e.target.value)} disabled={!editMode} />
                    <EventForm.Multipurpose.Host value={host} onChange={e => setHost(e.target.value)} disabled={!editMode} />
                    <EventForm.Multipurpose.Location value={location} onChange={e => setLocation(e.target.value)} disabled={!editMode} />
                    <EventForm.Multipurpose.Notes value={notes} onChange={e => setNotes(e.target.value)} disabled={!editMode} />
                </Form>
            </fieldset>
            <hr />
            {editMode ?
            <div className="d-grid gap-2">
                <div className="btn-group">
                    <Button variant="success" size="lg" type="button" onClick={handleSaveButtonClicked}>Save</Button>
                    <Button variant="secondary" size="lg" type="button" onClick={handleCancelEditButtonClicked}>Cancel</Button>
                </div>
            </div> :
            <div className="d-grid gap-2">
                <div className="btn-group">
                    <Button variant="warning" size="lg" type="button" onClick={handleEditButtonClicked}>Edit</Button>
                    <Button variant="secondary" size="lg" type="button" onClick={onCancel}>Return</Button>
                </div>
            </div>}
        </div>
    );
}