const getAuthCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: (process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax")).toLowerCase(),
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
