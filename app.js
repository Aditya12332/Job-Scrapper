require("dotenv").config();

const {
    loadCompanies,
    loadKeywords
} = require("./src/config/config");

const companies = loadCompanies();

const keywords = loadKeywords();
const validateCompany = require("./src/utils/validateCompany");

companies.forEach(validateCompany);

console.log("Configuration Loaded Successfully");