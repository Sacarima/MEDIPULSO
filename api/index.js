import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/user.route.js'
import doctorRoutes from './routes/doctor.route.js'
import clinicRoutes from './routes/clinic.route.js'
import doctorFormRoutes from './routes/doctorForm.route.js'
import authRoutes from './routes/auth.route.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
    .connect( process.env.MONGODB_CONNECTING_STRING)
    .then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
    console.log('Failed to connect to MongoDB', err)
})

// Create an Express app
const app = express()

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,


}));


// Create an Express app
app.use(express.json())

// add routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/clinic', clinicRoutes)
app.use('/api/doctor-form', doctorFormRoutes)

// error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  res.status(statusCode).json({
      success: false,
      statusCode,
      message
  })
})

//listen to port 6000
app.listen(7500 || 7501, () => {
  console.log('Server is running on port 7500')
})


