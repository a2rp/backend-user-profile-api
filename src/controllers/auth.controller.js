const User = require("../models/user.model");
const generateToken = require("../utils/token");
const publicUser = require("../utils/publicUser");
const {
    getAuthCookieOptions,
    getClearCookieOptions,
} = require("../utils/cookieOptions");

const normalizeEmail = (email) => email.trim().toLowerCase();

const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Name, email, and password are required",
            });
        }

        const normalizedEmail = normalizeEmail(email);

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "A valid email is required" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
        });

        res.cookie("token", generateToken(user._id), getAuthCookieOptions());

        return res.status(201).json({
            message: "User registered successfully",
            user: publicUser(user),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }

        return res.status(500).json({ message: "Registration failed" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const normalizedEmail = normalizeEmail(email);

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "A valid email is required" });
        }

        const user = await User.findOne({ email: normalizedEmail });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.cookie("token", generateToken(user._id), getAuthCookieOptions());

        return res.status(200).json({
            message: "Login successful",
            user: publicUser(user),
        });
    } catch (error) {
        return res.status(500).json({ message: "Login failed" });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie("token", getClearCookieOptions());

    return res.status(200).json({ message: "Logout successful" });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};
