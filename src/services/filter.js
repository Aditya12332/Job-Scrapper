// India location keywords — job must match at least one
const INDIA_LOCATIONS = [
    "india", "bengaluru", "bangalore", "hyderabad", "pune", "mumbai",
    "chennai", "delhi", "noida", "gurugram", "gurgaon", "kolkata",
    "ahmedabad", "kochi", "remote" // include remote — can be done from India
];

// Seniority block — checked against title as plain substring (no word boundary needed)
const SENIORITY_BLOCK_PHRASES = [
    "senior", "sr.", " sr ", "staff ", "principal", " lead ", "lead ",
    "manager", "director", "architect", "vice president", " vp ", "head of", "chief"
];

// Experience block — checked against description text
const EXPERIENCE_BLOCK = [
    "3+ years", "4+ years", "5+ years", "6+ years", "7+ years", "8+ years",
    "minimum 2 years", "minimum 3 years", "at least 3 years", "at least 5 years",
    "4-6 years", "5-8 years", "3-5 years"
];

// Allow keywords — title must contain at least one
const ALLOW_KEYWORDS = [
    "software engineer", "software developer", "software development engineer",
    "sde", "associate software engineer", "associate engineer",
    "application engineer", "backend engineer", "backend developer",
    "frontend engineer", "frontend developer", "full stack", "fullstack",
    "full-stack", "web developer", "web engineer", "graduate", "new grad",
    "new graduate", "entry level", "entry-level", "early career",
    "intern", "internship", "machine learning engineer", "ml engineer",
    "ai engineer", "data engineer"
];

function isWithin24Hours(postedOn) {
    if (!postedOn) return false;
    // Workday returns "Posted X Days Ago" or "Today" as a string — NOT a date
    // It also sometimes returns "YYYY-MM-DD"
    if (typeof postedOn === "string") {
        const lower = postedOn.toLowerCase();
        if (lower.includes("today") || lower.includes("just now") || lower.includes("0 days")) return true;
        if (lower.includes("1 day") || lower === "yesterday") return true;

        // Try parsing as a date string
        const d = new Date(postedOn);
        if (!isNaN(d)) {
            const hoursDiff = (Date.now() - d.getTime()) / (1000 * 60 * 60);
            return hoursDiff <= 48; // 48h buffer for timezone drift
        }
        return false;
    }
    return false;
}

function isIndiaJob(job) {
    const location = (job.location || "").toLowerCase();
    return INDIA_LOCATIONS.some((kw) => location.includes(kw));
}

function hasSeniorTitle(title) {
    const t = title.toLowerCase();
    return SENIORITY_BLOCK_PHRASES.some((phrase) => t.includes(phrase));
}

function hasAllowKeyword(title) {
    const t = title.toLowerCase();
    return ALLOW_KEYWORDS.some((kw) => t.includes(kw));
}

function passesExperienceCheck(job) {
    const text = (job.raw?.jobDescription || job.raw?.content || job.raw?.description || "").toLowerCase();
    if (!text) return true;
    return !EXPERIENCE_BLOCK.some((phrase) => text.includes(phrase));
}

function isRelevant(job, _keywords) {
    // 1. Must have an India location
    if (!isIndiaJob(job)) return false;

    // 2. Title must not be senior-level
    if (hasSeniorTitle(job.title)) return false;

    // 3. Title must match an allow keyword
    if (!hasAllowKeyword(job.title)) return false;

    // 4. Must be posted within 24-48 hours
    if (!isWithin24Hours(job.posted)) return false;

    // 5. Description must not indicate years of experience (if available)
    if (!passesExperienceCheck(job)) return false;

    return true;
}

function filterJobs(jobs, keywords) {
    if (!Array.isArray(jobs)) return [];
    return jobs.filter((job) => isRelevant(job, keywords));
}

module.exports = { filterJobs, isRelevant };