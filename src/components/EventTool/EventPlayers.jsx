import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Form, ButtonGroup, ToggleButton, DropdownButton, Dropdown } from "react-bootstrap";

import { getPlayerFromDatabase } from "../PeopleTool/playersDB";
import { getFilteredPlayersList } from "../../search";

export default function EventPlayers({ players, teamNames, onAddPlayer, onUpdatePlayer, onRemovePlayer }) {
    const [candidatePlayers, setCandidatePlayers] = useState([]); // all players in player database (not necessarily in event)
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loaded, setLoaded] = useState(false);

    const getPlayerObject = id => candidatePlayers.find(p => p.id === id);
    const getPlayerInEvent = id => players.find(p => p.id === id);
    const isPlayerInEvent = id => ((players.find(p => p.id === id)) ? true : false);
    
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
            setCandidatePlayers(res.data.Items);
            setLoaded(true);
        }).catch(err => {
            console.error("Error while getting player list from database - err:", err);
        });
    }, []);

    useEffect(() => {
        const newFilteredPlayersList = getFilteredPlayersList(candidatePlayers, searchTerm);
        setFilteredPlayers(newFilteredPlayersList);
    }, [candidatePlayers, players, searchTerm]);

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
        if (myNextStatus === STATUS_NONE) {
            onRemovePlayer(id);
        } else if (myNextStatus === STATUS_OUT) {
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
            status: status || STATUS_IN,
            paid: false,
            team: null,
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
                                <Button variant="primary" className="custom-button-group inactive" onClick={() => addPlayerToEvent(player.id, STATUS_ASKED)}>{"+"}</Button>
                            }

                            {active && <>
                                {playerInEvent.status === STATUS_IN && <ToggleButton
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
                                {playerInEvent.status === STATUS_IN && <Form.Select aria-label="Team Select"
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
                                {playerInEvent.status === STATUS_IN && <input type="text"
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