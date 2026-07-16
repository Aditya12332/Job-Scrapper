const axios = require("axios");

async function fetchLeverJobs(company) {
    try {
        const response = await axios.get(company.endpoint, { timeout: 15000 });
        return response.data;
    } catch (err) {
        console.error(`Failed to fetch ${company.company} (Lever)`);
        console.error(err.response?.status || err.message);
        return null;
    }
}

module.exports = fetchLeverJobs;