function parseAshbyJobs(company, data) {
    if (!data || !Array.isArray(data.jobs)) return [];

    return data.jobs.map((job) => ({
        id: `${company.company}::${job.id}`,
        company: company.company,
        ats: company.ats,
        title: job.title || "Unknown",
        location: job.location || job.address?.postalAddress?.addressLocality || "Not Specified",
        type: job.employmentType || "Unknown",
        posted: job.publishedAt || job.updatedAt || "Unknown",
        url: job.jobUrl || job.applyUrl,
        raw: job
    }));
}

module.exports = parseAshbyJobs;