import bcrypt from "bcryptjs";
import User from "../model/userModel.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

 
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User with this email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    req.session.userId = user._id;

    res.send("User logged in successfully");
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in");
  }
};
export const getProfile = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).send("Unauthorized: Please log in");
    }

    const user = await User.findById(req.session.userId).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Error fetching profile");
  }
};

// Logout User
export const logoutUser = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).send("Error logging out");
      }

      res.clearCookie("connect.sid");
      res.send("Logged out successfully");
    });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).send("Error logging out");
  }
};
