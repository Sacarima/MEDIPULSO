import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyUserOrDoctor = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    // Preserve existing status + pattern, but clearer message
    return next(errorHandler(401, 'Unauthorized - No token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
    if (err) {
      // Distinguish token states without changing  error pipeline
      if (err.name === 'TokenExpiredError') {
        return next(errorHandler(401, 'Unauthorized - Token expired'));
      }
      return next(errorHandler(401, 'Unauthorized - Invalid token'));
    }

    // Gate: only "user" or "doctor" are allowed here (unchanged behavior)
    if (decoded?.role === 'user' || decoded?.role === 'doctor') {
      // Backward-compatible attachment 
      req.user = decoded;

      // normalized auth info for downstream use
      // exp is seconds since epoch as per JWT spec
      req.auth = {
        id: decoded.id,
        role: decoded.role,
        exp: decoded.exp,
      };

      return next();
    }

    // Role is authenticated but not permitted by this specific middleware
    return next(
      errorHandler(403, 'Forbidden - You are not authorized to perform this action')
    );
  });
};
