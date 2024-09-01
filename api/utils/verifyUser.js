import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'


export const verifyToken = (req, res, next) => {
  // console.log('Cookies:', req.cookies)
  // console.log("Token: ", req.cookies.access_token)

  
  const token = req.cookies.access_token
  // console.log('Cookies:', req.cookies);
  // console.log('Token:', token);
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'))
  }
  
  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Anauthorized'))
    }
    req.user = user

    console.log('Token valid, user data:', user);
     // Ensure user ID in the token matches the ID in the request params
     if (req.params.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to perform this action" });
  }
    //req.user = { id: user._id, isAdmin: user.isAdmin }
    next()
  })
}