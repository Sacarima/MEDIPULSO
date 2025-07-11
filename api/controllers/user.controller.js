import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import User from '../models/user.model.js'


export const test = (req, res) => {
    res.send({message: 'Hello from the controller, API is working fine'})
}


// update use information
// This function allows users to update their own information
// It checks if the user is authorized to perform this action
// It validates the password length and strength
// It hashes the password before saving it to the database
// It returns the updated user information without the password field
// If the user is not authorized, it returns a 403 error
export const updateUser = async (req, res, next) => {
    
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
// This function retrieves user information for admin users
// It checks if the user is an admin before allowing access
// It supports pagination, sorting, and filtering of users
// It returns the total number of users, the number of users created in the last month,
// and the list of users without their password field
// If the user is not an admin, it returns a 403 error
// If there is an error during the process, it returns a 500 error
// The function uses the User model to interact with the database
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
            createdAt: { $gte: oneMonthAgo, $lt: now } 
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
// This function allows an admin to delete a user
// It checks if the user is authorized to perform this action
// If the user is an admin and not trying to delete themselves, it proceeds to delete the user
// If the user is not authorized, it returns a 403 error
// If there is an error during the deletion process, it returns a 500 error
// The function uses the User model to interact with the database
// It returns a success message upon successful deletion
// If the user is not found, it returns a 404 error
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