function parseSmartRecruitersJobs(company, data) {
    if (!data || !Array.isArray(data.content)) return [];

    return data.content.map((job) => {
        const companyIdentifier = job.company?.identifier || company.company;
        const publicUrl = `https://jobs.smartrecruiters.com/${companyIdentifier}/${job.id}`;

        return {
            id: `${company.company}::${job.id}`,
            company: company.company,
            ats: company.ats,
            title: job.name || "Unknown",
            location: job.location?.city ? `${job.location.city}, ${job.location.country}` : "Not Specified",
            type: job.typeOfEmployment?.label || "Unknown",
            posted: job.releasedDate || "Unknown",
            url: job.applyUrl || job.postingUrl || publicUrl,
            raw: job
        };
    });
}

module.exports = parseSmartRecruitersJobs;