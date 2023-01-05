import { useState } from "react";

export const FORMAT = {
    PODS: "pods",
    TEAMS: "teams"
};

export default function TeamFormatSelector({ defaultValue=FORMAT.TEAMS, onChange }) {
    const [format, setFormat] = useState(defaultValue);

    const clickButton = value => {
        setFormat(value);
        onChange(value);
    };
    
    return (
        <>
            <label data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">
                Team Format
            </label>
            <div>
                <div id="teamsizeButtons" className="btn-group" role="group" aria-label="Team-size buttons">
                    <button type="button" className={`btn btn-light ${format === FORMAT.PODS  ? "active" : ""}`}
                        data-toggle="button" onClick={() => clickButton(FORMAT.PODS)} title="A half-team; two pods play together to form a TEAM"
                    >
                        Pods
                    </button>
                    <button type="button" className={`btn btn-light ${format === FORMAT.TEAMS ? "active" : ""}`}
                        data-toggle="button" onClick={() => clickButton(FORMAT.TEAMS)}
                    >
                        Teams
                    </button>
                </div>
            </div>
        </>
    );
}