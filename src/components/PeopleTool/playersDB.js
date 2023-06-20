import axios from "axios";

const BASE_URL_PLAYERS = `https://9v2zi6tk3k.execute-api.us-east-2.amazonaws.com/dev/players`;

export const getPlayerFromDatabase = async (id) => {
    const url = BASE_URL_PLAYERS + "/" + id;
    return await axios.get(url);
};

export const savePlayerToDatabase = async (player) => {
    const url = BASE_URL_PLAYERS;
    return await axios.post(url, player);
};

export const deletePlayerFromDatabase = async (id) => {
    const url = BASE_URL_PLAYERS + "/" + id;
    return await axios.delete(url);
}