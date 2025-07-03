const nodemailer = require("nodemailer");
  const { EMAIL, PASSWORD } = require("../config/index");

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
        user: EMAIL,
        pass: PASSWORD,
    },
});

const sendEmail = async ({ email, otp }) => {
    try {
        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: "OTP Verification",
            text: `Your OTP: ${otp}  
            - By Accendancy`,
        };

        console.log("📩 Sending OTP to:", email);

        let info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info);

        return { status: "successful" };
    } catch (err) {
        console.error("❌ Email sending failed:", err.message);
        return { status: "failed", error: err.message };
    }
};

module.exports = { sendEmail };