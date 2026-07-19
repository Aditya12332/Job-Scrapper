const fetchWorkdayJobs = require("./workday");
const fetchGreenhouseJobs = require("./greenhouse");
const fetchLeverJobs = require("./lever");
const fetchAshbyJobs = require("./ashby");
const fetchSmartRecruitersJobs = require("./smartrecruiters");
async function fetchJobs(company) {
    switch (company.ats) {
        case "workday":
            return fetchWorkdayJobs(company);
        case "greenhouse":
            return fetchGreenhouseJobs(company);
        case "lever":
            return fetchLeverJobs(company);
        case "ashby": 
            return fetchAshbyJobs(company);
        case "smartrecruiters":
            return fetchSmartRecruitersJobs(company);
        default:
            throw new Error(`Unsupported ATS: ${company.ats}`);
    }
}

module.exports = fetchJobs;