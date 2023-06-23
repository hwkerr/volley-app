import { useState, useEffect } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import EventForm from "./EventFormFields";
import EventPlayers, { STATUS } from './EventPlayers';
import { NEW_EVENT } from './EventTool';
import EventTeams from './EventTeams';

import { getPlayerFromDatabase } from '../PeopleTool/playersDB';
import { deleteEventFromDatabase, getEventFromDatabase, saveEventToDatabase } from './eventsDB';

export default function EventDetails({ eventId, onCancel, onSave, onDelete }) {
    const [editMode, setEditMode] = useState(false);

    const [originalEvent, setOriginalEvent] = useState({});
    const [event, setEvent] = useState({});
    const [allPlayers, setAllPlayers] = useState([]);
    const [teamNames, setTeamNames] = useState([]);
    const [newTeamNameInput, setNewTeamNameInput] = useState('');

    const [loaded, setLoaded] = useState(false); // page loaded
    const [playersLoaded, setPlayersLoaded] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false); // in saving process
    const [deleteLoading, setDeleteLoading] = useState(false); // in deleting process

    const getPlayerObject = id => allPlayers.find(p => p.id === id);

    useEffect(() => {
        if (eventId === NEW_EVENT.id)
            loadEmptyEvent();
        else
            loadEvent(eventId);
    }, [eventId]);

    const loadEvent = (id) => {
        if (loaded) setLoaded(false);
        getEventFromDatabase(id)
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

    useEffect(() => {
        if (playersLoaded) setPlayersLoaded(false);
        getPlayerFromDatabase("all")
        .then(res => {
            console.log(`Found ${res.data.Count} player(s) in database`);
            setAllPlayers(res.data.Items);
            setPlayersLoaded(true);
        }).catch(err => {
            console.error("Error while getting player list from database - err:", err);
        });
    }, []);
    
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
                const res = await saveEventToDatabase(event);
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
                const res = await deleteEventFromDatabase(event.id); // database
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

    const getTeamsMap = () => {
        const teams = {};
        event.players.forEach(player => {
            if (player.status === STATUS.OUT) return;
            const playerInfo = getPlayerObject(player.id);
            if (player.team in teams) {
                teams[player.team].push(playerInfo);
            } else {
                teams[player.team] = [playerInfo];
            }
        });
        return teams;
    };

    const addPlayerToEvent = playerToAdd => {
        setEvent(prev => ({
            ...prev,
            players: [...prev.players, playerToAdd]
        }));
    };

    const updatePlayerInEvent = (id, propsToUpdate) => {
        setEvent(prev => ({
            ...prev,
            players: prev.players.map(p => {
                if (p.id === id) return {...p, ...propsToUpdate};
                else return p;
            })
        }));
    };

    const removePlayerFromEvent = id => {
        setEvent(prev => ({
            ...prev,
            players: prev.players.filter(p => p.id !== id)
        }));
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

    const isDisabled = () => (!editMode || saveLoading || deleteLoading);

    const setEventProps = (propsToUpdate) => {
        setEvent(prev => ({
            ...prev,
            ...propsToUpdate
        }));
    };

    return (
        <div className="pt-3 pb-3">
            {loaded ? <>
                <Row>
                    <Col>
                        <fieldset disabled={isDisabled()}>
                            <Form id="react-bootstrap-forms-event">
                                <EventForm.Multipurpose.Name value={event.name} onChange={e => setEventProps({ name: e.target.value })} disabled={isDisabled()} />
                                <EventForm.Multipurpose.Date value={event.date} onChange={e => setEventProps({ date: e.target.value })} disabled={isDisabled()} />
                                <EventForm.Multipurpose.Format value={event.format} onChange={e => setEventProps({ format: e.target.value })} disabled={isDisabled()} />
                                <EventForm.Multipurpose.Host value={event.host} onChange={e => setEventProps({ host: e.target.value })} disabled={isDisabled()} />
                                <EventForm.Multipurpose.Location value={event.location} onChange={e => setEventProps({ location: e.target.value })} disabled={isDisabled()} />
                                <EventForm.Multipurpose.Notes value={event.notes} onChange={e => setEventProps({ notes: e.target.value }.trim())} disabled={isDisabled()} />
                            </Form>
                        </fieldset>
                        <div>
                            <label>New Team Name:</label>
                            <input value={newTeamNameInput} onChange={e => setNewTeamNameInput(e.target.value)} />
                            <button onClick={handleAddTeam}>Add</button>
                        </div>
                        {playersLoaded ?
                            <EventTeams teams={getTeamsMap()} /> :
                            <Spinner className="center" animation="border" />
                        }
                    </Col>
                    <Col>
                        <EventPlayers players={event.players} teamNames={teamNames} onAddPlayer={addPlayerToEvent} onUpdatePlayer={updatePlayerInEvent} onRemovePlayer={removePlayerFromEvent} />
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