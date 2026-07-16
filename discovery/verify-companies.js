const axios = require("axios");
const fs = require("fs");
const path = require("path");

const companiesPath = path.join(__dirname, "..", "src", "config", "companies.json");
const companies = JSON.parse(fs.readFileSync(companiesPath, "utf8"));

async function verify(company) {
    try {
        const res = await axios.post(
            company.endpoint,
            { appliedFacets: {}, limit: 5, offset: 0, searchText: "" },
            { headers: { "Content-Type": "application/json" }, timeout: 8000 }
        );
        return Array.isArray(res.data?.jobPostings);
    } catch (err) {
        return false;
    }
}

async function run() {
    const valid = [];
    for (const company of companies) {
        const ok = await verify(company);
        console.log(ok ? `✅ ${company.company}` : `❌ ${company.company} — removing`);
        if (ok) valid.push(company);
        await new Promise((r) => setTimeout(r, 300));
    }
    fs.writeFileSync(companiesPath, JSON.stringify(valid, null, 2));
    console.log(`\n✅ Kept: ${valid.length} / ${companies.length}`);
}

run();