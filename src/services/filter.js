const INDIA_LOCATIONS = [
    "india", "bengaluru", "bangalore", "hyderabad", "pune", "mumbai",
    "chennai", "delhi", "noida", "gurugram", "gurgaon", "kolkata",
    "ahmedabad", "kochi", "remote"
];

const SENIORITY_BLOCK_REGEX = /\b(senior|sr\.?|staff|principal|lead|manager|director|architect|vice president|vp|head of|chief)\b/i;

const EXPERIENCE_BLOCK = [
    "3+ years", "4+ years", "5+ years", "6+ years", "7+ years", "8+ years",
    "minimum 2 years", "minimum 3 years", "at least 3 years", "at least 5 years",
    "4-6 years", "5-8 years", "3-5 years"
];

const ALLOW_KEYWORDS = [
    "software engineer", "software developer", "software development engineer",
    "sde", "associate software engineer", "associate engineer",
    "application engineer", "backend engineer", "backend developer",
    "frontend engineer", "frontend developer", "full stack", "fullstack",
    "full-stack", "web developer", "web engineer", "graduate", "new grad",
    "new graduate", "entry level", "entry-level", "early career",
    "intern", "internship", "machine learning engineer", "ml engineer",
    "ai engineer", "data engineer", "trainee", "apprentice",
    "junior software engineer", "junior developer", "junior engineer", 
    "junior software developer", "junior software engineer", "junior sde",
     "junior sde i", "junior sde i","member of technical staff", "mts", "associate software developer",
    "associate software engineer", "associate sde", "associate sde i",
    "associate sde i", "software engineer i", "software engineer i",
    "software engineer", "software developer i", "software developer ii",
    "software developer i", "sde i","amts","assistant software engineer","assistant software developer",
    "assistant sde","assistant sde i","graduate software engineer","graduate software developer",
    "graduate sde","graduate sde i","apprentice software engineer","apprentice software developer","apprentice sde",
    "associate full stack developer","associate full stack engineer","associate full stack software engineer",
    "associate full stack software developer","associate full stack sde","associate full stack sde i",
    "junior full stack developer","junior full stack engineer","junior full stack software engineer",
    "associate frontend developer","associate frontend engineer","associate frontend software engineer",
    "associate frontend software developer","associate frontend sde","associate frontend sde i",
    "junior frontend developer","junior frontend engineer","junior frontend software engineer",
    "associate backend developer","associate backend engineer","associate backend software engineer",
    "associate backend software developer","associate backend sde","associate backend sde i",
    "junior backend developer","junior backend engineer","junior backend software engineer",
    "junior backend software developer","junior backend sde","junior backend sde i",
    "associate machine learning engineer","associate machine learning software engineer",
    "associate machine learning software developer","associate machine learning sde",
    "associate machine learning sde i","junior machine learning engineer",
    "junior machine learning software engineer","junior machine learning software developer",
    "junior machine learning sde","junior machine learning sde i",
    "associate data engineer","associate data software engineer","associate data software developer",
    "associate data sde","associate data sde i","junior data engineer",
    "junior data software engineer","junior data software developer",
    "junior data sde","junior data sde i","associate ai engineer",
    "associate ai software engineer","associate ai software developer",
    "associate ai sde","associate ai sde i","junior ai engineer",
    "junior ai software engineer","junior ai software developer",
    "junior ai sde","junior ai sde i","associate sdet","associate sdet i",
    "junior sdet","junior sdet i","associate qa engineer",
    "associate qa software engineer","associate qa software developer",
    "associate qa sde","associate qa sde i","junior qa engineer",
    "junior qa software engineer","junior qa software developer",
    "junior qa sde","junior qa sde i","associate test engineer",
    "associate test software engineer","associate test software developer",
    "associate test sde","associate test sde i","junior test engineer",
    "junior test software engineer","junior test software developer",
    "junior test sde","junior test sde i","associate aiml engineer",
    "associate aiml software engineer","associate aiml software developer",
    "associate aiml sde","associate aiml sde i","junior aiml engineer",
    "junior aiml software engineer","junior aiml software developer",
    "junior aiml sde","junior aiml sde i","associate devops engineer",
    "associate devops software engineer","associate devops software developer",
    "associate devops sde","associate devops sde i","junior devops engineer",
    "junior devops software engineer","junior devops software developer",
    "junior devops sde","junior devops sde i", "apprentice software engineer","apprentice software developer","apprentice sde",
    "apprentice sde i","graduate software engineer","graduate software developer",
    "graduate sde","graduate sde i","apprentice software engineer","apprentice software developer",
    "apprentice sde","apprentice sde i","graduate software engineer","graduate software developer",
    "graduate sde","graduate sde i"
];

function isWithin24Hours(postedOn) {
    if (!postedOn) return false;

    // Workday: relative strings like "Posted Today", "Posted 2 Days Ago"
    if (typeof postedOn === "string") {
        const lower = postedOn.toLowerCase();
        if (lower.includes("today") || lower.includes("just now") || lower.includes("0 days")) return true;
        if (lower.includes("1 day") || lower === "yesterday") return true;
    }

    // Greenhouse (ISO string) and Lever (ms timestamp or ISO string) both parse cleanly here
    const d = new Date(postedOn);
    if (!isNaN(d)) {
        const hoursDiff = (Date.now() - d.getTime()) / (1000 * 60 * 60);
        return hoursDiff <= 48;
    }

    return false;
}

function isIndiaJob(job) {
    const location = (job.location || "").toLowerCase();
    return INDIA_LOCATIONS.some((kw) => location.includes(kw));
}

function hasSeniorTitle(title) {
    return SENIORITY_BLOCK_REGEX.test(title);
}

function hasAllowKeyword(title) {
    const t = title.toLowerCase();
    return ALLOW_KEYWORDS.some((kw) => t.includes(kw));
}

function passesExperienceCheck(job) {
    const text = (job.raw?.jobDescription || job.raw?.content || job.raw?.description || job.raw?.descriptionPlain || "").toLowerCase();
    if (!text) return true;
    return !EXPERIENCE_BLOCK.some((phrase) => text.includes(phrase));
}

// Lever-specific bonus check: its structured "commitment" field (e.g. "Full-time", "Intern")
// can help confirm internship roles even if the title itself doesn't say "intern"
function passesLeverCommitmentCheck(job) {
    if (job.ats !== "lever") return true; // not applicable to other platforms
    const commitment = (job.type || "").toLowerCase();
    if (commitment.includes("intern")) return true; // always allow explicit internships through
    return true; // don't block on this field, just used as a positive signal for now
}

function isRelevant(job, _keywords) {
    if (!isIndiaJob(job)) return false;
    if (hasSeniorTitle(job.title)) return false;
    if (!hasAllowKeyword(job.title)) return false;
    if (!isWithin24Hours(job.posted)) return false;
    if (!passesExperienceCheck(job)) return false;
    if (!passesLeverCommitmentCheck(job)) return false;
    return true;
}

function filterJobs(jobs, keywords) {
    if (!Array.isArray(jobs)) return [];
    return jobs.filter((job) => isRelevant(job, keywords));
}

module.exports = { filterJobs, isRelevant };