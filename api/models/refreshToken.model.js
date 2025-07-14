import mongoose from "mongoose"
import { v4 as uuidv4 } from "uuid"
import { authConfig } from "../config/auth.config.js"

const RefreshTokenSchema = new mongoose.Schema({
    token: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "DoctorForm" }, 
    expiryDate: { type: Date },
})

// Static method to create a new refresh token for a user
RefreshTokenSchema.statics.createToken = async function (user) {
    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + authConfig.jwtRefreshExpiration);
  
    const _token = uuidv4();
    const _object = new this({
      token: _token,
      user: user._id,
      expiryDate: expiredAt,
    });
  
    const refreshToken = await _object.save();
    return refreshToken.token;
  }

  // Static method to check if a refresh token is expired
RefreshTokenSchema.statics.verifyExpiration = (tokenDoc) => {
    return tokenDoc.expiryDate.getTime() < new Date().getTime()
  }
  
  const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema)
  export default RefreshToken