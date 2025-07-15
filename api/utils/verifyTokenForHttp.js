import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyTokenForHttp = (req, res, next) => {
  // Retrieve the token from the cookie or headers
  const token = req.cookies.access_token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  
  if (!token) {
    return next(errorHandler(401, "Access Denied. No token provided."));
  }

  try {
    // Verify the provided token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

    req.doctor = decoded; // Attach decoded doctor info to the request
    next()
  } catch (error) {
    console.error("JWT verification error:", error)
    return next(errorHandler(403, "Invalid token."))
  }
}