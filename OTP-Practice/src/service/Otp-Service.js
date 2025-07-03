const OtpRepository = require("../repository/index.js");
const { sendEmail } = require("../service/Nodemailer-Service.js");
class OtpService {
  constructor() {
    this.otpRepoObj = new OtpRepository();
  }
  async generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  async sendOtp(userData) {
    try {
      const email = userData.email;
      const otp = await this.generateOTP();

      console.log("🔹 Generated OTP:", otp);

      const res = await sendEmail({ email, otp });
      console.log("📨 Email Response:", res); // ✅ Log the email response

      if (!res || res.status === "failed") {
        // Check if res is undefined or status is failed
        console.error(
          "❌ Email sending failed:",
          res?.error || "No response from sendEmail"
        );
        return { status: "failed", errorMessage: "Please enter a valid email" };
      }

      const response = await this.otpRepoObj.createUser({ email, otp });
      console.log("🛢️ DB Response:", response); // ✅ Log database response

      if (!response || response.status === "failed") {
        console.error(
          "❌ Database error:",
          response?.message || "No response from createUser"
        );
        return {
          status: "failed",
          message: "Database error while storing OTP",
        };
      } else {
        console.log("✅ Successfully stored Email and OTP");
        return { status: "successful", message: "OTP stored successfully" };
      }
    } catch (error) {
      console.error("❌ Error in sendOtp():", error);
      return {
        status: "failed",
        error: error.message,
        origin: "Otp-service -> sendOtp",
      };
    }
  }

  async validateOtp({ email, otp }) {
    try {
      // console.log(`${email}  ${otp}`);
      const response = await this.otpRepoObj.validateOtp({ email, otp });
      return response;
    } catch (error) {
      console.log("Error while validation: "); 
      return {
        status: "failed",
        error: error,
        origin: "Otp-service -> validateOtp",
      };
    }
  }
  async deleteAllOtp() {
    try{
      const response = await this.otpRepoObj.deleteAllOtp() ; 
      return response ; 
    }
    catch(err){
      console.log("Error while deleting All Otp"); 
      return {status: "failed", error: error, origin:"Otp-service->deleteAllOtp"} ; 
    }
  }
  async deleteOneOtp(userData){ // for forgot password.
    try{
      const response = await this.otpRepoObj.deleteOneOtp(userData) ; 
      return response ; 
    }
    catch(err){
      return {status: "failed", error: error, origin:"Otp-service->deleteOneEmail"} ;  
    }
  }
}


module.exports = OtpService;
