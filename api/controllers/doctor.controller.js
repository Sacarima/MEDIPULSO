export const test = (req, res) => {
    res.json({message: 'API is working'})

}


// import Doctor from '../models/doctor.model.js'
// import bcryptjs from 'bcryptjs'

// export const signupDoctor = async (req, res, next) => {
//     const { 
//         name, 
//         email, 
//         password, 
//         specialty, 
//         location,
//         experience,
//         medicalCategory,
//         profilePicture
//     } = req.body

//     // create an array of required fields
//     const requiredFields = [
//          name, 
//          email, 
//          password, 
//          specialty, 
//          location, 
//          experience, 
//          medicalCategory
//         ]

//     // check if any of the required fields is missing
//     const missingField = Object.entries(requiredFields).find(([key, value])=> !value || value.trim() === '')
//     if (missingField) {
//         const [fieldName] = missingField
//         next(errorHandler(400, `The field ${fieldName} is required and cannot be empty`))
    
//     }

    

//     try {
//         // check if the email is already in use
//          const existingDoctor = await Doctor.finOne({ email })
//          if (existingDoctor) {
//         return  next(errorHandler(400, 'Email already in use'))
//     }

//     // hash the password
//     const hashedPassword = bcryptjs.hashSync(password, 10)
//     const newDoctor = new Doctor({
//         name,
//         email,
//         password: hashedPassword,
//         specialty,
//         location,
//         experience,
//         medicalCategory,
//         profilePicture
//     })
//     await newDoctor.save()
//     // return a success message
//     res.status(201).json('Doctor created successfully')
//     } catch (error) {
//         next(error)
//     }


// }