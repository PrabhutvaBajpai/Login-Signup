// This layer is just like a waiter it is not doing anything 
// it is only taking the input from the user and sending it 
// to the chef inside the kitchen.
const OtpService = require("../service/Otp-Service.js");
 
const obj = new OtpService() ; 

const sendOtp = async (req, res) => {
    try {
        const userData = req.query.email ? { email: req.query.email } : req.body;
        console.log("Received Data:", userData);

        const response = await obj.sendOtp(userData); 
        console.log("Service Response:", response);
        return res.json({ response }); 
    } catch (error) {
        console.error("Error in Controller -> sendOtp:", error);
        return res.status(500).json({ 
            status: "failed",
            error: error.message || "Unknown error",  
            stack: error.stack,  
            origin: "Controller -> sendOtp" 
        }); 
    }
};


const validateOtp = async(req,res) => {
    try {
        const userData = req.body; 
        const response = await obj.validateOtp(userData); 
        return res.json({response}); 
    } catch (error) {
        console.log("Validation Failed", error); 
        return res.json({status:"failed" , error:error , origin:"Controller -> validateOtp"});
    }
}

const deleteOneOtp = async(req,res) => {
    try {
        const userData = req.body; 
        const response = obj.deleteOneOtp(userData); 
        return res.json({response});
    } catch (error) {
        return res.json({status: "failed", error: error , origin:"Controller -> deleteOtp" }) ; 
    }
}

module.exports = {sendOtp,validateOtp,deleteOneOtp} ; 