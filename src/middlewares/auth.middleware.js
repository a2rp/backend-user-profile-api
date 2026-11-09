const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, no token found",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
        } catch {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }

        if (typeof decoded.userId !== "string" || !mongoose.isValidObjectId(decoded.userId) || !Number.isInteger(decoded.tokenVersion)) {
            return res.status(401).json({
                message: "Not authorized, invalid token",
            });
        }

        const user = await User.findById(decoded.userId).select("+tokenVersion");

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        if (decoded.tokenVersion !== user.tokenVersion) return res.status(401).json({ message: "Not authorized, session expired" });

        req.user = user;
        next();
    } catch (error) {
        return next(error);
    }
};

module.exports = protect;
