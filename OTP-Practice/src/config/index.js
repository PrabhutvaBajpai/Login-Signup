const dotenv = require("dotenv"); 
dotenv.config() ; 
// console.log(process.env.PORT); 
// console.log(process.env.SMTP_EMAIL); 
module.exports = {
    EMAIL : process.env.SMTP_EMAIL ,
    PASSWORD : process.env.SMTP_PASSWORD ,
    PORT : process.env.PORT
}
