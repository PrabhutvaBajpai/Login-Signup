const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // Converts email to lowercase before saving
            match: [
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 
                "Please enter a valid email address"
            ]
        },
        otp: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true // Automatically manages createdAt and updatedAt fields
    }
);

const Clinik = mongoose.model('Clinik', productSchema);
module.exports = Clinik;
