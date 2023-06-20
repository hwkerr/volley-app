import { useState, useEffect } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import EventForm from "./EventFormFields";
import EventPlayers from './EventPlayers';
import { NEW_EVENT } from './EventTool';
import EventTeams from './EventTeams';

import { deleteFromDatabase, getFromDatabase, saveToDatabase } from './eventsDB';

export default function EventDetails({ eventId, onCancel, onSave, onDelete }) {
    const [editMode, setEditMode] = useState(false);

    const [originalEvent, setOriginalEvent] = useState({});
    const [event, setEvent] = useState({});
    const [teamNames, setTeamNames] = useState([]);
    const [newTeamNameInput, setNewTeamNameInput] = useState('');

    const [loaded, setLoaded] = useState(false); // page loaded
    const [saveLoading, setSaveLoading] = useState(false); // in saving process
    const [deleteLoading, setDeleteLoading] = useState(false); // in deleting process


    useEffect(() => {
        if (eventId === NEW_EVENT.id)
            loadEmptyEvent();
        else
            loadEvent(eventId);
    }, [eventId]);

    const loadEvent = (id) => {
        if (loaded) setLoaded(false);
        getFromDatabase(id)
        .then(res => {
            const loadedEvent = res.data;
            console.log('Loaded Event: ', loadedEvent);
            setEvent(loadedEvent);
            setOriginalEvent(loadedEvent);
            setTeamNames([...new Set(loadedEvent.players.map(p => p.team))])
            setEditMode(loadedEvent === NEW_EVENT);
            setLoaded(true);
        }).catch(err => {
            console.error("Error while loading event - err:", err);
            setLoaded(true);
        });
    };

    const loadEmptyEvent = () => {
        if (loaded) setLoaded(false);
        setEvent(NEW_EVENT);
        setOriginalEvent(NEW_EVENT);
        setEditMode(true);
        setLoaded(true);
    };
    
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
        const newEvent = {
            ...event,
            id: (event.id === NEW_EVENT.id ? event.date : event.id)
        };
        setSaveLoading(true);
        EventKit.save(newEvent)
        .finally(() => {
            setSaveLoading(false);
            setEditMode(false);
        });
    };

    const handleDeleteButtonClicked = e => {
        e.preventDefault();
        setDeleteLoading(true);
        EventKit.delete(event)
        .finally(() => setDeleteLoading(false));
    };

    const resetEvent = () => {
        setEvent(originalEvent);
    };

    const EventKit = {
        save: async event => {
            console.log("Saving event:", event.id, event.name);
            try {
                const res = await saveToDatabase(event);
                console.log(res);
                if (onSave) onSave(event);
                return true;
            } catch (err) {
                console.error("Error while saving event - err:", err);
                alert("Failed to save event to database. Check console for logs");
                return false;
            }
        },
        delete: async event => {
            if (!window.confirm(`Are you sure you would like to delete the event: ${event.name} ${event.name}?`)) {
                alert("Cancelled delete");
                return false;
            };
            console.log("Removing event", event.id);
            try {
                const res = await deleteFromDatabase(event.id); // database
                console.log(res);
                if (onDelete) onDelete(event);
                return true;
            } catch (err) {
                console.error("Error while removing event - err:", err);
                alert("Failed to delete event from database. Check console for logs");
                return false;
            }
        }
    };

    // const EventPlayerKit = {
    //     updateStatus: (id, status) => {
    //         const playerStatus = getPlayerInEvent(id).status;
    //         const myNextStatus = nextStatus[playerStatus];
    //         // TODO: update database and do this on success
    //         if (myNextStatus === '<>') {
    //             setEventPlayers(prev => prev.filter(p => p.id !== id)); // remove player
    //         } else {
    //             setEventPlayers(prev => prev.map(p => { // update player to next status
    //                 if (p.id === id) {
    //                     return {
    //                         ...p,
    //                         status: nextStatus[playerStatus]
    //                     };
    //                 } else {
    //                     return p;
    //                 }
    //             }));
    //         }
    //     }
    // };

    const getTeams = () => {
        const teams = {};
        event.players.forEach(player => {
            if (player.team in teams) {
                teams[player.team].push(player.id);
            } else {
                teams[player.team] = [player.id];
            }
        });
        return teams;
    };

    const handleAddTeam = () => {
        setTeamNames(prev => (
            [
                ...prev,
                newTeamNameInput
            ]
        ));
        setNewTeamNameInput('');
    };

    const setPlayerTeam = (playerId, team) => {
        setEvent(prev => {
            return {
                ...prev,
                players: prev.players.map(p => {
                    if (p.id === playerId)
                        return {
                            ...p,
                            team: team
                        };
                    else return p;
                })
            };
        });
    };

    const isDisabled = () => (!editMode || saveLoading || deleteLoading);

    const setEventProp = (prop, value) => {
        setEvent(prev => ({
            ...prev,
            [prop]: value
        }));
    };

    return (
        <div className="pt-3 pb-3">
            {loaded ? <>
                <Row>
                    <Col>
                        <fieldset disabled={isDisabled()}>
                            <Form id="react-bootstrap-forms-event">
                                <EventForm.Multipurpose.Name value={event.name} onChange={e => setEventProp('name', e.target.value)} disabled={isDisabled()} />
                                <EventForm.Multipurpose.Date value={event.date} onChange={e => setEventProp('date', e.target.value)} disabled={isDisabled()} />
                                <EventForm.Multipurpose.Format value={event.format} onChange={e => setEventProp('format', e.target.value)} disabled={isDisabled()} />
                                <EventForm.Multipurpose.Host value={event.host} onChange={e => setEventProp('host', e.target.value)} disabled={isDisabled()} />
                                <EventForm.Multipurpose.Location value={event.location} onChange={e => setEventProp('location', e.target.value)} disabled={isDisabled()} />
                                <EventForm.Multipurpose.Notes value={event.notes} onChange={e => setEventProp('notes', e.target.value.trim())} disabled={isDisabled()} />
                            </Form>
                        </fieldset>
                        <div>
                            <label>New Team Name:</label>
                            <input value={newTeamNameInput} onChange={e => setNewTeamNameInput(e.target.value)} />
                            <button onClick={handleAddTeam}>Add</button>
                        </div>
                        <EventTeams teams={getTeams()} />
                    </Col>
                    <Col>
                        <EventPlayers players={event.players} teamNames={teamNames} onChangeTeam={setPlayerTeam} />
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
            </> :
            <Spinner className="center" animation="border" />}
        </div>
    );
}