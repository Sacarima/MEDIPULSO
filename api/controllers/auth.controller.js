import User from '../models/user.model.js'
import Doctor from '../models/doctor.model.js'
import Clinic from '../models/clinic.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'


//Create a new user
export const signup = async (req, res, next) => { 
    // Get the user data from the request body
    const { username, email, password } = req.body
    // Validate the request body
    if (
        !username || 
        !email || 
        !password || 
        username === '' || 
        email === '' || 
        password === ''
    ) {
        next(errorHandler(400, 'Please fill in all fields'))
    }

    // check for duplicate email
    const user = await User.findOne({
        email
    })
    if (user) {
        next(errorHandler(400, 'User already exists'))
    }
    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10)

    //  Check if the user already exists in the database
    const newUser = new User({
        username, 
        email, 
        password: hashedPassword // save the hashed password
    })

    // Save the new user
    try {
        await newUser.save()
        res.status(201).json('User created successfully')

    } catch (error) {
        next(error)
    }

    
}

// create a Doctor 
export const signupDoctor = async (req, res, next) => {
    const { 
        name, 
        email, 
        password, 
        specialty, 
        location,
        experience,
        medicalCategory,
        profilePicture
    } = req.body

    // create an array of required fields
    const requiredFields = {
         name, 
         email, 
         password, 
         specialty, 
         location, 
         experience, 
         medicalCategory
    }

    // check if any of the required fields is missing
    // const missingField = Object.entries(requiredFields).find(([key, value])=> !value || value.trim() === '')
    // if (missingField) {
    //     const [fieldName] = missingField
    //     next(errorHandler(400, `The field ${fieldName} is required and cannot be empty`))
    
    // }
    const missingField = Object.entries(requiredFields).find(([key, value]) => !value || value.trim() === '');
    if (missingField) {
        const [fieldName] = missingField;
        return next(errorHandler(400, `The field '${fieldName}' is required and cannot be empty`));
    }

    

        try {
            // check if the email is already in use
             const existingDoctor = await Doctor.findOne({ email })
             if (existingDoctor) {
            return  next(errorHandler(400, 'Email already in use'))
        }

        // hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newDoctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            specialty,
            location,
            experience,
            medicalCategory,
            profilePicture
        })
        // save the doctor to the database
        const savedDoctor = await newDoctor.save()
        
        // generate JWT token for the doctor
        const token = jwt.sign({
            _id: savedDoctor._id
        }, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' })
        // return a success message
           res.status(201).json('Doctor created successfully')
        } catch (error) {
            next(error)
        }
}

// Create a new clinic
export const signupClinic = async (req, res, next) => {
    const {
        facilityName,
        employeeStrength,
        location,
        programUsed,
        position,
        name,
        email,
        phoneNumber,
        password

    } = req.body
    if ( !facilityName || 
        !employeeStrength || 
        !location || 
        !programUsed || 
        !position || 
        !name || 
        !email || 
        !phoneNumber || 
        !password || 
        facilityName === '' || 
        employeeStrength === '' || 
        location === '' || 
        programUsed === '' || 
        position === '' || 
        name === '' || 
        email === '' || 
        phoneNumber === '' || 
        password === ''
    ) {
        return next(errorHandler(400, 'All fields are required'))
    
    }

    try {
        // check if the email is already in use
        const existingClinic = await Clinic.findOne({ email })
        if (existingClinic) {
            return next(errorHandler(400, 'Email already in use'))
        }
        // hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newClinic = new Clinic({
            facilityName,
            employeeStrength,
            location,
            programUsed,
            position,
            name,
            email,
            phoneNumber,
            password: hashedPassword
        })
        // save the clinic to the database
        const savedClinic = await newClinic.save()
        // generate JWT token for the clinic
        const token = jwt.sign({
            _id: savedClinic._id
        }, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' })
        // return a success message
        res.status(201).json('Clinic created successfully')
    } catch (error) {
        
    }
}
// Login a user

export const login = async (req, res, next) => {
    // Get the user data from the request body
    const { email, password } = req.body
    // Validate the request body
    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'Please fill in all fields'))
    }

    // Check if the user exists in the database
    try {
        const validUser = await User.findOne({
            email
        })
        // If the user does not exist
        if (!validUser) {
           return next(errorHandler(404, 'wrong credentials'))
        }
        // Compare the password
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(400, 'wrong credentials'))
        }

        // Create a token
        const token = jwt.sign({
            _id: validUser._id
        }, process.env.JWT_SECRET_TOKEN)

        // remove the password from the user object
        const { password: pass, ...rest } = validUser._doc
        res
            .status(200)
            .cookie('access_token', token , {
                httpOnly: true,
            })
            .json(rest)
    } catch (error) {
        next(error)
    }
}

// google auth controller
export const google = async (req, res, next) => {
    // Get the user data from the request body
    const { email, name, googlePhotoUrl } = req.body
    try {
        // Check if the user already exists
        const user = await User.findOne({
            email
        })
        // If the user does not exist
        if (user) {
            const token = jwt.sign({
                _id: user._id
            }, process.env.JWT_SECRET_TOKEN)
        //  remove the password from the user object
        const { password, ...rest } = user._doc
        res
            .status(200)
            .cookie('access_token', token , {
                httpOnly: true,
            })
            .json(rest)
        } else {
            //  generate a random password
            const generartePassword = 
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8)
            // Hash the password
            const hashedPassword = bcryptjs.hashSync(generartePassword, 10)
            // Create a new user
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + 
                Math.random().toString(9).slice(-4), 
                email, 
                password: hashedPassword, 
                profilePicture: googlePhotoUrl,
            })
            // Save the new user
            await newUser.save()
            // Create a token
            const token = jwt.sign({
                _id: newUser._id
            }, process.env.JWT_SECRET_TOKEN)
            // remove the password from the user object
            const { password, ...rest } = newUser._doc
            res
                .status(200)
                .cookie('access_token', token , {
                    httpOnly: true,
                })
                .json(rest)
        }
    } catch (error) {
        next(error)
    }
}