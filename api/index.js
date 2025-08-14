//import dotenv from 'dotenv'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import http from 'http'
import { Server as SocketServer } from 'socket.io'
import patientRoutes from './routes/patient.route.js'
import userRoutes from './routes/user.route.js'
import doctorRoutes from './routes/doctor.route.js'
import clinicRoutes from './routes/clinic.route.js'
import doctorFormRoutes from './routes/doctorForm.route.js'
import servicesRoutes from './routes/services.route.js'
import popularCategoriesRoutes from './routes/popularCategories.route.js'
import authRoutes from './routes/auth.route.js'
import reviewRoutes from './routes/review.routes.js'
import appointmentRoutes from './routes/appointment.route.js'
import doctorAvailabilityRoutes from './routes/doctorAvailability.routes.js'
import adminRoutes from './routes/admin.route.js'
import specialtyRoutes from './routes/specialty.route.js'
import treatmentRoutes from './routes/treatment.route.js'
import questionRoutes from './routes/question.route.js'
import newsRoutes from './routes/news.route.js'
import billingsRoutes from './routes/billing.route.js'
import stripeWebhookHandler from './webhooks/stripeWebhook.js'

import StatsRoutes from './routes/stats.route.js'
import locationRoutes from './routes/location.route.js'


import connectDB from './config/db.js'
import admin from 'firebase-admin'

//Load Firebase service account credentials
// This is necessary to initialize Firebase Admin SDK for server-side operations
// The service account JSON file contains the credentials needed to authenticate with Firebase services
// Ensure that the file path is correct and the file is included in your project
// The file should not be committed to version control for security reasons
// The service account is used for operations like uploading files to Firebase Storage, sending notifications, etc


//remove this in production
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

//import serviceAccount from './secrets/firebaseServicesAccountKey.json' assert { type: 'json' }


// Load environment variables
//dotenv.config()

// Connect to MongoDB
connectDB()




// Create an Express app
const app = express()

/** Stripe webhook must see the raw body */
app.post("/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhookHandler);


// Create an Express app
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Use CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}))


// Use cookie parser middleware
app.use(cookieParser()) // extracts cookies from the browser without problems

//Initialize Firebase Admin SDK
// This allows the server to interact with Firebase services like Firestore, Storage, etc.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
})


// add routes
// The routes are defined in separate files for better organization
// Each route file exports a router object that is used to handle requests
// The routes are mounted on specific paths using app.use()
// This allows the server to handle requests for different resources
// For example, the user routes are mounted on /api/user
// This means that any request to /api/user will be handled by the user routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/clinic', clinicRoutes)
app.use('/api/doctor-form', doctorFormRoutes)
app.use('/api/services-treatment', servicesRoutes)
app.use('/api/categories', popularCategoriesRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/doctor-availability', doctorAvailabilityRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/specialties', specialtyRoutes)
app.use("/api/treatments", treatmentRoutes)
app.use("/api/questions", questionRoutes)
app.use("/api", StatsRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/billing', billingsRoutes)
app.use('/api/patients', patientRoutes)


//  Socket.IO setup
// This allows real-time communication between the server and clients
// The Socket.IO server is created using the HTTP server instance
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('joinTreatment', (slug) => {
    console.log('joinTreatment', slug);
    socket.join(`treatment:${slug}`);
  });
  socket.on('leaveTreatment', (slug) => {
    console.log('leaveTreatment', slug);
    socket.leave(`treatment:${slug}`);
  });

    socket.on('joinDoctor', (doctorId) => {
    const room = `doctor:${doctorId}`;
    console.log('[socket] join ->', room);
    socket.join(room);
  });

  socket.on('leaveDoctor', (doctorId) => {
    const room = `doctor:${doctorId}`;
    console.log('[socket] leave ->', room);
    socket.leave(room);
  });
});

// Set the directory name for the current module
// This is necessary for resolving relative paths correctly
// especially when serving static files or using path.join
// __dirname is not available in ES modules, so we use path.resolve
// to get the current directory path
const __dirname = path.resolve()
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}




// Serve static files from the React app
// This is necessary to serve the React app in production
// The static files are built and placed in the 'client/dist' directory
// Make sure to run the build command before starting the server
// The build command is defined in the package.json file
// It installs the client dependencies and builds the React app
// The static files are served from the 'client/dist' directory
// This allows the server to serve the React app when the user accesses the root URL
// The static files are served from the 'client/dist' directory
// app.use(express.static(path.join(__dirname, 'client', 'dist')))

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
// })


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



//listen to port
const PORT = process.env.PORT || 7500
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})