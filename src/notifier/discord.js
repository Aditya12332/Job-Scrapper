const axios = require("axios");

// Simple rate-limit-aware sender: respects retry_after from Discord
async function sendWithRetry(webhook, payload, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            await axios.post(webhook, payload);
            return true;
        } catch (err) {
            if (err.response?.status === 429) {
                const retryAfter = (err.response.data?.retry_after || 1) * 1000;
                console.warn(`⏳ Discord rate limited — waiting ${retryAfter}ms`);
                await new Promise((r) => setTimeout(r, retryAfter + 200));
            } else {
                console.error("Discord Error:", err.response?.data || err.message);
                return false;
            }
        }
    }
    console.error(`❌ Discord: failed after ${retries} retries for job`);
    return false;
}

async function sendDiscord(job) {
    const webhook = process.env.DISCORD_WEBHOOK;
    if (!webhook) throw new Error("DISCORD_WEBHOOK is missing in .env");

    const payload = {
        embeds: [
            {
                title: "🚀 New Job Alert",
                color: 5763719,
                fields: [
                    { name: "🏢 Company", value: job.company, inline: true },
                    { name: "💼 Role", value: job.title, inline: true },
                    { name: "📍 Location", value: job.location || "Not specified", inline: true },
                    { name: "⏰ Posted", value: job.posted || "Unknown", inline: true },
                    { name: "🔗 Apply", value: job.url, inline: false }
                ],
                timestamp: new Date().toISOString(),
                footer: { text: "Job Alert Bot" }
            }
        ]
    };

    const sent = await sendWithRetry(webhook, payload);
    if (sent) console.log(`✅ Discord notification sent -> ${job.title}`);
}

module.exports = sendDiscord;