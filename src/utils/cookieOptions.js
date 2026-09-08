const getBoolean = (value, fallback) => {
    if (value === undefined) {
        return fallback;
    }

    return value.toLowerCase() === "true";
};

const getAuthCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: getBoolean(process.env.COOKIE_SECURE, isProduction),
        sameSite:
            process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax"),
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
};

const getClearCookieOptions = () => {
    const { maxAge, ...options } = getAuthCookieOptions();
    return options;
};

module.exports = {
    getAuthCookieOptions,
    getClearCookieOptions,
};
