import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'

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

//listen to port 6000
app.listen(7500, '0.0.0.0', () => {
  console.log('Server is running on port 7500')
})

app.use('/api/user', userRoutes)

