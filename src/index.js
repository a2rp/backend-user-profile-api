const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

app.get("/", (req, res) => {
    res.json({
        message: "User Profile API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 1201;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
