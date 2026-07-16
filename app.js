require("dotenv").config();
const connectDB = require("./src/db/mongo");
const { loadCompanies, loadKeywords } = require("./src/config/config");
const monitorCompany = require("./src/services/monitor"); // wherever you keep this
const startScheduler = require("./src/scheduler/cron");

const CONCURRENCY = 5; // don't fetch all companies in parallel

async function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

async function runScan() {
    const companies = loadCompanies();
    const keywords = loadKeywords();
    const batches = await chunk(companies, CONCURRENCY);

    for (const batch of batches) {
        await Promise.all(batch.map((c) => monitorCompany(c, keywords)));
    }
}

async function main() {
    await connectDB();
    await runScan(); // run once immediately on boot
    startScheduler(runScan);
}

main().catch((err) => {
    console.error("Fatal startup error:", err.message);
    process.exit(1);
});