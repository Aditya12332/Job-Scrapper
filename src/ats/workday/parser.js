function parseWorkdayJobs(company, data) {
    if (!data || !Array.isArray(data.jobPostings)) {
        return [];
    }

    return data.jobPostings.map((job) => {
        // externalPath is like /job/Title-Words/ID
        // Full URL needs: baseUrl + /en-US/ + jobBoard + externalPath
        // But we don't always have jobBoard separately — the safe fix is
        // to derive the apply URL from the CX search endpoint itself.
        // Workday's public apply link pattern: baseUrl/en-US/<board>/job/<slug>/<id>
        // externalPath already contains /job/<slug>/<id>, so we just need /en-US/<board>
        const board = company.board || ""; // add "board" field to companies.json
        const path = job.externalPath || "";
        const url = board
            ? `${company.baseUrl}/en-US/${board}${path}`
            : `${company.baseUrl}${path}`; // fallback — still broken but won't crash

        return {
            id: `${company.company}::${path}`,
            company: company.company,
            ats: company.ats,
            title: job.title || "Unknown",
            location: job.locationsText || "Not Specified",
            type: job.timeType || "Unknown",
            posted: job.postedOn || null,
            url,
            raw: job
        };
    });
}

module.exports = parseWorkdayJobs;