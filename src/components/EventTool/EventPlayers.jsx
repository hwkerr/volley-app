import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Col, Row, Spinner, Form, ButtonGroup, ToggleButton, DropdownButton, Dropdown } from "react-bootstrap";

import { BASE_URL_PLAYERS } from "../PeopleTool/PeopleTool";
import { getFilteredPlayersList } from "../../search";

export default function EventPlayers({ players, teamNames, onChangeTeam, onUpdate }) {
    const [eventPlayers, setEventPlayers] = useState(players || []);
    const [allPlayers, setAllPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loaded, setLoaded] = useState(false);

    const getPlayerObject = id => allPlayers.find(p => p.id === id);
    const getPlayerInEvent = id => eventPlayers.find(p => p.id === id);
    const isPlayerInEvent = id => ((eventPlayers.find(p => p.id === id)) ? true : false);
    
    const comparePlayersByName = (a, b) => {
        const aActive = isPlayerInEvent(a.id);
        const bActive = isPlayerInEvent(b.id);

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
            console.error("Error while getting player list from database - err:", err);
        });
    }, []);

    useEffect(() => {
        setEventPlayers(players);
    }, [players]);

    useEffect(() => {
        const newFilteredPlayersList = getFilteredPlayersList(allPlayers, searchTerm);
        setFilteredPlayers(newFilteredPlayersList);
    }, [allPlayers, eventPlayers, searchTerm]);

    const handleChangeSearchTerm = e => {
        setSearchTerm(e.target.value);
    }

    const getPlayerFromDatabase = async (id) => {
        const url = BASE_URL_PLAYERS + "/" + id;
        return await axios.get(url);
    };

    const setPlayerPaid = (id, paid) => {
        // TODO: update database and do this on success
        setEventPlayers(prev => prev.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    paid: paid
                };
            } else {
                return p;
            }
        }));
    };

    const STATUS_NONE = '<>',
          STATUS_ASKED = '?',
          STATUS_IN = 'In',
          STATUS_OUT = 'Out';
    const nextStatus = {
        [STATUS_OUT]: STATUS_NONE,
        [STATUS_NONE]: STATUS_ASKED,
        [STATUS_ASKED]: STATUS_IN,
        [STATUS_IN]: STATUS_OUT
    };
    
    const updatePlayerStatus = id => {
        const playerStatus = getPlayerInEvent(id).status;
        const myNextStatus = nextStatus[playerStatus];
        // TODO: update database and do this on success
        if (myNextStatus === '<>') {
            setEventPlayers(prev => prev.filter(p => p.id !== id)); // remove player
        } else {
            setEventPlayers(prev => prev.map(p => { // update player to next status
                if (p.id === id) {
                    return {
                        ...p,
                        status: nextStatus[playerStatus]
                    };
                } else {
                    return p;
                }
            }));
        }
    };
    
    const addPlayerToEvent = (id, status) => {
        // TODO: update database and do this on success
        setEventPlayers(prev => {
            if (prev.find(p => p.id === id)) return prev;
            const playerToAdd = {
                id,
                status: status || "In",
                paid: false,
                team: null,
                note: ''
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

    const updatePlayerNote = (id, note) => {
        // TODO: update database and do this on success
        setEventPlayers(prev => prev.map(p => { // update player to next status
            if (p.id === id) {
                return {
                    ...p,
                    note: note
                };
            } else {
                return p;
            }
        }));
    };

    const getRow = (player, i) => {
        const active = isPlayerInEvent(player.id);
        const playerInEvent = getPlayerInEvent(player.id);
        return (
            <div key={i} className="list-item sm">
                <Row>
                    <Col sm={4} onClick={() => playerInEvent && console.log(playerInEvent)}>
                        <p className="vertical-center">{player.name.first + ' ' + player.name.last}</p>
                    </Col>
                    <Col sm={8}>
                        <ButtonGroup>
                            {active ?
                                <Button variant="primary" className="custom-button-group inactive" onClick={() => updatePlayerStatus(player.id)}>{playerInEvent.status}</Button> :
                                <Button variant="primary" className="custom-button-group inactive" onClick={() => addPlayerToEvent(player.id, STATUS_ASKED)}>{"+"}</Button>
                            }

                            {active && <>
                                <ToggleButton
                                    id={`toggle-check-${player.id}`}
                                    className="custom-button-group"
                                    type="checkbox"
                                    variant="light"
                                    checked={playerInEvent.paid}
                                    value="1"
                                    onChange={e => setPlayerPaid(player.id, e.currentTarget.checked)}
                                >
                                    {playerInEvent.paid ? 'Paid' : 'Unpaid'}
                                </ToggleButton>
                                <Form.Select aria-label="Team Select" className="custom-button-group combo-box" value={playerInEvent.team} onChange={e => onChangeTeam(player.id, e.target.value)}>
                                    {/* <option>&#60;Team&#62;</option> */}
                                    <option>Team...</option>
                                    {teamNames.map(teamName => (
                                        <option key={teamName}>{teamName}</option>
                                    ))}
                                </Form.Select>
                                <input type="text" className="player-note-input custom-button-group" placeholder="Note" value={('note' in playerInEvent) ? playerInEvent.note : ''} onChange={e => updatePlayerNote(player.id, e.target.value)} />
                            </>}
                        </ButtonGroup>
                    </Col>
                </Row>
            </div>
        );
    };
    
    return (
        <div className={`scroll event-players`}>
            {!loaded ? <div className="list-item sm only-item">
                <Spinner className="center" animation="border" />
            </div> :
            <div className="list-item sm search-item">
                <input placeholder="Search..." value={searchTerm} onChange={handleChangeSearchTerm} />
            </div>}
            {filteredPlayers.sort(comparePlayersByName).map(getRow)}
        </div>
    );
}