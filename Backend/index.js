import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/userSchema.js";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ ROUTES
app.post("/user", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ response: { status: 'successful' }, user });
  } catch (error) {
    console.error("Error in /user POST:", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/resetPassword", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ response: { status: "successful" }, user });
  } catch (error) {
    console.error("Error in /resetPassword POST:", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.status(200).json({
      response: { status: 'successful' },
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Error in /login POST:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Protected Route Example
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/user/:email",async(req,res)=>{
  try{
    const user = await User.findOne({ email: req.params.email });
    if(!user) return res.status(404).json({message: "User not found"});
    res.status(200).json(user);
  }
  catch(error){
    res.status(500).json({message: error.message }); 
  }
})

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Start the server
app.listen(5001, () => {
  console.log("🚀 Server started at http://localhost:5001");
});
