# Job Alert Bot

A multi-platform job aggregation and alerting system that monitors 250+ companies across 5 Applicant Tracking Systems (Workday, Greenhouse, Lever, Ashby, SmartRecruiters) and delivers real-time Discord notifications for entry-level tech roles in India.

## Features

- **Multi-ATS Integration** — unified fetcher/parser architecture supporting Workday, Greenhouse, Lever, Ashby, and SmartRecruiters APIs
- **Smart Filtering** — regex-based seniority detection, keyword allow/block lists, geo-location filtering, and 24-hour recency checks
- **Deduplication** — MongoDB atomic upsert-based dedup ensures exactly-once notification, even under concurrent scan cycles
- **Reliable Delivery** — Discord webhook integration with exponential backoff on rate limits (HTTP 429)
- **Continuous Monitoring** — cron-based polling every 60 seconds, 24/7 uptime via Oracle Cloud VM

## Tech Stack

- **Runtime:** Node.js
- **Database:** MongoDB (Mongoose ODM)
- **HTTP Client:** Axios
- **Scheduling:** node-cron
- **Notifications:** Discord Webhook API
- **Deployment:** Oracle Cloud Infrastructure (Ampere A1, Always Free tier), PM2

## Architecture

app.js Entrypoint — boots DB, runs initial scan, starts cron
src/
ats/
fetchJobs.js Routes fetch calls by company.ats
workday/ (index.js, parser.js)
greenhouse/ (index.js, parser.js)
lever/ (index.js, parser.js)
ashby/ (index.js, parser.js)
smartrecruiters/ (index.js, parser.js)
config/
companies.json List of monitored companies (ats, endpoint, baseUrl)
keywords.json Allow/block keyword lists
config.js Loads + validates companies.json / keywords.json
services/
monitor.js Per-company orchestration: fetch → parse → filter → dedupe → notify
filter.js Relevance filtering (seniority, keywords, location, recency)
deduplicate.js MongoDB-based dedup via atomic upsert
db/
mongo.js MongoDB connection
jobs.js Mongoose schema for seen jobs
notifier/
discord.js Discord webhook sender with retry/backoff
scheduler/
cron.js Cron job runner
discovery/ One-off scripts for finding + verifying new companies (not part of live app)


## Setup

### Prerequisites
- Node.js 18+
- MongoDB instance (Atlas or self-hosted)
- Discord server with a webhook configured

### Installation

```bash
git clone <repo-url>
cd job-scrapper
npm install
```

### Environment Variables

Create a `.env` file in the project root:

MONGO_URI=your_mongodb_connection_string
DISCORD_WEBHOOK=your_discord_webhook_url


### Running Locally

```bash
node app.js
```

This connects to MongoDB, runs an immediate scan across all companies in `companies.json`, then starts a 1-minute polling cycle.

## Adding Companies

Company entries live in `src/config/companies.json`. Each entry requires:

```json
{
  "company": "Example Corp",
  "ats": "workday | greenhouse | lever | ashby | smartrecruiters",
  "endpoint": "the ATS API endpoint",
  "baseUrl": "the ATS base URL"
}
```

Every entry in this project's dataset is verified against the live ATS API before being added — no unconfirmed or guessed endpoints.

## Filtering Logic

Jobs must pass all of the following to trigger a notification:
1. Location matches an India-based city or "remote"
2. Title does not match seniority-block terms (senior, staff, lead, manager, etc.)
3. Title matches at least one allow-keyword (SDE, full-stack, data engineer, etc.)
4. Posted within the last 24 hours
5. Description (where available) does not indicate 3+ years of required experience

## Deployment

Deployed on an Oracle Cloud **Always Free** Ampere A1 VM (genuinely always-on, no idle spin-down unlike serverless free tiers), managed via PM2 for process persistence and auto-restart on crash.

```bash
pm2 start app.js --name job-scrapper
pm2 save
pm2 startup
```

## Known Limitations

- Company discovery is a semi-automated, search-assisted process — not a fully autonomous crawler
- Some ATS platforms (Workday specifically) return relative date strings rather than timestamps, requiring string-pattern parsing for recency checks
- No web UI — notifications are Discord-only

## License

Personal project — not licensed for redistribution.
