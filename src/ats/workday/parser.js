function parseWorkdayJobs(company, data) {

    return data.jobPostings.map(job => ({

        id: job.externalPath,

        company: company.company,

        ats: "workday",

        title: job.title,

        location: job.locationsText,

        type: job.timeType,

        posted: job.postedOn,

        url:
            company.baseUrl +
            job.externalPath

    }));

}

module.exports = parseWorkdayJobs;