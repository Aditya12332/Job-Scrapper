const Job = require("../db/jobs");

async function isNewJob(job) {
    try {
        const result = await Job.findOneAndUpdate(
    { jobId: job.id },
    {
        $setOnInsert: {
            jobId: job.id,
            company: job.company,
            title: job.title,
            url: job.url,
            ats: job.ats
        }
    },
    { upsert: true, returnDocument: "before" }
);

return result === null;    
} catch (err) {
        console.error("Deduplication Error:", err.message);
        return false;
    }
}

module.exports = isNewJob;