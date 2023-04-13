const event = {
    "date": "2020-01-01",
    "format": "test",
    "teams": [
        {
            "players": ["Harrison Kerr", "Danielle Isbell", "Bailey Myers"]
        },
        {
            "players": ["Ian Brennan", "Kristin Janssen", "Brooklin Trudell"]
        }
    ]
};

const player = {
    fullName: "Harrison Kerr",
    gender: "M",
    handedness: "Right",
    name: {
        first: "Harrison",
        last: "Kerr"
    },
    roles: ["Pin", "Setter"],
    skills: {
        setting: 6,
        hitting: 6,
        defense: 5,
        blocking: 5,
        chemistry: 6,
        leadership: 8
    },
    contact: {
        type: "phone",
        info: "8437540696"
    },
    affiliation: ["PPVC"],
    notes: "Organizer"
}



const item =
{
    "EventId": {
      "S": "20200101"
    },
    "Date": {
      "S": "2020-01-01"
    },
    "Format": {
      "S": "Rotating Threes"
    },
    "Teams": {
      "L": [
        {
          "M": {
            "players": {
              "L": [
                {
                  "S": "Harrison Kerr"
                },
                {
                  "S": "Danielle Isbell"
                },
                {
                  "S": "Bailey Myers"
                }
              ]
            }
          }
        },
        {
          "M": {
            "players": {
              "L": [
                {
                  "S": "Ian Brennan"
                },
                {
                  "S": "Kristin Janssen"
                },
                {
                  "S": "Brooklin Trudell"
                }
              ]
            }
          }
        }
      ]
    }
}

const formatTeamsForDB = (teamsList) => {
    return {
        "L": teamsList.map(team => (
            {
                "M": {
                    "players": {
                        "L": team.players.map(playerName => (
                            {
                                "S": playerName
                            }
                        ))
                    }
                }
            }
        ))
    }
}

const formatPlayerForDB = (player) => ({
    "FullName": {
        "S": player.fullName
    },
    "Handedness": {
        "S": player.handedness
    },
    "Name": {
        "M": {
            "First": {
                "S": player.name.first
            },
            "Last": {
                "S": player.name.last
            }
        }
    },
    "Roles": {
        "L": [
            player.roles.map(role => ({
                "S": role
            }))
        ]
    },
    "Skills": {
        "M": {
            "Blocking": {
                "N": player.skills.blocking
            },
            "Chemistry": {
                "N": player.skills.chemistry
            },
            "Defense": {
                "N": player.skills.defense
            },
            "Hitting": {
                "N": player.skills.hitting
            },
            "Leadership": {
                "N": player.skills.leadership
            },
            "Setting": {
                "N": player.skills.setting
            }
        }
    }
})