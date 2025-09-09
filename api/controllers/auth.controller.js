import User from '../models/user.model.js'
import Clinic from '../models/clinic.model.js'
import DoctorForm from '../models/doctorForm.model.js'
import Admin from '../models/admin.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'
import JwksClient from 'jwks-rsa'
import Specialty from '../models/specialty.model.js'
import { cookieOpts } from '../utils/cookieOpts.js';

export const authMe = async (req, res, next) => {
  try {
    // req.auth is set by requireAnyAuth middleware
    const { id, role, exp } = req.auth;

    let model = null;
    switch (role) {
      case 'doctor':
        model = DoctorForm;
        break;
      case 'user':
        model = User;
        break;
      case 'clinic':
        model = Clinic;
        break;
      case 'admin':
        model = Admin;
        break;
      default:
        return res.status(403).json({
          success: false,
          code: 'FORBIDDEN_ROLE',
          message: 'Forbidden - Unknown role',
        });
    }

    const doc = await model.findById(id).lean();
    if (!doc) {
      // User removed or mismatch
      return res.status(401).json({
        success: false,
        code: 'TOKEN_INVALID',
        message: 'Unauthorized - Account not found',
      });
    }

    
    // eslint-disable-next-line no-unused-vars
    const { password, ...safe } = doc;

    return res.status(200).json({
      success: true,
      role,
      user: safe,
      exp, // seconds since epoch (from JWT)
      sessionExpiresAt: exp * 1000, // ms epoch, convenient for UI timers
      serverTimeMs: Date.now(), 
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /auth/logout
 * Clears the access_token cookie.
 */
export const logout = async (req, res, next) => {
  try {
   
    res.clearCookie('access_token', {
      path: '/',
      sameSite: process.env.COOKIE_SAMESITE || 'lax',
      secure: (String(process.env.COOKIE_SECURE || '').toLowerCase() === 'true') && (process.env.NODE_ENV === 'production'),
      httpOnly: true,
    });
    return res.status(200).json({ success: true, message: 'Logged out' });
  } catch (err) {
    return next(err);
  }
};


export const setAccessTokenCookie = (res, token, maxAgeMs) => {
  res.cookie('access_token', token, cookieOpts(maxAgeMs));
};

//Create a new user
export const signup = async (req, res, next) => { 
    // Get the user data from the request body
    const { 
            consentToMarketing, 
            email, 
            password,
            firstName,
            lastName,
            phoneNumber,
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
        termsConditions: termsConditions || false,
        firstName,
        lastName,
        phoneNumber
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




export const getLoggedInDoctor = async (req, res, next) => {
    console.log("Cookies received:", req.cookies);
    
    const token = req.cookies.access_token;
    console.log("Token from cookie:", token);
    
    if (!token) {
      return res.status(401).json({ message: 'No token found, please login' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
      const doctorId = decoded._id;
      const doctor = await DoctorForm.findById(doctorId).select('-password');
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      res.status(200).json(doctor);
    } catch (error) {
      console.error("Error in getLoggedInDoctor:", error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  
  




// create a Doctor account

// Signup Doctor
export const signupDoctor = async (req, res, next) => {
  console.log("🔵 Received Signup Request:", req.body);

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
    location, 
    experience,
    profilePicture,


  } = req.body;


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
    profileStatistcs,
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
    
    const existingDoctor = await DoctorForm.findOne({ email });
    if (existingDoctor) {
      return next(errorHandler(400, 'Email already in use'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const specialtyDoc = await Specialty.findOne({ name: medicalCategory });

    if (!specialtyDoc) {
      return next(errorHandler(400, `No specialty found for ${medicalCategory}`));
    }



    const newDoctor = new DoctorForm({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      specialty: specialtyDoc._id,
      location: location || 'Unknown',
      experience: experience || 0,
      medicalCategory,
      treatments: specialtyDoc.treatments,
      profilePicture,
      city,          
      countryCode,   
      phoneNumber, 
      role: 'doctor',
    });


    const savedDoctor = await newDoctor.save();
    if (!savedDoctor) {
      return next(errorHandler(500, 'Failed to save doctor.'));
    }

    const token = jwt.sign(
      { _id: savedDoctor._id, role: savedDoctor.role },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: '7d' }
    );

    res.cookie('access_token', token, {
      httpOnly: true,        
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',  
      path: '/',
    });


    return res.status(201).json({
      message: 'Doctor created successfully',
      doctor: {
        _id: savedDoctor._id,
        firstName: savedDoctor.firstName,
        lastName: savedDoctor.lastName,
        email: savedDoctor.email,
        specialty: savedDoctor.specialty,
        location: savedDoctor.location,
        experience: savedDoctor.experience,
        medicalCategory: savedDoctor.medicalCategory,
        treatments: savedDoctor.treatments,
        profilePicture: savedDoctor.profilePicture,
        city: savedDoctor.city,              
        countryCode: savedDoctor.countryCode, 
        phoneNumber: savedDoctor.phoneNumber, 
        role: savedDoctor.role,
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    next(error);
  }
};




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
    const { email,password } = req.body

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'))
    }

    let validUser = null
    let userRole = null

    try {
        // check across all models
        validUser = await DoctorForm.findOne({ email })
        if (validUser) {
            userRole = 'doctor'
        }
        if (!validUser) {
            validUser = await User.findOne({ email })
            if (validUser) {
                userRole = 'user'
            }
        }

        if (!validUser) {
            validUser = await Clinic.findOne({ email })
            if (validUser) {
                userRole = 'clinic'
            }
        }

        if (!validUser) {
            validUser = await Admin.findOne({ email })
            if (validUser) {
                userRole = 'admin'
            }
        }

        // if no user is found in any model
        if (!validUser) {
            return next(errorHandler(404, 'User not found'))
        }

        // password validation 
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'))
        }

        // generate token and include role in the payload
        const token = jwt.sign({
            id: validUser._id,
            role: userRole
        }, process.env.JWT_SECRET_TOKEN, { expiresIn: '1d' })


        const { password: pass, ...rest } = validUser._doc 

        // determine redirection based on the user role
        let redirectTo = '';
        switch (userRole) {
        case 'doctor':
            redirectTo = '/doctor-profile-info';
            break;
        case 'user':
            redirectTo = '/';
            break;
        case 'clinic':
            redirectTo = '/clinic-profile';
            break;
        case 'admin':
            redirectTo = '/admin'; // Admin specific redirect
            break;
        }


        // return success response with user data and token and redirection
        const ACCESS_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; 
        res
            .status(200)
            .cookie('access_token', token, cookieOpts(ACCESS_TOKEN_TTL_MS), {
                httpOnly: true
            })
            .json({
                success: true,
                message: 'Login successful',
                user: rest,
                redirectTo
            })
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



export const google = async (req, res, next) => {

  const { email, name, googlePhotoUrl, firstName: bodyFirstName, lastName: bodyLastName } = req.body;

  // derive first/last robustly
  function getNames() {
    const trimmed = (name || "").trim();
    const parts = trimmed ? trimmed.split(/\s+/) : [];
    const fn = bodyFirstName || parts[0] || "";
    const ln = bodyLastName || (parts.length > 1 ? parts.slice(1).join(" ") : "");
    return { firstName: fn, lastName: ln };
  }
  const { firstName, lastName } = getNames();

  try {
    let user = await User.findOne({ email });

    if (user) {
      // backfill names/photo if missing
      let changed = false;
      if ((!user.firstName || user.firstName === "") && firstName) {
        user.firstName = firstName;
        changed = true;
      }
      if ((!user.lastName || user.lastName === "") && lastName) {
        user.lastName = lastName;
        changed = true;
      }
      if ((!user.profilePicture || user.profilePicture === "") && googlePhotoUrl) {
        user.profilePicture = googlePhotoUrl;
        changed = true;
      }
      if (changed) await user.save();

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_TOKEN);
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      // username base: prefer names, else fall back to name/email local part
      const baseUsername =
        (firstName + (lastName ? lastName : "")).trim().toLowerCase() ||
        (name ? name.toLowerCase().split(" ").join("") : "") ||
        (email?.split("@")[0] || "user");

      const username = baseUsername + Math.random().toString(9).slice(-4);

      // generate + hash password (unchanged approach)
      const generartePassword =
        Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generartePassword, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        provider: "google",
      });

      await newUser.save();

      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET_TOKEN);
      const { password, ...rest } = newUser._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};


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
        console.log( publicKey)

        // Verify the JWT
        const verifiedToken = jwt.verify(id_token, publicKey, { algorithms: ['RS256'] })

        //console.log(verifiedToken)

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