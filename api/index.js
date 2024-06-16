import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import doctorRoutes from './routes/doctor.route.js'
import clinicRoutes from './routes/clinic.route.js'
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

const app = express()

// Create an Express app
app.use(express.json())

// add 
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/clinic', clinicRoutes)

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
app.listen(7500, '0.0.0.0', () => {
  console.log('Server is running on port 7500')
})


