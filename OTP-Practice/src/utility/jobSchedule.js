const cron = require("node-cron");
const OtpService = require("../service/Otp-Service");
const obj = new OtpService();

const scheduleJobs = () => {
    console.log("Jobs scheduled......");

    // Run every 5 minute
    cron.schedule("*/5 * * * *", async () => {
        try {
            const response = await obj.deleteAllOtp() ; 
            console.log("📨 Cron Job Response:", response);
        } catch (error) {
            console.error("❌ Error in cron job:", error);
        }
    });
};

module.exports = scheduleJobs;
