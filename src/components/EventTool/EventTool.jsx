import { useState, useEffect } from 'react';
import axios from 'axios';
import EventDetails from './EventDetails';
import { Spinner } from 'react-bootstrap';

export const NEW_EVENT = {id: "new", name: "Add New Event Name"};
const BASE_URL_EVENTS = `https://9v2zi6tk3k.execute-api.us-east-2.amazonaws.com/dev/events`;

export default function EventTool() {
    const [events, setEvents] = useState([]); // stores a list of all event objects
    const [selection, setSelection] = useState(null); // stores an eventId
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        if (loaded) setLoaded(false);
        getFromDatabase("all")
        .then(res => {
            console.log(`Found ${res.data.Count} item(s) in database`);
            setEvents(res.data.Items);
            setLoaded(true);
        }).catch(err => {
            console.log(err);
            setLoaded(true);
        });
    };

    const getSelectedEvent = () => (selection === NEW_EVENT.id ? NEW_EVENT : events.find(e => e.id === selection));

    const getFromDatabase = async (id) => {
        const url = BASE_URL_EVENTS + "/" + id;
        return await axios.get(url);
    };

    const saveToDatabase = async (event) => {
        const url = BASE_URL_EVENTS;
        return await axios.post(url, event);
    };

    const deleteFromDatabase = async (id) => {
        const url = BASE_URL_EVENTS + "/" + id;
        return await axios.delete(url);
    }

    const EventKit = {
        save: async event => {
            console.log("Save event", event.id, event.name);
            try {
                const res = await saveToDatabase(event);
                console.log(res);
                addOrUpdateEvent(event); // local
                setSelection(event.id);
                return true;
            } catch (err) {
                console.error("Error:", err);
                alert("Failed to save event to database. Check console for logs");
                return false
            }
        },
        delete: async event => {
            if (!window.confirm(`Are you sure you would like to delete the event: ${event.name} ${event.name}?`)) {
                alert("Cancelled delete");
                return false;
            };
            console.log("Remove event", event.id);
            try {
                const res = await deleteFromDatabase(event.id); // database
                console.log(res);
                removeEvent(event); // local
                clearSelection();
                return true;
            } catch (err) {
                console.error("Error:", err);
                alert("Failed to delete event from database. Check console for logs");
                return false;
            }
        }
    };

    const addOrUpdateEvent = event => {
        const idToUpdate = event.id;
        let eventToUpdate = events.find(e => e.id === idToUpdate);
        if (eventToUpdate === undefined) { // doesn't exist yet -> ADD
            eventToUpdate = event;
            setEvents(prev => ([...prev, event]))
        } else { // aleady exists -> UPDATE
            for (const property in eventToUpdate) {
                eventToUpdate[property] = event[property];
            }
        }
        return eventToUpdate;
    };

    const removeEvent = event => {
        const originalSize = events.length;
        const idToRemove = event.id;
        const newEvents = events.filter(p => p.id !== idToRemove);
        setEvents(newEvents);
        return originalSize > newEvents.length; // removed any
    };

    const clearSelection = () => {
        setSelection(null);
    };
    
    const handleEventClicked = (event) => {
        console.log(event);
        if (event.id === selection)
            clearSelection();
        else {
            setSelection(event.id);
        }
    };
    
    const getItem = (event, i) => {
        const isSelected = (
            event &&
            selection === event.id
        );
        return (
            <div key={i} className={`listitem-name ${isSelected ? "selected" : ""}`} onClick={() => handleEventClicked(event)}>
                <p>{i+1}. {event.name}</p>
            </div>
        );
    };
    
    return (
        <div className="EventTool" style={{backgroundColor: "#444444"}}>
            <h3 className="center" onClick={e => console.log(selection)}>Event Tool</h3>
            {!selection ? (
                loaded ?
                    <div className="container scroll">
                        <div className={`listitem-name ${selection === NEW_EVENT.id ? "selected" : ""}`} onClick={() => handleEventClicked(NEW_EVENT)}>
                            <p>{"+ add event"}</p>
                        </div>
                        {events.map((event, i) => getItem(event, i))}
                    </div> :
                    <div className="container center">
                        <Spinner animation="border" />
                    </div>
            ) : (
                <div className="container scroll">
                    <EventDetails event={getSelectedEvent()} onCancel={clearSelection} onSave={EventKit.save} onDelete={EventKit.delete} />
                </div>
            )}
        </div>
    );
}