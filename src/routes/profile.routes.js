const express = require("express");
const {
    getProfile,
    updateProfile,
    changePassword,
    updateSettings,
} = require("../controllers/profile.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/update", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.put("/settings", protect, updateSettings);

module.exports = router;
