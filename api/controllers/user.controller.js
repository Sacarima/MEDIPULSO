import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import User from '../models/user.model.js'


export const test = (req, res) => {
    res.send({message: 'Hello from the controller, API is working fine'})
}


// logout user
export const logout = async (req, res) => {
    try {
        res
            .clearCookie('access_token')
            .status(200)
            .json({ message: 'User has been signed out' })
    } catch (error) {
        res.status(500).json({ message: errorHandler(error) })
    }
}