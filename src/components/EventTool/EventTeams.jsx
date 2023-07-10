import { useState } from "react";
import './EventTeams.css';
import { Card, Col, Row } from "react-bootstrap";
import { NO_TEAM } from "./eventsDB";

export default function EventTeams({ teams }) {
    const [highlightedStates, setHighlightedStates] = useState({});

    const isCardHighlighted = teamName => {
        return teamName in highlightedStates && highlightedStates[teamName];
    };
    
    const toggleCard = (teamName, closeOthers=false) => {
        if (closeOthers) {
            setHighlightedStates(prev => ({
                [teamName]: !prev[teamName]
            }));
        } else {
            setHighlightedStates(prev => ({
                ...prev,
                [teamName]: !prev[teamName]
            }));
        }
    };

    const getTeamSimple = (teamName, team) => (
        <div className="simple">
            <span className="team-name">
                {teamName !== NO_TEAM ? teamName : 'No Team'}
            </span>
            {`: `}
            <span className="players">
                {team.map(p => p.name.first).join(', ')}
            </span>
        </div>
    );
    
    const getTeamComplex = (teamName, team) => (
        <div className="complex">
            <span className="team-name">
                {teamName !== NO_TEAM ? teamName : 'No Team'}
            </span>
            {`: `}
            <span className="players">
                {team.map(p => p.name.first + ' ' + p.name.last).join(', ')}
            </span>
        </div>
    );
    
    const getTeamCard = (teamName, team) => {
        const highlight = isCardHighlighted(teamName);
        return (
            <Card key={teamName} className="card" onClick={() => toggleCard(teamName, true)}>
                <Card.Body>
                    <div className={highlight ? "highlight" : "lowlight"}>
                        {highlight ?
                            getTeamComplex(teamName, team) :
                            getTeamSimple(teamName, team)
                        }
                    </div>
                </Card.Body>
            </Card>
        );
    };
    
    return (
        <div className="teams-accordion">
            <Row>
                <Col sm={6}>
                    {Object.keys(teams).map(teamName => getTeamCard(teamName, teams[teamName]))}
                </Col>
            </Row>
        </div>
    );
}