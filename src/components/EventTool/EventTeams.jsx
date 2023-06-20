import { useState } from "react";
import './EventTeams.css';
import { Card, Col, Row } from "react-bootstrap";

export default function EventTeams({ teams }) {
    const [activeStates, setActiveStates] = useState({});

    const isActive = teamName => {
        return teamName in activeStates && activeStates[teamName];
    };
    
    const toggleCard = (teamName, closeOthers=false) => {
        if (closeOthers) {
            setActiveStates(prev => ({
                [teamName]: !prev[teamName]
            }));
        } else {
            setActiveStates(prev => ({
                ...prev,
                [teamName]: !prev[teamName]
            }));
        }
    };

    const getTeamSimple = (teamName, team) => (
        <div className="simple">
            <span className="team-name">
                {teamName}
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
                {teamName}
            </span>
            {`: `}
            <span className="players">
                {team.map(p => p.name.first + ' ' + p.name.last).join(', ')}
            </span>
        </div>
    );
    
    const getTeamCard = (teamName, team) => {
        const active = isActive(teamName);
        return (
            <Card key={teamName} className="card" onClick={() => toggleCard(teamName, true)}>
                <Card.Body>
                    <div className={active ? "active" : "inactive"}>
                        {active ?
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