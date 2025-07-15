import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'


export const verifyToken = (req, res, next) => {

  
  const token = req.cookies.access_token
  
  if (!token) {
    return next(errorHandler(401, 'Unauthorized - No toekn provided'))
  }
  
  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized - Invalid token'))
    }
    req.user = user

     // Ensure user ID in the token matches the ID in the request params
     if (req.params.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to perform this action" })
  }
    
    next()
  })
}

