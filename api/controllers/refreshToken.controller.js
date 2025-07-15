import jwt from 'jsonwebtoken'
import RefreshToken from '../models/refreshToken.model.js';
import { authConfig } from '../config/auth.config.js';

export const refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
  
    if (!requestToken) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }
  
    try {
      const refreshTokenDoc = await RefreshToken.findOne({ token: requestToken });
      if (!refreshTokenDoc) {
        return res.status(403).json({ message: "Refresh token is not in database!" });
      }
  
      // Check if the refresh token is expired
      if (RefreshToken.verifyExpiration(refreshTokenDoc)) {
        await RefreshToken.findByIdAndRemove(refreshTokenDoc._id);
        return res.status(403).json({
          message: "Refresh token was expired. Please sign in again."
        });
      }
  
      // If the refresh token is valid, generate a new access token
      const newAccessToken = jwt.sign(
        { _id: refreshTokenDoc.user },
        authConfig.secret,
        { expiresIn: authConfig.jwtExpiration }
      );
  
      // Optionally, update the cookie with the new access token
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
  
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshTokenDoc.token,
      });
    } catch (err) {
      console.error("Error in refreshToken:", err);
      return res.status(500).json({ message: err.message });
    }
  }