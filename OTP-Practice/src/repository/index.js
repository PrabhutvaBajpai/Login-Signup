const Clinik =  require("../models/product.model.js"); // Ensure the correct path to your model

class OtpRepository {
    async createUser({ email, otp }) {
        try {
            // Delete existing OTP entry if it exists
            await Clinik.deleteOne({ email });

            // Store the new OTP
            const newClinik = new Clinik({email : email,otp : otp}) ; 
            // const response = await Clinik.create({ email, otp });
            await newClinik.save() ; 

            return { status: "successful", response: "OTP created" };
        } catch (error) {
            return { status: "failed", message: "Database error", error: error.message };
        }
    }

    async validateOtp({ email, otp }) {
        try {
            const storedData = await Clinik.findOne({ email });

            if (!storedData) {
                return { isExist: false, response: null };
            }

            if (storedData.otp === otp) {
                return { status: "successful", otp: "matched" };
            }

            return { status: "failed", otp: "not matched" };
        } catch (error) {
            console.log("Validation Error: ", error.message) ; 
            return { status: "Validation failed", error: error.message, origin: "Repo -> validateOtp" };
        }
    }

    async deleteAllOtp(){
        try{
            const res = await Clinik.deleteMany() ; 
            return {status: "successful", message: res.message} ; 
        }
        catch(err){
            return {status: "failed", message: res.message, origin: "Repo-> deleteAllOtp"} ; 
        }
        
    }

    async deleteOneOtp({email,otp}){
        try{
            const storedData = Clinik.findOne({}) ; 
            if(!storedData){
                return {status:"failed",message:"Your Email is not present",origin: "Repo->deleteOneEmail"} ; 
            }
            const res = Clinik.deleteOne({email}) ; 
            return {status: "successful", message: res.message} ; 
        }
        catch(err){
            return {status: "failed", message: err.message, origin: "Repo->deleteOneEmail"} ; 
        }  
    }
}

module.exports = OtpRepository;
