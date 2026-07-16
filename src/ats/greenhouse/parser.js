function parseGreenhouseJobs(company, data) {
    if (!data || !Array.isArray(data.jobs)) return [];

    return data.jobs.map((job) => ({
        id: `${company.company}::${job.id}`,
        company: company.company,
        ats: company.ats,
        title: job.title || "Unknown",
        location: job.location?.name || "Not Specified",
        type: "Unknown",
        posted: job.updated_at || "Unknown",
        url: job.absolute_url,
        raw: job
    }));
}

module.exports = parseGreenhouseJobs;