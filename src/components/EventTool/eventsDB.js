import axios from "axios";

export const NO_TEAM = 'null';
const BASE_URL_EVENTS = `https://9v2zi6tk3k.execute-api.us-east-2.amazonaws.com/dev/events`;

export const getEventFromDatabase = async (id) => {
    const url = BASE_URL_EVENTS + "/" + id;
    console.log('GET', url);
    return await axios.get(url);
};

export const saveEventToDatabase = async (event) => {
    const url = BASE_URL_EVENTS;
    return await axios.post(url, event);
};

export const deleteEventFromDatabase = async (id) => {
    const url = BASE_URL_EVENTS + "/" + id;
    return await axios.delete(url);
};