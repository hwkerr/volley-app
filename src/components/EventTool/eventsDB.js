import axios from "axios";

export const BASE_URL_EVENTS = `https://9v2zi6tk3k.execute-api.us-east-2.amazonaws.com/dev/events`;

export const getFromDatabase = async (id) => {
    const url = BASE_URL_EVENTS + "/" + id;
    console.log('GET', url);
    return await axios.get(url);
};

export const saveToDatabase = async (event) => {
    const url = BASE_URL_EVENTS;
    return await axios.post(url, event);
};

export const deleteFromDatabase = async (id) => {
    const url = BASE_URL_EVENTS + "/" + id;
    return await axios.delete(url);
};