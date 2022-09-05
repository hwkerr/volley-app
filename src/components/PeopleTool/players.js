export const playerList = [
    {
        id: 'hakerr',
        name: 'Harrison Kerr',
        gender: 'm',
        positions: ['Wing', 'M'],
        contact: 'other',
        timesPlayed: 1
    },
    {
        id: 'daisbell',
        name: 'Danielle Isbell',
        gender: 'f',
        positions: ['S', 'Wing'],
        contact: 'phone',
        timesPlayed: 1
    }
];

export const newPlayerObj = {
    id: "?newPlayer",
    name: "",
    gender: "",
    positions: [],
    contact: "other",
    timesPlayed: -1
};

export const newPlayer = ({id, name, gender, positions, contact}) => {
    const names = name.split(' ');
    let newId;
    if (!id || id === undefined)
        newId = name.substring(0,2).toLowerCase() + names[names.length-1].toLowerCase();
    else
        newId = id;
    
    console.log("new player id: ", newId, name);
    return {
        id: newId,
        name,
        gender,
        positions,
        contact,
        timesPlayed: 0
    };
}