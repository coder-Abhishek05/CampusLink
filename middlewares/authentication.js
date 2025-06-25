

const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName){
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue){
            return next(); // Proceed if no cookie is found
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload; // Attach user payload to req
        } catch (error) {
            console.error("Token validation failed:", error.message);
            // Optionally redirect or return an unauthorized status
            return res.status(401).json({ message: "Invalid token. Please log in again." });
        }
        return next(); // Proceed if validation succeeds
    };
}

module.exports = {
    checkForAuthenticationCookie,
};