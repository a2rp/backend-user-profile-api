const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = require("./app");

const requiredEnvironmentVariables = ["MONGO_URI", "JWT_SECRET"];
const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
    (name) => !process.env[name],
);

if (missingEnvironmentVariables.length > 0) {
    console.error(
        `Server startup failed: Missing required environment variables: ${missingEnvironmentVariables.join(", ")}`,
    );
    process.exitCode = 1;
} else {
    const PORT = Number(process.env.PORT) || 1198;

    const startServer = async () => {
        try {
            await connectDB();
            app.listen(PORT, () => {
                console.log(`[API] Server running on port ${PORT}`);
            });
        } catch (error) {
            console.error("Server startup failed:", error.message);
            process.exitCode = 1;
        }
    };

    startServer();
}
