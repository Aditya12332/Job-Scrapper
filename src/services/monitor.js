const fetchJobs = require("../ats/fetchJobs");
const parseWorkdayJobs = require("../ats/workday/parser");
const parseGreenhouseJobs = require("../ats/greenhouse/parser");
const parseLeverJobs = require("../ats/lever/parser");
const { filterJobs } = require("./filter");
const isNewJob = require("./deduplicate");
const sendDiscord = require("../notifier/discord");
const parseAshbyJobs = require("../ats/ashby/parser");
const parseSmartRecruitersJobs = require("../ats/smartrecruiters/parser");
function parseJobs(company, rawData) {
    switch (company.ats) {
        case "workday": return parseWorkdayJobs(company, rawData);
        case "greenhouse": return parseGreenhouseJobs(company, rawData);
        case "lever": return parseLeverJobs(company, rawData);
        case "ashby": return parseAshbyJobs(company, rawData);
        case "smartrecruiters": return parseSmartRecruitersJobs(company, rawData);
        default: return [];
    }
}

async function monitorCompany(company, keywords) {
    try {
        const rawData = await fetchJobs(company);
        if (!rawData) {
            console.log(`❌ Unable to fetch jobs for ${company.company}`);
            return;
        }

        const parsedJobs = parseJobs(company, rawData);
        console.log(`📦 ${company.company}: ${parsedJobs.length} jobs fetched`);

        const filteredJobs = filterJobs(parsedJobs, keywords);
        console.log(`🎯 ${company.company}: ${filteredJobs.length} relevant jobs`);

        for (const job of filteredJobs) {
            const isNew = await isNewJob(job);
            if (!isNew) continue;
            console.log(`🆕 New Job: ${job.title} | ${job.location} | ${job.posted}`);
            await sendDiscord(job);
            await new Promise((r) => setTimeout(r, 500));
        }
    } catch (err) {
        console.error(`❌ Monitor Error (${company.company}):`, err.message);
    }
}

module.exports = monitorCompany;