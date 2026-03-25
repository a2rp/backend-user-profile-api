const User = require("../models/user.model");

const getProfile = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Profile fetched successfully",
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, bio, phone } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.name = name || user.name;
        user.bio = bio !== undefined ? bio : user.bio;
        user.phone = phone !== undefined ? phone : user.phone;

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                phone: user.phone,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update profile",
            error: error.message,
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isPasswordMatched = await user.comparePassword(currentPassword);

        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Current password is incorrect",
            });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            message: "Password changed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to change password",
            error: error.message,
        });
    }
};

const updateSettings = async (req, res) => {
    try {
        const { bio, phone } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.bio = bio !== undefined ? bio : user.bio;
        user.phone = phone !== undefined ? phone : user.phone;

        await user.save();

        return res.status(200).json({
            message: "Account settings updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                phone: user.phone,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update account settings",
            error: error.message,
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    updateSettings,
};
