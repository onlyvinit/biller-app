import express from 'express';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { generateToken, varifyownerRole, varifyToken } from '../utils/tokenUtils.js';
import User from '../models/User.js';

const router = express.Router();

// Register the user
router.post("/signup", async (req, res) => {
    try {
        const { name, password, confirmPassword, email, role } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            name,
            password: hashedPassword,
            email,
            role
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const loginUser = await User.findOne({ email });
        if (!loginUser) {
            return res.status(400).json({ message: "Invalid user" });
        }

        const passMatch = await comparePassword(password, loginUser.password);
        if (!passMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = generateToken(loginUser);
        res.json({
            token,
            user: {
                id: loginUser._id,
                name: loginUser.name,
                role: loginUser.role
            }
        });

    } catch (error) {
        res.status(400).json({ message: "Invalid credentials" });
    }
});

// Protected route - Only Owner Can Create Category
router.post("/", varifyToken, varifyownerRole, async (req, res) => {
    try {
        // Your category creation logic here
        res.status(201).json({ message: "Category created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all categories (Anyone logged in)
router.get("/", varifyToken, async (req, res) => {
    try {
        // Your category fetching logic here
        res.json({ categories: [] });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/me", varifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("name email role");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user details", error });
    }
});


export default router;
