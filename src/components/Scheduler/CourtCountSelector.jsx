import { useState } from "react";

export default function CourtCountSelector({ defaultValue=2, onChange }) {
    const [courtCount, setCourtCount] = useState(defaultValue);

    const clickButton = number => {
        let newCourtCount = number;
        if (number === "+") {
            if (courtCount > 4)
                newCourtCount = courtCount+1;
            else
                newCourtCount = 5;
        }
        setCourtCount(newCourtCount);
        onChange(newCourtCount);
    };
    
    return (
        <>
            <label>
                Courts{courtCount > 4 && (<span className="ml-1">{": " + courtCount}</span>)}
            </label>
            <div>
                <div id="courtButtons" className="btn-group" role="group" aria-label="Court-count buttons">
                    <button type="button" className={`btn btn-light ${courtCount === 1 ? "active" : ""}`} data-toggle="button" onClick={() => clickButton(1)}>1</button>
                    <button type="button" className={`btn btn-light ${courtCount === 2 ? "active" : ""}`} data-toggle="button" onClick={() => clickButton(2)}>2</button>
                    <button type="button" className={`btn btn-light ${courtCount === 3 ? "active" : ""}`} data-toggle="button" onClick={() => clickButton(3)}>3</button>
                    <button type="button" className={`btn btn-light ${courtCount === 4 ? "active" : ""}`} data-toggle="button" onClick={() => clickButton(4)}>4</button>
                    <button type="button" className={`btn btn-light ${courtCount  >  4 ? "active" : ""}`} data-toggle="button" onClick={() => clickButton("+")}>+</button>
                </div>
            </div>
        </>
    );
}