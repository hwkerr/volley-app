const event = {
    "eventId": "20200101",
    "name": "Indoor Pickup 2020-01-01",
    "date": "2020-01-01",
    "format": "test",
    "host": "Harrison Kerr",
    "location": "SC Elite",
    "notes": "",
    "players": [
        {
            "id": "Harrison_Kerr",
            "status": "In",
            "paid": false,
            "team": "Team 1"
        },
        {
          "id": "Danielle_Isbell",
          "status": "In",
          "paid": false,
          "team": "Team 1"
        },
        {
          "id": "Ian_Brennan",
          "status": "In",
          "paid": false,
          "team": "Team 2"
        },
        {
          "id": "Kristin_Janssen",
          "status": "In",
          "paid": false,
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

const eventDBItem = {
  "EventId": {
    "S": "20200201"
  },
  "Date": {
    "S": "2020-02-01"
  },
  "Format": {
    "S": "Rotating Threes Test"
  },
  "Host": {
    "S": "Harrison Kerr"
  },
  "Location": {
    "S": "SC Elite"
  },
  "Name": {
    "S": "Indoor Pickup 2020-02-01"
  },
  "Notes": {
    "S": ""
  },
  "Players": {
    "L": [
      {
        "M": {
          "Paid": {
            "BOOL": true
          },
          "PlayerId": {
            "S": "Harrison_Kerr"
          },
          "Status": {
            "S": "In"
          },
          "TeamId": {
            "S": "Team 1"
          }
        }
      },
      {
        "M": {
          "Paid": {
            "BOOL": true
          },
          "PlayerId": {
            "S": "Danielle_Isbell"
          },
          "Status": {
            "S": "In"
          },
          "TeamId": {
            "S": "Team 1"
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

const formatEventForDB = (event) => ({
  "EventId": {
      "S": event.id || event.date.replaceAll('-', '')
  },
  "Date": {
      "S": event.date
  },
  "Format": {
      "S": event.format || ''
  },
  "Host": {
      "S": event.host || ''
  },
  "Location": {
      "S": event.location || ''
  },
  "Name": {
      "S": event.name || "Event " + event.date
  },
  "Notes": {
      "S": event.notes || ''
  },
  "Players": {
      "L": event.players.map(player => ({
          "M": {
              "Paid": {
                  "BOOL": player.paid
              },
              "PlayerId": {
                  "S": player.id
              },
              "Status": {
                  "S": player.status
              },
              "TeamId": {
                  "S": player.team
              }
          }
      }))
  }
});

const formatPlayerForDB = (player) => ({
  "PlayerId": {
      "S": player.id || (player.name.first + "_" + player.name.last).replaceAll(" ", "_")
  },
  "Gender": {
      "S": player.gender || ''
  },
  "Handedness": {
      "S": player.handedness || ''
  },
  "Name": {
      "M": {
          "First": {
              "S": player.name.first
          },
          "Last": {
              "S": player.name.last
          },
          "Nicks": {
              "L": (player.name.nicks || []).filter(name => (name !== '')).map(nick => ({
                  "S": nick
              }))
          }
      }
  },
  "Roles": {
      "L": (player.roles || []).map(role => ({
              "S": role
      }))
  },
  "Skills": {
      "M": {
          "Blocking": {
              "N": "" + (player.skills ? player.skills.blocking : 0)
          },
          "Chemistry": {
              "N": "" + (player.skills ? player.skills.chemistry : 0)
          },
          "Defense": {
              "N": "" + (player.skills ? player.skills.defense : 0)
          },
          "Hitting": {
              "N": "" + (player.skills ? player.skills.hitting : 0)
          },
          "Leadership": {
              "N": "" + (player.skills ? player.skills.leadership : 0)
          },
          "Setting": {
              "N": "" + (player.skills ? player.skills.setting : 0)
          }
      }
  },
  "Affiliation": {
      "L": (player.affiliation || []).map(affiliationName => ({
              "S": affiliationName
      }))
  },
  "Contact": {
      "M": {
          "Info": {
              "S": player.contact ? player.contact.info : ""
          },
          "Type": {
              "S": player.contact ? player.contact.type : ""
          }
      }
  },
  "Notes": {
      "S": player.notes || ''
  }
});