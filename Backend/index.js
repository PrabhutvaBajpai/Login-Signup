import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/userSchema.js";
import cors from "cors";

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
    const user = new User({ name, email, password });
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

    user.password = password;
    await user.save();
    res.status(200).json({ response: { status: "successful" }, user });
  } catch (error) {
    console.error("Error in /resetPassword POST:", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.status(200).json({ response: { status: 'successful' }, user });
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
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password },
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
