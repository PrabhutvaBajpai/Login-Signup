const express = require("express") ; 
const app = express();
const {sendOtp,validateOtp,deleteOneOtp} = require("../controller/index.js");
const {PORT} = require("../config/index.js"); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
const scheduleJobs=require("../utility/jobSchedule.js")
const cors = require("cors"); 
const connectDB = require("../config/db.js");
const allowedOrigins = ["http://localhost:5173"]; 
// Here we will create 3 functionalities:
    // Send OTP to the user. 
    // Take OTP from the user and email and check if the OTP is correct or not.
    // Delete OTP from the database.
app.use(
    cors({
        origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
        },
    })
);

app.get('/',(req,res)=>{console.log("Yes")});
app.post('/sendOtp',sendOtp);
app.post("/validateOtp",validateOtp);
app.get('/deleteOneOtp',deleteOneOtp); 

app.listen(PORT,(req,res)=>{
    connectDB() ; 
    scheduleJobs() ; 
    console.log(`Server is running on PORT ${PORT}`);
})