import { useState, useEffect } from 'react';
import moment from 'moment';
import { Alert, Spinner } from 'react-bootstrap';
import { getFilteredEventsList } from '../../search';
import EventDetails from './EventDetails';
import { getEventFromDatabase } from './eventsDB';

const TODAY = moment().format('YYYY-MM-DD');
export const NEW_EVENT = {
    id: "new",
    name: "Add New Event Name",
    date: TODAY,
    format: '',
    host: '',
    location: '',
    notes: '',
    players: []
};

export default function EventTool() {
    const [events, setEvents] = useState([]); // stores a list of all event objects
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [resultsCount, setResultsCount] = useState(0);
    const [selection, setSelection] = useState(null); // stores an eventId
    const [searchTerm, setSearchTerm] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        const newFilteredEventsList = getFilteredEventsList(events, searchTerm);
        setResultsCount(newFilteredEventsList.length);
        setFilteredEvents(newFilteredEventsList);
    }, [searchTerm, events]);

    const loadItems = () => {
        setLoaded(false);
        // TODO: only need to get Event name and id
        getEventFromDatabase("all")
        .then(res => {
            setError(null);
            console.log(`Found ${res.data.Count} item(s) in database`);
            setEvents(res.data.Items);
            setLoaded(true);
        }).catch(err => {
            const errorMessage = "Error getting event list from database";
            console.error(errorMessage, err);
            setError(errorMessage);
            setLoaded(true);
            setTimeout(() => loadItems(), 5000)
        });
    };

    const handleChangeSearchTerm = e => {
        setSearchTerm(e.target.value);
    };

    const getSelectedEvent = () => (selection === NEW_EVENT.id ? NEW_EVENT : events.find(e => e.id === selection));

    const EventKit = {
        save: event => {
            addOrUpdateEvent(event);
            setSelection(event.id);
        },
        delete: event => {
            clearSelection();
            removeEvent(event);
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
            <div key={i} className={`list-item item ${isSelected ? "selected" : ""}`} onClick={() => handleEventClicked(event)}>
                <p>{i+1}. {event.name}</p>
            </div>
        );
    };
    
    return (
        <div className="EventTool App-body">
            {!selection ? (
                <>
                    {error && <Alert className="container" variant='danger'>{error}</Alert>}
                    <h3 className="container">Events ({resultsCount})</h3>
                    <div className="container scroll">
                        {!loaded ?
                        <div className={`list-item only-item`}>
                            <Spinner className="center" animation="border" />
                        </div> :
                        <>
                            <div className={`list-item search-item`}>
                                <input placeholder="Search" value={searchTerm} onChange={handleChangeSearchTerm} />
                            </div>
                            <div className={`list-item item ${selection === NEW_EVENT.id ? "selected" : ""}`} onClick={() => handleEventClicked(NEW_EVENT)}>
                                <p>{"+ add event"}</p>
                            </div>
                            {filteredEvents.map((event, i) => getItem(event, i))}
                        </>
                        }
                        
                        
                    </div>
                </>
            ) : (
                <div className="container">
                    <EventDetails eventId={getSelectedEvent().id} onCancel={clearSelection} onSave={EventKit.save} onDelete={EventKit.delete} />
                </div>
            )}
        </div>
    );
}