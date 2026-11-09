const jwt = require("jsonwebtoken");

const generateToken = (userId, tokenVersion = 0) =>
    jwt.sign({ userId, tokenVersion }, process.env.JWT_SECRET, { expiresIn: "7d", algorithm: "HS256" });

module.exports = generateToken;
