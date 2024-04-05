import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

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
app.listen(6000, () => {
  console.log('Server is running on port 6000')
})
