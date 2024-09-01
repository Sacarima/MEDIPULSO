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

// update use information
export const updateUser = async (req, res, next) => {
    // check if the user is authorized to perform this action 
    console.log('User ID from Token:', req.user.id);
    console.log('User ID from Params:', req.params.userId);
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not authorized to perform this action'))
    }

    // password strength and length validation
    if(req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters long'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    email: req.body.email,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phoneNumber: req.body.phoneNumber
                },
            },
            { new: true }
        )
        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(errorHandler(500, 'Failed to update user information'))
    }

}

// get user information
export const getUser = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not authorized to perform this action'))
    }
    try {

        // pagination
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.sort || 'asc' ? 1 : -1

        // get all users
       const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit)
        
        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc
            return rest
        })

        const totalUsers = await User.countDocuments()

        const now = new Date()

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo, $lt: now } // Check this /* $ l t */ might the cause for the error
        })

        res.status(200).json({
            totalUsers,
            lastMonthUsers,
            users: usersWithoutPassword
        })

    } catch (error) {
        next(errorHandler(500, 'Failed to get user information'))
    }
}

// delete user

export const deleteUser = async (req, res, next) => {
    // check if the user is authorized to perform this action
    if (req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not authorized to delete this user'))
    }

    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json({ message: 'User has been deleted' })
    } catch (error) {
        next(errorHandler(500, 'Failed to delete user'))
    }
}