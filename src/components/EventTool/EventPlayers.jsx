import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Form, ButtonGroup, ToggleButton, DropdownButton, Dropdown } from "react-bootstrap";

import { getPlayerFromDatabase } from "../PeopleTool/playersDB";
import { getFilteredPlayersList } from "../../search";
import { NO_TEAM } from "./eventsDB";

export const STATUS = {
    NONE: '<>',
    ASKED: '?',
    IN: 'In',
    OUT: 'Out',
    NEXT: {
        'Out': '<>',
        '<>': '?',
        '?': 'In',
        'In': 'Out'
    }
};

export default function EventPlayers({ players, teamNames, onAddPlayer, onUpdatePlayer, onRemovePlayer }) {
    const [playersDB, setPlayersDB] = useState([]); // all players in player database (not necessarily in event)
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loaded, setLoaded] = useState(false);

    const getPlayerObject = id => playersDB.find(p => p.id === id);
    const getPlayerInEvent = id => players.find(p => p.id === id);
    const isPlayerInEvent = id => ((players.find(p => p.id === id)) ? true : false);
    
    const comparePlayersByName = (a, b) => {
        const playerA = getPlayerInEvent(a.id);
        const playerB = getPlayerInEvent(b.id);
        const statusValue = player => {
            return {
                [STATUS.IN]: 0,
                [STATUS.ASKED]: 1,
                [STATUS.NONE]: 2,
                [STATUS.OUT]: 3
            }[player ? player.status : STATUS.NONE];
        };
        const cmp = statusValue(playerA) - statusValue(playerB);
        if (cmp === 0) {
            if (a.name.first && b.name.first) {
                if (a.name.first < b.name.first) return -1;
                else if (a.name.first > b.name.first) return 1;
            } else if (a.name.last && b.name.last) {
                if (a.name.last < b.name.last) return -1;
                else if (a.name.last > b.name.last) return 1;
            } else return 0;
        } else return cmp;
    };
    
    useEffect(() => {
        if (loaded) setLoaded(false);
        getPlayerFromDatabase("all")
        .then(res => {
            console.log(`Found ${res.data.Count} player(s) in database`);
            setPlayersDB(res.data.Items);
            setLoaded(true);
        }).catch(err => {
            console.error("Error while getting player list from database - err:", err);
        });
    }, []);

    useEffect(() => {
        const newFilteredPlayersList = getFilteredPlayersList(playersDB, searchTerm);
        setFilteredPlayers(newFilteredPlayersList);
    }, [playersDB, players, searchTerm]);
    
    const updatePlayerStatus = id => {
        const playerStatus = getPlayerInEvent(id).status;
        const myNextStatus = STATUS.NEXT[playerStatus];
        if (myNextStatus === STATUS.NONE) {
            onRemovePlayer(id);
        } else if (myNextStatus === STATUS.OUT) {
            onUpdatePlayer(id, {
                status: myNextStatus,
                team: undefined
            });
        } else {
            onUpdatePlayer(id, { status: myNextStatus });
        }
    };
    
    const addPlayerToEvent = (id, status) => {
        const playerToAdd = {
            id,
            status: status || STATUS.IN,
            paid: false,
            team: NO_TEAM,
            note: ''
        };
        onAddPlayer(playerToAdd);
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
                                <Button variant="primary" className="custom-button-group inactive" onClick={() => addPlayerToEvent(player.id, STATUS.ASKED)}>{"+"}</Button>
                            }

                            {active && <>
                                {playerInEvent.status === STATUS.IN && <ToggleButton
                                    id={`toggle-check-${player.id}`}
                                    className="custom-button-group"
                                    type="checkbox"
                                    variant="light"
                                    checked={playerInEvent.paid}
                                    value="1"
                                    onChange={e => onUpdatePlayer(player.id, { paid: e.currentTarget.checked })}
                                >
                                    {playerInEvent.paid ? 'Paid' : 'Unpaid'}
                                </ToggleButton>}
                                {playerInEvent.status === STATUS.IN && <Form.Select aria-label="Team Select"
                                    className="custom-button-group combo-box"
                                    value={playerInEvent.team || undefined}
                                    onChange={e => onUpdatePlayer(player.id, { team: e.target.value })}
                                >
                                    {/* <option>&#60;Team&#62;</option> */}
                                    <option value={undefined}>Team...</option>
                                    {teamNames.map(teamName => (
                                        <option key={teamName}>{teamName}</option>
                                    ))}
                                </Form.Select>}
                                {playerInEvent.status === STATUS.IN && <input type="text"
                                    className="player-note-input custom-button-group"
                                    placeholder="Note"
                                    value={('note' in playerInEvent) ? playerInEvent.note : ''}
                                    onChange={e => onUpdatePlayer(player.id, { note: e.target.value })}
                                />}
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
                <input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>}
            {filteredPlayers.sort(comparePlayersByName).map(getRow)}
        </div>
    );
}