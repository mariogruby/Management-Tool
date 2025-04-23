import fetch from 'node-fetch';

const PING_INTERVAL = 15 * 60 * 1000;
const URL = process.env.SERVER_URL

export const keepAlive = () => {
    fetch(URL)
    .then((res) => console.log(`Ping successfully: ${res.status}`))
    .catch((err) => console.error("Error in ping:", err));
};
setInterval(keepAlive, PING_INTERVAL);

console.log("initializing Keep-alive...");