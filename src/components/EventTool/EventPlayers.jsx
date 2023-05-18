import { useEffect, useState } from "react";
import axios from 'axios';

import { BASE_URL_PLAYERS } from "../PeopleTool/PeopleTool";
import { Button, Col, Row, Spinner } from "react-bootstrap";

export default function EventPlayers({ players, onUpdate }) {
    const [eventPlayers, setEventPlayers] = useState(players);
    const [allPlayers, setAllPlayers] = useState([]);
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
            <div key={i} className="listitem-name sm p-1">
                <Row>
                    <Col sm={4}>
                        <p>{player.name.first + ' ' + player.name.last}</p>
                    </Col>
                    <Col sm={2}>
                        {!active && <Button variant="success" size="sm" onClick={() => addPlayerToEvent(player.id)}>+</Button>}
                        {active && <Button variant="danger" size="sm" onClick={() => removePlayerFromEvent(player.id)}>-</Button>}
                    </Col>
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
            {allPlayers.sort(comparePlayersByName).map(getRow)}
        </div>
    );
}