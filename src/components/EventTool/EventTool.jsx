import { useState, useEffect } from 'react';
import axios from 'axios';

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

    const getFromDatabase = async (id) => {
        const url = BASE_URL_EVENTS + "/" + id;
        return await axios.get(url);
    };
    
    const handleEventClicked = (event) => {
        if (event.id === selection)
            setSelection(null);
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
            <h3 className="Center">Event Tool</h3>
            <div className="container scroll">
                {events.map((event, i) => getItem(event, i))}
            </div>
        </div>
    );
}