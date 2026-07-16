const fetchJobs = require("../ats/fetchJobs");
const parseWorkdayJobs = require("../ats/workday/parser");
const { filterJobs } = require("./filter");
const isNewJob = require("./deduplicate");
const sendDiscord = require("../notifier/discord");

function parseJobs(company, rawData) {
    switch (company.ats) {
        case "workday": return parseWorkdayJobs(company, rawData);
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

        // Sequential — avoids Discord rate limit bursts
        for (const job of filteredJobs) {
            const isNew = await isNewJob(job);
            if (!isNew) continue;
            console.log(`🆕 New Job: ${job.title} | ${job.location} | ${job.posted}`);
            await sendDiscord(job);
            // Small base delay between notifications
            await new Promise((r) => setTimeout(r, 500));
        }
    } catch (err) {
        console.error(`❌ Monitor Error (${company.company}):`, err.message);
    }
}

module.exports = monitorCompany;