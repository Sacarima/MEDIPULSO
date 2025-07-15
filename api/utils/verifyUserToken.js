import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'

export const verifyUserToken = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        return next(errorHandler(401, 'Unauthorized - No token provided'))
    }

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, user) => {
        if (err) {
            return next(errorHandler(401, 'Unauthorized - Invalid token'))
        }
        req.user = user
        next()
    })
}

