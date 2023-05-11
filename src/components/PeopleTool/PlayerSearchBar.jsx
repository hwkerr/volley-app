import { useState } from 'react';

export default function PlayerSearchBar({ onChange }) {
    const [input, setInput] = useState("");

    const handleInputChange = event => {
        const newInput = event.target.value;
        setInput(newInput);
        onChange(newInput);
    }

    const handleButtonClick = event => {
        event.preventDefault();
        onChange(input);
    }
    
    return (
        <div>
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Name" value={input} onChange={handleInputChange}></input>
                <div className="input-group-append">
                    <button className="btn btn-primary flush-rightside-input" type="button" onClick={handleButtonClick}>Search</button>
                </div>
            </div>
        </div>
    );
}