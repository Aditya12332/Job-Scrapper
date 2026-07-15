const Job=require("../database/jobs");

async function isNewJob(job){

    const existing=await Job.findOne({

        jobId:job.id

    });

    if(existing)

        return false;

    await Job.create({

        jobId:job.id,

        company:job.company,

        title:job.title,

        ats:job.ats

    });

    return true;

}

module.exports=isNewJob;