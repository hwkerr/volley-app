import { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Row, Col, Button } from 'react-bootstrap';
import EventDetails from './EventDetails';

const BASE_URL_EVENTS = `https://9v2zi6tk3k.execute-api.us-east-2.amazonaws.com/dev/events`;

export default function EventTool() {
    const [events, setEvents] = useState([]); // stores a list of all event objects
    const [selection, setSelection] = useState(null); // stores an eventId

    useEffect(() => {
        getFromDatabase("all")
        .then(res => {
            console.log(`Found ${res.data.Count} item(s) in database`);
            setEvents(res.data.Items);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    const getSelectedEvent = () => events.find(e => e.id = selection);

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
            <h3 className="Center">Event Tool</h3>
            {!selection ?
                <div className="container scroll">
                    {events.map((event, i) => getItem(event, i))}
                </div> :
                <div className="container scroll">
                    <EventDetails event={getSelectedEvent()} />
                    <div className="d-grid gap-2">
                        <div className="btn-group">
                            <Button variant="secondary" size="lg" type="button" onClick={clearSelection}>Cancel</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}