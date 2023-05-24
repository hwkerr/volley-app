import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Col, Row, Spinner, Form } from "react-bootstrap";

import { BASE_URL_PLAYERS } from "../PeopleTool/PeopleTool";
import { getFilteredPlayersList } from "../../search";

export default function EventPlayers({ players, onUpdate }) {
    const [eventPlayers, setEventPlayers] = useState(players || []);
    const [allPlayers, setAllPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loaded, setLoaded] = useState(false);

    const playerInEvent = id => ((eventPlayers.find(p => p.id === id)) ? true : false);

    const comparePlayersByName = (a, b) => {
        const aActive = playerInEvent(a.id);
        const bActive = playerInEvent(b.id);

        if (aActive === bActive) {
            if (a.name.first && b.name.first) {
                if (a.name.first < b.name.first) return -1;
                else if (a.name.first > b.name.first) return 1;
            } else if (a.name.last && b.name.last) {
                if (a.name.last < b.name.last) return -1;
                else if (a.name.last > b.name.last) return 1;
            } else return 0;
        } else if (aActive) return -1;
        else if (bActive) return 1;
    };
    
    useEffect(() => {
        if (loaded) setLoaded(false);
        getPlayerFromDatabase("all")
        .then(res => {
            console.log(`Found ${res.data.Count} player(s) in database`);
            setAllPlayers(res.data.Items);
            setLoaded(true);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        const newFilteredPlayersList = getFilteredPlayersList(allPlayers, searchTerm);
        setFilteredPlayers(newFilteredPlayersList);
    }, [allPlayers, eventPlayers, searchTerm]);

    const handleChangeSearchTerm = e => {
        setSearchTerm(e.target.value);
    }

    const reSort = () => setAllPlayers(prev => prev.sort(comparePlayersByName));

    const getPlayerFromDatabase = async (id) => {
        const url = BASE_URL_PLAYERS + "/" + id;
        return await axios.get(url);
    };

    const addPlayerToEvent = id => {
        // TODO: update database and do this on success
        setEventPlayers(prev => {
            if (prev.find(p => p.id === id)) return prev;
            const playerToAdd = {
                id,
                status: "In",
                paid: false,
                team: null
            };
            return [
                ...prev,
                playerToAdd
            ];
        });
    };

    const removePlayerFromEvent = id => {
        // TODO: update database and do this on success
        setEventPlayers(prev => {
            return prev.filter(p => p.id !== id);
        });
    };

    const getRow = (player, i) => {
        const active = playerInEvent(player.id);
        return (
            <div key={i} className="list-item sm">
                <Row>
                    <Col sm={4}>
                        <p className="vertical-center">{player.name.first + ' ' + player.name.last}</p>
                    </Col>
                    <Col sm={1}>
                        {!active && <Button variant="success" className="vertical-center" style={{padding: "0 8px 2px"}} onClick={() => addPlayerToEvent(player.id)}>+</Button>}
                        {active && <Button variant="danger" className="vertical-center" style={{padding: "0 8px 2px"}} onClick={() => removePlayerFromEvent(player.id)}>-</Button>}
                    </Col>
                    {active && <>
                        <Col sm={2}>
                            <Form.Check 
                                type="checkbox"
                                id="paid-checkbox"
                                className="vertical-center"
                                label="Paid"
                                reverse
                            />
                        </Col>
                        <Col sm={3}>
                            <Form.Select aria-label="Select Player Team" className="vertical-center">
                                <option>&#60;Team&#62;</option>
                                <option value="In">In</option>
                                <option value="Out">Out</option>
                                <option value="Other">N/A</option>
                            </Form.Select>
                        </Col>
                    </>}
                </Row>
            </div>
        );
    };

    const getPlayerObject = id => {
        return allPlayers.find(p => p.id === id);
    }
    
    return (
        !loaded ? <Spinner animation="border" /> :
        <div className="scroll event-players">
            <div className="list-item sm search-item">
                <input placeholder="Search" value={searchTerm} onChange={handleChangeSearchTerm} />
            </div>
            {filteredPlayers.sort(comparePlayersByName).map(getRow)}
        </div>
    );
}