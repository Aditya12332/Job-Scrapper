const axios = require("axios");

async function sendDiscord(message) {

    const webhook = process.env.DISCORD_WEBHOOK;

    if (!webhook) {
        throw new Error("Discord webhook missing.");
    }

    try {

        await axios.post(webhook, {
    embeds: [
        {
            title: "🚀 Job Alert",

            description: message,

            color: 5814783,

            timestamp: new Date()
        }
    ]
});

        console.log("Discord notification sent.");

    } catch (err) {

        console.error(err.response?.data || err.message);

    }

}

module.exports = sendDiscord;