import { expressjwt as jwt } from 'express-jwt';

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: "payload",
    getToken: getTokenFromHeaders,
});

function getTokenFromHeaders(req) {
    // Check if the token is available on the request Headers
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        // Get the encoded token string and return it
        const token = req.headers.authorization.split(" ")[1];
        // console.log('Token JWT:', token);
        return token;
    }

    return null;
}

export { isAuthenticated };