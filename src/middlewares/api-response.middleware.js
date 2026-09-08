const apiResponse = (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = (payload) => {
        const apiUrl = req.originalUrl;

        if (payload && typeof payload === "object" && !Array.isArray(payload)) {
            const { apiUrl: ignoredApiUrl, ...body } = payload;
            return originalJson({ apiUrl, ...body });
        }

        return originalJson({ apiUrl, data: payload });
    };

    next();
};

module.exports = apiResponse;
