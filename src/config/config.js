const fs = require("fs");
const path = require("path");

function loadCompanies() {
    const file = path.join(__dirname, "companies.json");

    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function loadKeywords() {
    const file = path.join(__dirname, "keywords.json");

    return JSON.parse(fs.readFileSync(file, "utf8"));
}

module.exports = {
    loadCompanies,
    loadKeywords
};