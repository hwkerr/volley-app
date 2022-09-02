export const playerList = [
    {
        name: 'Harrison Kerr',
        id: 'hakerr',
        gender: 'm',
        positions: ['Wing', 'M'],
        contact: 'self',
        timesPlayed: 1
    },
    {
        name: 'Danielle Isbell',
        id: 'daisbell',
        gender: 'f',
        positions: ['S', 'Wing'],
        contact: 'phone',
        timesPlayed: 1
    }
];

export const newPlayerObj = {
    id: "?newPlayer",
    name: "New Player"
};

export const newPlayer = (name, gender, positions, contact) => {
    const names = name.split(' ');
    const id = name.substring(0,2).toLowerCase() + names[names.length-1].toLowerCase();
    
    return {
        name,
        id,
        gender,
        positions,
        contact
    };
}