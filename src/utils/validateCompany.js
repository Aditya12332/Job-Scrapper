function validateCompany(company) {

    const required = [
        "company",
        "ats",
        "url"
    ];

    for (const key of required) {

        if (!(key in company)) {

            throw new Error(
                `${company.company || "Unknown"} missing ${key}`
            );

        }

    }

}

module.exports = validateCompany;