const cron = require("node-cron");

function startScheduler(task) {
    console.log("⏰ Scheduler Started");

    // Every 1 minute
    cron.schedule("* * * * *", async () => {
        console.log("\n====================================");
        console.log(`Running Job Scan : ${new Date().toLocaleString()}`);
        console.log("====================================");

        try {
            await task();
        } catch (err) {
            console.error("Scheduler Error:", err.message);
        }
    });
}

module.exports = startScheduler;