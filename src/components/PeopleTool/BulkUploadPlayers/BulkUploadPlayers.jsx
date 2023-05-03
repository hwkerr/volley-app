import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { newPlayerObj } from "../players";
import { SKILL_TYPES } from "../PlayerFormFields";
import axios from "axios";

import { BASE_URL_PLAYERS } from "../PeopleTool";
import { Button } from "react-bootstrap";

const DISABLED = true;

export default function BulkUploadPlayers({}) {
    const [oldPlayers, setOldPlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    
    useEffect(() => {
        getFromDatabase("all")
        .then(res => {
            console.log(`Found ${res.data.Count} item(s) in database`);
            const playerMap = {};
            res.data.Items.forEach(item => playerMap[item.id] = item);
            setOldPlayers(playerMap);
        }).catch(err => {
            console.error(err);
        });
    }, []);

    const getFromDatabase = async (id) => {
        const url = BASE_URL_PLAYERS + "/" + id;
        return await axios.get(url);
    };
    
    const handleFileSelected = event => {
        const file = Array.from(event.target.files)[0];
        console.log(file);
        const reader = new FileReader();
        reader.onload = event => {
            setPlayers(csvToObject(event.target.result).map(formatPlayer));
        }
        reader.readAsText(file);
    };

    const formatName = str => str.trim().replaceAll(/[^A-Za-z]/ig, '').replaceAll(' ', '_');

    const formatPlayer = player => {
        let firstName = player.FirstName;
        let lastName = player.LastName;
        
        if (!firstName || firstName === '') firstName = "" + Date.now();
        else firstName = formatName(firstName);
        if (!lastName || lastName === '') lastName = "" + Date.now();
        else lastName = formatName(lastName);
        let id = firstName + "_" + lastName;

        let mySkills = {};
        SKILL_TYPES.forEach(skillType => {
            mySkills[skillType.toLowerCase()] = 0;
        });

        const p = {
            id: id,
            gender: player.Gender,
            handedness: player.Handedness,
            name: {
                first: player.FirstName.trim() || '???',
                last: player.LastName.trim() || '???',
                nicks: player.Nickname.split(';').filter(x => x !== '')
            },
            roles: [player.Position.trim()],
            skills: mySkills,
            contact: {
                type: player.ContactType.trim(),
                info: player.ContactType === 'Phone' ? player.Phone : player.ContactInfo.trim()
            },
            affiliation: player.Affiliation.split(';').filter(x => x !== ''),
            notes: player.Notes.trim()
        };

        return p;
    }

    const savePlayersToDatabase = () => {
        console.log("Saving");
        players.filter(player => !player.id.match(/[0-9]{5,}/)).forEach(player => { // filter out players with a missing first or last name
            axios.post(BASE_URL_PLAYERS, player)
            .then(res => console.log(player.id, res))
            .catch(err => {
                console.error(player.id, err);
            });
        });
    }

    const csvToObject = csv => {
        const delimiter = ',';
        const lines = csv.split('\r\n');
        const headers = lines[0].split(delimiter);

        const newPlayers = [];
        for (let row = 1; row < lines.length; row++) {
            let player = {};
            let currentLine = lines[row].split(delimiter);

            for (let col = 0; col < headers.length && col < currentLine.length; col++) {
                player[headers[col]] = currentLine[col];
            }

            newPlayers.push(player);
        }
        console.log(newPlayers);
        return newPlayers;
    }
    
    return (
        <div className="container pt-3 pb-3">
            <Form>
                <fieldset disabled={DISABLED}>
                    <Form.Group controlId="formFileSm" className="mb-3">
                        <Form.Label>CSV File</Form.Label>
                        <Form.Control type="file" size="sm" onChange={handleFileSelected} />
                    </Form.Group>
                    <Button variant="primary" onClick={savePlayersToDatabase}>Save All To Database</Button>
                </fieldset>
            </Form>
        </div>
    );
}