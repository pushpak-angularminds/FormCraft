const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User.js"); // Assuming the User model is in the `models` folder
const Form = require("../models/Form.js");
const router = express.Router();

// Signup route
router.post("/sign-up", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('req.body', req.body);

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration." });
  }
});

// Sign-in route
router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Respond with user data (excluding the password)
    const { password: _, ...userData } = user.toObject(); // Remove password from the response
    res.status(200).json({ message: "Sign-in successful!", user: userData });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during sign-in." });
  }
});



module.exports = router;



