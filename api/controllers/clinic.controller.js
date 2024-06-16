export const test = (req, res) => {
    res.json({message: 'API is working'})

}

// import Clinic from "../models/clinic.model.js"
// import bcryptjs from 'bcryptjs'

// export const signup = async (req, res, next) => {
//     const {
//         facilityName,
//         employeeStrength,
//         location,
//         programUsed,
//         position,
//         name,
//         email,
//         phoneNumber,
//        password

//     } = req.body
//     if ( !facilityName || 
//         !employeeStrength || 
//         !location || 
//         !programUsed || 
//         !position || 
//         !name || 
//         !email || 
//         !phoneNumber || 
//         !password || 
//         facilityName === '' || 
//         employeeStrength === '' || 
//         location === '' || 
//         programUsed === '' || 
//         position === '' || 
//         name === '' || 
//         email === '' || 
//         phoneNumber === '' || 
//         password === ''
//     ) {
//         return next(errorHandler(400, 'All fields are required'))
//     }

//     // check if the email is already in use
//     try {
//         const existingClinic = await Clinic.findOne({ email })
//         if (existingClinic) {
//             return next(errorHandler(400, 'Email already in use'))
//         }
//         // hash the password
//         const hashedPassword = bcryptjs.hashSync(password, 10)
//         const newClinic = new Clinic({
//             facilityName,
//             employeeStrength,
//             location,
//             programUsed,
//             position,
//             name,
//             email,
//             phoneNumber,
//             password: hashedPassword
//         })
//         await newClinic.save()
//         res.status(201).json('Clinic created successfully')
//     } catch (error) {
        
//     }
// }
