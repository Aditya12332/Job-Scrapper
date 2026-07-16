const axios = require("axios");

async function fetchWorkdayJobs(company) {
    try {
        const response = await axios.post(
            company.endpoint,
            {
                appliedFacets: {},
                limit: 20,
                offset: 0,
                searchText: ""
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                timeout: 15000
            }
        );

        return response.data;
    } catch (err) {
        console.error(`Failed to fetch ${company.company}`);

        if (err.response) {
            console.error(err.response.status);
            console.error(err.response.data);
        } else {
            console.error(err.message);
        }

        return null;
    }
}

module.exports = fetchWorkdayJobs;