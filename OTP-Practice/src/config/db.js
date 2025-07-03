const dotenv = require('dotenv') ; 
dotenv.config() ; 
const mongoose = require("mongoose") ; 
const connectDB = async()=>{
    try{
        console.log(`${process.env.STRING} `) ;
        const conn = await mongoose.connect(process.env.STRING) ; 
         
        console.log( `MongoDB connected: `) ; 
    }
    catch(error){
        console.log(error) ; 
        return {status:"failed",error:error,origin:'config.js'} ; 
        // process.exit(1) ; 
    }
}
module.exports = connectDB ; 
// connectDB() ; 