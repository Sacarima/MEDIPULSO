import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'


export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) return next(errorHandler(401, "Unauthorized.")) 
    
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
        if (err) return next(errorHandler(401, "Unauthorized - Invalid token"))
        if (decoded.role !== "admin") return next(errorHandler(403, "Forbidden - Admins only."))
            
        req.admin = decoded
        next()
    })
    
}