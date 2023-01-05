import { useState } from "react";

export default function TeamSizeSelector({ defaultValue=6, onChange }) {
    const [teamSize, setTeamSize] = useState(defaultValue);

    const clickButton = number => {
        setTeamSize(number);
        onChange(number);
    };
    
    return (
        <>
            <label>
                Team Size
            </label>
            <div>
                <div id="teamsizeButtons" className="btn-group" role="group" aria-label="Team-size buttons">
                    <button type="button" className={`btn btn-light ${teamSize === 2 ? "active" : ""}`} data-toggle="button" onClick={() => clickButton(2)}>2s</button>
                    <button type="button" className={`btn btn-light ${teamSize === 3 ? "active" : ""}`} data-toggle="button" onClick={() => clickButton(3)}>3s</button>
                    <button type="button" className={`btn btn-light ${teamSize === 4 ? "active" : ""}`} data-toggle="button" onClick={() => clickButton(4)}>4s</button>
                    <button type="button" className={`btn btn-light ${teamSize === 6 ? "active" : ""}`} data-toggle="button" onClick={() => clickButton(6)}>6s</button>
                </div>
            </div>
        </>
    );
}