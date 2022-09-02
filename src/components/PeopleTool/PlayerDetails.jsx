import PlayerStatsPanel from "./PlayerStatsPanel";
import { newPlayerObj } from "./players";

export default function PlayerDetails({ player }) {
    

    const getPlayerDetail = () => (
        <PlayerStatsPanel player={player} newPlayer={false} />
    );

    const getNewPlayerForm = () => (
        <PlayerStatsPanel player={player} newPlayer={true} />
    );

    return (
        <div className="container" style={{backgroundColor: "#888888"}}>
            {
                player !== newPlayerObj ?
                getPlayerDetail() :
                getNewPlayerForm()
            }
        </div>
    );
}