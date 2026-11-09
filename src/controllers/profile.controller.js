const User = require("../models/user.model");
const generateToken = require("../utils/token");
const publicUser = require("../utils/publicUser");
const { getAuthCookieOptions } = require("../utils/cookieOptions");

const isValidPhone = (phone) => /^(?=.*\d)[0-9+()\-\s]{7,20}$/.test(phone);

const getProfileUpdates = (body, allowName) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "A JSON object is required" };
    const allowedFields = allowName ? ["name", "bio", "phone"] : ["bio", "phone"];
    const suppliedFields = allowedFields.filter(
        (field) => body[field] !== undefined,
    );

    if (suppliedFields.length === 0) {
        return { error: "At least one profile field is required" };
    }

    const updates = {};

    if (allowName && body.name !== undefined) {
        if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.trim().length > 100) {
            return { error: "Name must contain 2 to 100 characters" };
        }

        updates.name = body.name.trim();
    }

    if (body.bio !== undefined) {
        if (typeof body.bio !== "string" || body.bio.length > 500) {
            return { error: "Bio must be a string up to 500 characters" };
        }

        updates.bio = body.bio.trim();
    }

    if (body.phone !== undefined) {
        if (
            typeof body.phone !== "string" ||
            (body.phone.trim() && !isValidPhone(body.phone.trim()))
        ) {
            return { error: "Phone number format is invalid" };
        }

        updates.phone = body.phone.trim();
    }

    return { updates };
};

const getProfile = async (req, res) => {
    return res.status(200).json({
        message: "Profile fetched successfully",
        user: publicUser(req.user),
    });
};

const updateProfile = async (req, res) => {
    try {
        const { updates, error } = getProfileUpdates(req.body || {}, true);

        if (error) {
            return res.status(400).json({ message: error });
        }

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: publicUser(user),
        });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ message: "Invalid profile data" });
        }

        return res.status(500).json({ message: "Failed to update profile" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body || {};

        if (
            typeof currentPassword !== "string" ||
            typeof newPassword !== "string" ||
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                message: "Current password and new password are required",
            });
        }

        if ([...newPassword].length < 8 || Buffer.byteLength(newPassword, "utf8") > 72) {
            return res.status(422).json({ message: "New password must contain at least 8 characters and no more than 72 UTF-8 bytes" });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                message: "New password must be different from the current password",
            });
        }

        const user = await User.findById(req.user._id).select("+password +tokenVersion");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!(await user.comparePassword(currentPassword))) {
            return res
                .status(401)
                .json({ message: "Current password is incorrect" });
        }

        user.password = newPassword;
        user.tokenVersion += 1;
        await user.save();

        res.cookie("token", generateToken(user._id, user.tokenVersion), getAuthCookieOptions());

        return res.status(200).json({
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Password change failed:", error);
        return res.status(500).json({ message: "Failed to change password" });
    }
};

const updateSettings = async (req, res) => {
    try {
        const { updates, error } = getProfileUpdates(req.body || {}, false);

        if (error) {
            return res.status(400).json({ message: error });
        }

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Account settings updated successfully",
            user: publicUser(user),
        });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ message: "Invalid account settings" });
        }

        return res
            .status(500)
            .json({ message: "Failed to update account settings" });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    updateSettings,
};
