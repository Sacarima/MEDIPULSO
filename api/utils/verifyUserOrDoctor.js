import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'

// Middleware to verify if the user is either a user or a doctor
// This middleware checks the JWT token in the request cookies and verifies the user's role
// If the user is authenticated and has the role of 'user' or 'doctor', it
// attaches the user information to the request object and allows the request to proceed.  
export const verifyUserOrDoctor = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, "Unauthorized - No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return next(errorHandler(401, "Unauthorized - Invalid token"));
        }

        if (decoded.role === "user" || decoded.role === "doctor") {
            req.user = decoded;
            return next();
        }

        return next(errorHandler(403, "Forbidden - You are not authorized to perform this action"));
    });
};



