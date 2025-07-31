<h1>MEDIPULSO</h1>

Full-stack healthcare web application where **patients can search and consult doctors**, **doctors can manage their profiles and availability**, and **clinics can register** to offer services. Built using the MERN stack with  features like Google OAuth, Firebase image uploads, real-time scheduling, and smart filtering.

---

## Project Status

This project is currently **under active development**. While many core features are already implemented, some parts of the application are still being built and refined.
Expect occasional bugs or incomplete functionality.

---

## Features

*  **Secure Authentication**

  * Google OAuth integration for easy login/signup.
  * Role-based access for Doctors, Patients, and Clinics.

*  **Doctor Availability Scheduling**

  * React Big Calendar for scheduling available slots.
  * Doctors can cancel, reschedule, and manage their availability.

* 🔍 **Doctor Search & Filters**

  * Search by specialty, city, online consultation, language, and availability.
  * Auto-detects patient location and pre-fills the search form.
  * Dynamic specialty and language modals with live filtering.

*  **Doctor Profile Management**

  * Multi-step profile form: Office Info, Services, Pricing, Payment Methods, Certificates, Availability.
  * Firebase-powered profile photo and gallery upload.

*  **Photo Gallery**

  * Upload office or treatment result images.
  * Public profiles show 3 preview images and expandable lightbox modal.

*  **Map Integration**

  * Google Maps support.
  * Clickable addresses that open Google Maps.

* 📄 **Patient Reviews**

  * Patients can leave reviews post-consultation.
  * Multi-step feedback modal for a better UX.

*  **UI/UX Components**

  * Built with **React + Tailwind CSS**.
  * Uses **Flowbite UI** components for styling.

* ⚖ **State Management**

  * Redux for handling users, doctors, and clinics across the app.

---

##  Tech Stack

| Layer        | Technology                    |
| ------------ | ----------------------------- |
| Frontend     | React, Tailwind CSS, Flowbite |
| State        | Redux                         |
| Backend      | Node.js, Express.js           |
| Database     | MongoDB                       |
| Auth         | Google OAuth, JWT             |
| File Storage | Firebase Storage              |
| Maps         | Google Maps API               |

---

##  Folder Structure (simplified)

```bash
MEDIPULSO/
├── api/                      # Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── client/                   # Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── App.jsx
├── .env
├── README.md
└── package.json


```
---
##  Environment Variables


<summary>🔧 Backend <code>.env</code></summary>

```env
MONGODB_CONNECTING_STRING=your-mongodb-uri
JWT_SECRET_TOKEN=your-jwt-secret
NODE_ENV=development
PORT=7500
CLIENT_URL=your-local-host(from react)
```
<summary>🌐 Client <code>.env</code></summary>

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_API_BASE_URL=http://localhost:7500
```


## Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/Sacarima/MEDIPULSO.git
```

2. **Install dependencies:**

```bash
cd MEDIPULSO/client
npm install
cd ../api
npm install
```

3. **Set environment variables:**
   Create `.env` files in both `client` and `api` folders with required API keys and credentials.

4. **Start development servers:**

```bash
# Start backend
cd api
npm run dev

# Start frontend
cd ../client
npm run dev
```

---

## 🌐 Live Demo

[https://medipulso.com/](https://medipulso.com/)

---

## Contributors

* Joao Aleixo ([@Sacarima](https://github.com/Sacarima))

---

## 🌓 License

This project is licensed under the MIT License.

---

## 📷 Preview

![Site Screenshot](https://github.com/Sacarima/MEDIPULSO/blob/main/client/src/assets/site-screenshot.png?raw=true)

---

