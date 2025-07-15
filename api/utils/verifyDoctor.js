import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {

    // Extract token from cookies
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, 'Unauthorized - No token provided'));
    }

    try {
        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

        //  Ensure the user is a doctor
        if (decoded.role !== 'doctor') {
            return next(errorHandler(403, 'Forbidden - You are not a doctor'));
        }

        // Attach user ID from token to request
        req.user = decoded;

        // Ensure the doctor is updating their own profile
        const tokenDoctorId = req.user.id || req.user._id;
        if (tokenDoctorId !== req.params.doctorId) {
            return next(errorHandler(403, 'You are not authorized to perform this action'));
        }
        
        ;
        next();
    } catch (error) {
        return next(errorHandler(401, 'Unauthorized - Invalid token'));
    }
};






