const express = require("express");
const { rateLimit } = require("express-rate-limit");
const {
    getProfile,
    updateProfile,
    changePassword,
    updateSettings,
} = require("../controllers/profile.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();
const profileChangeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many profile changes. Try again later." },
});

router.get("/", protect, getProfile);
router.put("/update", protect, profileChangeLimiter, updateProfile);
router.put("/change-password", protect, profileChangeLimiter, changePassword);
router.put("/settings", protect, profileChangeLimiter, updateSettings);

module.exports = router;
