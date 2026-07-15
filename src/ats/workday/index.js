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
                    "Content-Type": "application/json"
                }
            }

        );

        return response.data;

    }

    catch (err) {

        console.error(err.response?.data || err.message);

        return null;

    }

}

module.exports = fetchWorkdayJobs;