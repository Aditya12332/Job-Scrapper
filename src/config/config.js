const fs = require("fs");
const path = require("path");

function readJSON(fileName) {
    const filePath = path.join(__dirname, fileName);

    if (!fs.existsSync(filePath)) {
        throw new Error(`${fileName} not found`);
    }

    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        throw new Error(`Failed to parse ${fileName}: ${err.message}`);
    }
}

function loadCompanies() {
    const companies = readJSON("companies.json");

    if (!Array.isArray(companies)) {
        throw new Error("companies.json must contain an array");
    }

    companies.forEach((company, index) => {
        if (!company.company) {
            throw new Error(
                `companies.json -> company missing at index ${index}`
            );
        }

        if (!company.ats) {
            throw new Error(
                `${company.company}: ats is missing`
            );
        }

        if (!company.endpoint) {
            throw new Error(
                `${company.company}: endpoint is missing`
            );
        }

        if (!company.baseUrl) {
            throw new Error(
                `${company.company}: baseUrl is missing`
            );
        }
    });

    return companies;
}

function loadKeywords() {
    const keywords = readJSON("keywords.json");

    if (!keywords.allow || !keywords.block) {
        throw new Error(
            "keywords.json must contain allow and block arrays"
        );
    }

    return keywords;
}

module.exports = {
    loadCompanies,
    loadKeywords
};