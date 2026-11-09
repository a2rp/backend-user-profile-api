const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const generateToken = require("../utils/token");
const publicUser = require("../utils/publicUser");
const {
    getAuthCookieOptions,
    getClearCookieOptions,
} = require("../utils/cookieOptions");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateCredentials = ({ name, email, password }, registration = false) => {
    if (registration && (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100)) return "Name must contain 2 to 100 characters";
    if (typeof email !== "string" || email.trim().length > 254 || !emailPattern.test(email.trim())) return "A valid email is required";
    if (typeof password !== "string" || [...password].length < 8 || Buffer.byteLength(password, "utf8") > 72) {
        return "Password must contain at least 8 characters and no more than 72 UTF-8 bytes";
    }
    return null;
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        const validationError = validateCredentials({ name, email, password }, true);
        if (validationError) return res.status(422).json({ message: validationError });
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
        });

        res.cookie("token", generateToken(user._id, user.tokenVersion), getAuthCookieOptions());

        return res.status(201).json({
            message: "User registered successfully",
            user: publicUser(user),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }

        console.error("Registration failed:", error);
        return res.status(500).json({ message: "Registration failed" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const validationError = validateCredentials({ email, password });
        if (validationError) return res.status(422).json({ message: validationError });
        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password +tokenVersion");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.cookie("token", generateToken(user._id, user.tokenVersion), getAuthCookieOptions());

        return res.status(200).json({
            message: "Login successful",
            user: publicUser(user),
        });
    } catch (error) {
        console.error("Login failed:", error);
        return res.status(500).json({ message: "Login failed" });
    }
};

const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (token) {
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
            } catch {
                decoded = null;
            }
            if (
                typeof decoded?.userId === "string" &&
                mongoose.isValidObjectId(decoded.userId) &&
                Number.isInteger(decoded.tokenVersion) &&
                decoded.tokenVersion >= 0
            ) {
                const versionFilter = decoded.tokenVersion === 0
                    ? { $or: [{ tokenVersion: 0 }, { tokenVersion: { $exists: false } }] }
                    : { tokenVersion: decoded.tokenVersion };
                await User.findOneAndUpdate(
                    { _id: decoded.userId, ...versionFilter },
                    { $inc: { tokenVersion: 1 } },
                );
            }
        }
        res.clearCookie("token", getClearCookieOptions());
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout failed:", error);
        res.clearCookie("token", getClearCookieOptions());
        return res.status(500).json({ message: "Logout failed" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};
