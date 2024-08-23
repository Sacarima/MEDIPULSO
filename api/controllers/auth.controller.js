import User from '../models/user.model.js'
import Doctor from '../models/doctor.model.js'
import Clinic from '../models/clinic.model.js'
import DoctorForm from '../models/doctorForm.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'
import JwksClient from 'jwks-rsa'

//Create a new user
export const signup = async (req, res, next) => { 
    // Get the user data from the request body
    const { 
            consentToMarketing, 
            email, 
            password, 
            termsConditions, 
     } = req.body

     // array of required fields
    const requiredFields = {
        email,
        password,
    
    }

    // Check if any of the required fields is missing
    const missingField = Object.entries(requiredFields).find(([key, value]) => !value || value.trim() === '')
    if (missingField) {
        const [fieldName] = missingField
        return next(errorHandler(400, `The field '${fieldName}' is required and cannot be empty`))
    }

    
    // Validate the request body
    if ( !email || !password ) {
       return next(errorHandler(400, 'Please fill in all fields'))
    }

    // Additional validation: Email format and password strength
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(errorHandler(400, 'Please enter a valid email address'));
    }

    // check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(errorHandler(400, 'User already exists'));
    }

    
    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10)

    //  Check if the user already exists in the database
    const newUser = new User({
        consentToMarketing: consentToMarketing || false, 
        email, 
        password: hashedPassword, // save the hashed password
        termsConditions: termsConditions || false
    })

    // Save the new user
    try {
        await newUser.save()
        res.status(201).json('User created successfully')

    } catch (error) {
        console.error('Error saving new user:', error); // Log the error details
        return next(errorHandler(500, 'Signup failed. Please try again'))
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

    // Check if any of the required fields is missing
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
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        termsConditions,
        profileStatistcs,
        roleInFacility,
        city,
        numberOfDoctorsSpecialist,
        facilityPrograms,
        profile,


    } = req.body

    // array of required fields
   const requiredFields = {
        facilityName,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        termsConditions,
        profileStatistcs,
        roleInFacility,
        city,
        numberOfDoctorsSpecialist,
        facilityPrograms,
        profile
    }

    // Check if any of the required fields is missing
    const missingField = Object.entries(requiredFields).find(([key, value]) => {
        if ( typeof value === 'string') {
            return !value.trim() // check if the string is empty or contains only spaces
        }
        return value == null // check if the value is null or undefined
    })
    
    if (missingField) {
        const [fieldName] = missingField
        return next(errorHandler(400, `The field '${fieldName}' is required and cannot be empty`))
    }
    

    try {
        // check if the email is already in use
        const existingClinic = await Clinic.findOne({ email })
        if (existingClinic) {
            return next(errorHandler(400, 'Email already in use'))
        }
        // hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10)
       
        // create a new clinic
        const newClinic = new Clinic({
            facilityName,
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
            termsConditions,
            profileStatistcs,
            roleInFacility,
            city,
            numberOfDoctorsSpecialist,
            facilityPrograms,
            profile
        })
        // save the clinic to the database
        const savedClinic = await newClinic.save()
        // generate JWT token for the clinic
        const token = jwt.sign({
            _id: savedClinic._id
        }, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' })
        // return a success message
        res.status(201).json('Clinic account created successfully')
    } catch (error) {
        next(error)
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

// signup doctor form
export const signupDoctorForm = async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        medicalCategory,
        city,
        countryCode,
        phoneNumber,
        termsConditions,
        profileStatistcs,
        selectAll
    } = req.body

    // create an array of required fields
    const requiredFields = {
        firstName,
        lastName,
        email,
        password,
        medicalCategory,
        city,
        countryCode,
        phoneNumber,
        termsConditions,
        profileStatistcs
    }


    const missingField = Object.entries(requiredFields).find(([key, value]) => {
        if (key === 'termsConditions' || key === 'profileStatistcs') {
            return value !== true; // Boolean must be true
        }
        if (typeof value === 'string') {
            return value.trim() === '';
        }
        return !value;
    });


    if (missingField) {
        const [fieldName] = missingField;
        return next(errorHandler(400, `The field '${fieldName}' is required and cannot be empty`));
    }

    try {
        // check if the email is already in use
        const existingDoctor = await DoctorForm.findOne({ email })
        if (existingDoctor) {
            return next(errorHandler(400, 'Email already in use'))
        }

        // hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newDoctor = new DoctorForm({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            medicalCategory,
            city,
            countryCode,
            phoneNumber,
            termsConditions,
            profileStatistcs,
            selectAll
        })

        
        // save the doctor to the database
        const savedDoctor = await newDoctor.save()

        // generate JWT token for the doctor
        const token = jwt.sign({
            _id: savedDoctor._id
        }, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' })
        // return a success message
        res.status(201).json({message: 'Doctor created successfully' })
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

// Function to fetch the public key based on the kid
const getKey = async (kid) => {
    const client = JwksClient({
        jwksUri: 'https://appleid.apple.com/auth/keys',
        timeout: 30000,
    })

    // Get the signing key using the "kid
    const key = await client.getSigningKey(kid)
    return key.getPublicKey()
}

// Apple authentication handler
export const apple = async (req, res, next) => {
    
    try {
        const { id_token } = req.body

        if(!id_token) {
            return next(errorHandler(400, 'ID token is required'))
        }

        // Decode the JWT to get the header (which contains the 'kid')
        const decodedToken = jwt.decode(id_token, { complete: true })

        if(!decodedToken || !decodedToken.header) {
            return next(errorHandler(400, 'Invalid ID token'))
        }

        const { kid } = decodedToken.header

        // Get the public key using the 'kid'
        const publicKey = await getKey(kid)
        console.log(publicKey)

        // Verify the JWT
        const verifiedToken = jwt.verify(id_token, publicKey, { algorithms: ['RS256'] })

        console.log(verifiedToken)

        // extract the user data from the verified token
        const { email, email_verified, sub, exp, aud, iss } = verifiedToken

       // Perform additional checks
       const expectedAudience = process.env.APPLE_CLIENT_ID
       const expectedIssuer = 'https://appleid.apple.com'

       if (aud !== expectedAudience ) {
            return next(errorHandler(400, 'Invalid audience'))
       }

       if (iss !== expectedIssuer) {
            return next(errorHandler(400, 'Invalid issuer'))
       }

       if ( Date.now() >= exp * 1000) {
            return next(errorHandler(400, 'Token expired'))
       }

       if (!email_verified) {
            return next(errorHandler(400, 'Email not verified by Apple'))
       }

         // Check if the user already exists n the database
         let user = await User.findOne({
            email
        })

        if (!user) {
            // Create a new user
            user = new User({
                username: email.split('@')[0],
                email,
                password: bcryptjs.hashSync(Math.random().toString(36).slice(-8), 10),
                profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            })

            // Save the new user
            user = await newUser.save()
        }

        // Create a token
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' })

        //Respond with the user data and token
        res
            .status(200)
            .cookie('access_token', token, {
                httpOnly: true,
            })
            .json(user)

    } catch (error) {
        console.log(error)
        next(errorHandler(500, 'An error occurred'))
    }
    
}