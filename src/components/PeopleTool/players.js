export const playerList = [
    {
        "id": "Harrison_Kerr",
        "name": {
            "first": "Harrison",
            "last": "Kerr"
        },
        "gender": "M",
        "handedness": "Right",
        "roles": ["Pin", "Setter"],
        "skills": {
            "setting": 6,
            "hitting": 6,
            "defense": 5,
            "blocking": 5,
            "chemistry": 6,
            "leadership": 8
        },
        "contact": {
            "type": "Phone",
            "info": "8437540696"
        },
        "affiliation": ["PPVC"],
        "notes": "Self"
    },
    {
        "id": "Danielle_Isbell",
        "name": {
            "first": "Danielle",
            "last": "Isbell",
            "nicks": ["Dani", "Izzy"]
        },
        "gender": "F",
        "handedness": "Left",
        "roles": ["Setter"],
        "skills": {
            "setting": 8,
            "hitting": 3,
            "defense": 6,
            "blocking": 3,
            "chemistry": 9,
            "leadership": 7
        },
        "contact": {
            "type": "Phone",
            "info": "7602718017"
        },
        "affiliation": ["PPVC"],
        "notes": ""
    }
];

export const newPlayerObj = {
    id: "?newPlayer",
    name: {
        first: "",
        last: ""
    },
    gender: "",
    handedness: "",
    roles: [],
    skills: {
        setting: 0,
        hitting: 0,
        defense: 0,
        blocking: 0,
        chemistry: 0,
        leadership: 0
    },
    contact: {
        type: null,
        info: ""
    },
    affiliation: [],
    notes: ""
};

export const newPlayer = ({id, name: {first, last}, gender, handedness, roles, skills, contact, affiliation, notes}) => {
    let newId;
    if (!id || id === undefined)
        newId = first + " " + last;
    else
        newId = id;
    
    return {
        id: first + " " + last,
        name: {
            first,
            last
        }, // must be explicit here- name keyword is reserved
        gender,
        handedness,
        roles,
        skills,
        contact,
        affiliation,
        notes
    };
}