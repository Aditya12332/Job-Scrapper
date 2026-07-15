function isRelevant(job, keywords){

    const title=job.title.toLowerCase();

    for(const blocked of keywords.block){

        if(title.includes(blocked))

            return false;

    }

    for(const allowed of keywords.allow){

        if(title.includes(allowed))

            return true;

    }

    return false;

}

function filterJobs(jobs,keywords){

    return jobs.filter(job=>isRelevant(job,keywords));

}

module.exports={

    filterJobs

};