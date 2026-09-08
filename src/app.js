const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const apiResponse = require("./middlewares/api-response.middleware");
const requestLogger = require("./middlewares/request-logger.middleware");

const app = express();

app.disable("x-powered-by");
app.use(apiResponse);
app.use(requestLogger);
app.use(helmet());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 200,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        message: { message: "Too many requests, please try again later" },
    }),
);
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        credentials: true,
    }),
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({ message: "User Profile API is running" });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "user-profile-api",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    console.error(`[API] ${req.method} ${req.originalUrl} error:`, error.message);

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Malformed JSON request body" });
    }

    return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
