import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import EventDetails from './EventDetails';
import { Spinner } from 'react-bootstrap';

const BASE_URL_EVENTS = `https://9v2zi6tk3k.execute-api.us-east-2.amazonaws.com/dev/events`;

export default function EventTool() {
    const [events, setEvents] = useState([]); // stores a list of all event objects
    const [selection, setSelection] = useState(null); // stores an eventId
    const [loaded, setLoaded] = useState(false);

    const NEW_EVENT = {id: "new", name: "Add New Event Name"};

    useEffect(() => {
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
    }, []);

    const getSelectedEvent = () => (selection === NEW_EVENT.id ? NEW_EVENT : events.find(e => e.id = selection));

    const getFromDatabase = async (id) => {
        const url = BASE_URL_EVENTS + "/" + id;
        return await axios.get(url);
    };

    const clearSelection = () => {
        setSelection(null);
    }
    
    const handleEventClicked = (event) => {
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
        <div className="EventTool" style={{backgroundColor: "#444444"}} onClick={e => console.log(selection)}>
            <h3 className="center">Event Tool</h3>
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
                    <EventDetails event={getSelectedEvent()} onCancel={clearSelection} />
                </div>
            )}
        </div>
    );
}