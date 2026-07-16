function parseLeverJobs(company, data) {
    if (!Array.isArray(data)) return [];

    return data.map((job) => ({
        id: `${company.company}::${job.id}`,
        company: company.company,
        ats: company.ats,
        title: job.text || "Unknown",
        location: job.categories?.location || "Not Specified",
        type: job.categories?.commitment || "Unknown",
        posted: job.createdAt ? new Date(job.createdAt).toISOString() : "Unknown",
        url: job.hostedUrl,
        raw: job
    }));
}

module.exports = parseLeverJobs;