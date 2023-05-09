const event = {
    "date": "2020-01-01",
    "format": "test",
    "players": [
        {
            "id": "Harrison_Kerr",
            "status": "In",
            "paid": "false",
            "team": "Team 1"
        },
        {
          "id": "Danielle_Isbell",
          "status": "In",
          "paid": "false",
          "team": "Team 1"
        },
        {
          "id": "Ian_Brennan",
          "status": "In",
          "paid": "false",
          "team": "Team 2"
        },
        {
          "id": "Kristin_Janssen",
          "status": "In",
          "paid": "false",
          "team": "Team 2"
        }
    ]
};

const player = {
    id: "Harrison Kerr",
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
        type: "Phone",
        info: "8437540696"
    },
    affiliation: ["PPVC"],
    notes: "Organizer"
}


// remake for new format
const eventDBItem =
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

const playerDBItem = {
  "PlayerId": {
    "S": "Harrison_Kerr"
  },
  "Affiliation": {
    "SS": [
      "PPVC",
      "Savages"
    ]
  },
  "Contact": {
    "M": {
      "Info": {
        "S": "8437540696"
      },
      "Type": {
        "S": "Phone"
      }
    }
  },
  "Gender": {
    "S": "M"
  },
  "Handedness": {
    "S": "Right"
  },
  "Name": {
    "M": {
      "First": {
        "S": "Harrison"
      },
      "Last": {
        "S": "Kerr"
      }
    }
  },
  "Notes": {
    "S": "Organizer; Self"
  },
  "Roles": {
    "L": [
      {
        "S": "Pin"
      },
      {
        "S": "Setter"
      }
    ]
  },
  "Skills": {
    "M": {
      "Blocking": {
        "N": "5"
      },
      "Chemistry": {
        "N": "6"
      },
      "Defense": {
        "N": "5"
      },
      "Hitting": {
        "N": "6"
      },
      "Leadership": {
        "N": "8"
      },
      "Setting": {
        "N": "6"
      }
    }
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