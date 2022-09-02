import { useState } from 'react';
import './PeopleTool.css';
import PlayerDetails from './PlayerDetails';
import PlayerSearch from './PlayerSearch';

import { playerList } from './players'; // TODO: Use database

export default function PeopleTool() {
    const [selectedPlayer, setSelectedPlayer] = useState({});

    const handleChangeSelectedPlayer = player => {
        if (player === selectedPlayer)
            setSelectedPlayer({});
        else
            setSelectedPlayer(player);
    }

    return (
        <div className="PeopleTool" style={{backgroundColor: "#444444"}}>
            <h3 className="Center">People Tool</h3>
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <PlayerSearch players={playerList} onChangeSelectedPlayer={handleChangeSelectedPlayer} />
                    </div>
                    <div className="col-sm">
                        {selectedPlayer && Object.keys(selectedPlayer).length > 0 ? (
                            <PlayerDetails player={selectedPlayer} />
                        ) : (
                            <p>No player selected.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}