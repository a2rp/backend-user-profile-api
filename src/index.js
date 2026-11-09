const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = require("./app");

const validateEnvironment = () => {
    const missing = ["MONGO_URI", "JWT_SECRET"].filter((name) => !process.env[name]);
    if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    const secret = process.env.JWT_SECRET.trim();
    if (secret.length < 32) throw new Error("JWT_SECRET must contain at least 32 characters");
    if (/^(replace_with|change_me|your[_-])/i.test(secret)) throw new Error("Replace the example JWT_SECRET with a unique random secret");
    const origins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "").split(",").map((origin) => origin.trim()).filter(Boolean);
    if (process.env.NODE_ENV === "production" && origins.length === 0) throw new Error("CLIENT_ORIGINS must be configured in production");
    const sameSite = (process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === "production" ? "none" : "lax")).toLowerCase();
    if (!["strict", "lax", "none"].includes(sameSite)) throw new Error("COOKIE_SAME_SITE must be strict, lax, or none");
    if (sameSite === "none" && process.env.NODE_ENV !== "production") throw new Error("COOKIE_SAME_SITE=none requires production Secure cookies");
    if (process.env.PORT !== undefined) {
        const port = Number(process.env.PORT);
        if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be an integer from 1 to 65535");
    }
};

const startServer = async () => {
    try {
        validateEnvironment();
        await connectDB();
        const port = process.env.PORT === undefined ? 1198 : Number(process.env.PORT);
        app.listen(port, () => console.log(`[API] Server running on port ${port}`));
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exitCode = 1;
    }
};

if (require.main === module) startServer();
module.exports = { app, startServer, validateEnvironment };
