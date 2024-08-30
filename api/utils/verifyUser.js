import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'


export const verifyToken = (req, res, next) => {
  console.log('Cookies:', req.cookies)
  console.log("Token: ", req.cookies.access_token)
  const token = req.cookies.access_token
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'))
  }
  
  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized'))
    }
    //req.user = user
    req.user = { id: user._id, isAdmin: user.isAdmin }
    next()
  })
}