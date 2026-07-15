require("dotenv").config();
const connectDB=require("./src/database/mongo");
const {
    loadCompanies,
    loadKeywords
} = require("./src/config/config");

const fetchWorkdayJobs = require("./src/ats/workday");
const parseJobs = require("./src/ats/workday/parser");
const { filterJobs } = require("./src/services/filter");

async function main() {
    await connectDB();
    const companies = loadCompanies();
    const keywords = loadKeywords();

    const raw = await fetchWorkdayJobs(companies[0]);

    const jobs = parseJobs(companies[0], raw);

    const filtered = filterJobs(jobs, keywords);

    console.log(filtered);
}

main();