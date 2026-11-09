const requestLogger = (req, res, next) => {
    res.on("finish", () => {
        console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode}`);
    });

    next();
};

module.exports = requestLogger;
