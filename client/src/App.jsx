import {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import LoginForm from './pages/LoginForm'
import Register from './pages/Register'
import Questions from './pages/Questions'
import Account from './pages/Account'
import Services from './pages/Services'
import DataPrivacy from './pages/DataPrivacy'
import JobOffersForDoctors from './pages/JobOffersForDoctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Signup from './pages/Signup'
import DashBoard from './pages/DashBoard'
import SignupDoctor from './pages/SignupDoctor'
import DoctorForm from './pages/DoctorForm'
import TermsAndCondition from './pages/TermsAndCondition'
import ClinicForm from './pages/ClinicForm'
import PrivateRoute from './components/PrivateRoute'
import PatientAccount from './pages/PatientAccount'
import DoctorProfile from './components/DoctorProfile'
import HomePageMain from './pages/HomePageMain'
import DoctorProfileInfo from './pages/DoctorProfileInfo'
import DoctorPublicProfile from './components/DoctorPublicProfile'
import ReviewSteps from './components/review/ReviewSteps'
import { DoctorProvider } from './components/context/DoctorContext'
import { useJsApiLoader } from '@react-google-maps/api'
import DoctorAppointment from './components/appointment/DoctorAppointment'
import ConfirmationPage from './components/appointment/ConfirmationPage'
import DoctorSpecialtiesPage from './pages/DoctorSpecialiesPage'
import DoctorProfileCompletion from './components/doctor/DoctorProfileCompletion'
import DoctorSignupConfirmation from './components/DoctorSignupConfirmation'
import PageNotFound from './pages/PageNotFound'
import Calendar from './components/doctor/Calendar'
import SearchResults from './pages/SearchResults'
import AskDoctorForm from './components/questions/AskQuestionForm'
import Settings from './components/dashboard/Settings'
import MedicalTreatment from './components/MedicalTreatment'
import { useSelector } from 'react-redux'
import AdminLayout from './components/dashboard/AdminLayout'
import AdminDashboard from './components/dashboard/AdminDashboard'
import AdminAddTreatment from './components/admin/AdminAddTreatment'
import DoctorTable from './components/dashboard/DoctorTable'
import AdminAppointmentsTable from './components/dashboard/AdminAppointmentsTable'
import AppointmentTable from './components/dashboard/AppointmentTable'
import AccountHeaderPatient from './components/AccountHeaderPatient'
import HomePage from './components/HomePage'
import Layout from './components/layout/Layout'
import toast, { Toaster } from 'react-hot-toast';
import { EnsureDoctorDashboardProvider } from './components/context/DoctorDashboardContext'
import SessionManager from './auth/SessionManager'
import DiscoverMediPulsoPro from './pages/DiscoverMediPulsoPro'
import AdminUsersPanel from './components/dashboard/adminUsersPanel'
import AdminSettings from './components/dashboard/AdminSettings'
import AdminAnalytics from './components/dashboard/AdminAnalytics'
import CookieConsent from './components/privacy/CookieConsent'





const libraries = ['places']

const App = () => {
const [appLoading, setAppLoading] = useState(true)
const { currentAdmin } = useSelector((state) => state.admin)

  // Load Google Maps API
 const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    id: 'google-map-script',
  })

    // Simulate loading screen on mount
  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [])

  if (loadError) {
    return <div>Error loading Google Maps API</div>
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }


  return (
    
 <EnsureDoctorDashboardProvider>
  <BrowserRouter>
    <SessionManager />
    <Routes>
      {/* PUBLIC (with Layout so headers render) */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/services" element={<Layout><Services /></Layout>} />
      <Route path="/data-privacy" element={<Layout><DataPrivacy /></Layout>} />
      <Route path="/job-offers-for-doctor" element={<JobOffersForDoctors />} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/questions/:questionId" element={<Layout><Questions /></Layout>} />
      <Route path="/treatments/:slug" element={<Layout><MedicalTreatment /></Layout>} />
      <Route path="/doctor-specialties" element={<Layout><DoctorSpecialtiesPage /></Layout>} />
      <Route path="/search-results" element={<Layout><SearchResults /></Layout>} />
      <Route path="/ask-doctor" element={<Layout><AskDoctorForm /></Layout>} />

      {/* PUBLIC (intentionally no Layout / no header) */}
      <Route path="/login" element={<Login />} />
      <Route path="/login-form" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/doctor" element={<SignupDoctor />} />
      <Route path="/signup/doctor-form" element={<DoctorForm />} />
      <Route path="/signup/clinic-form" element={<ClinicForm />} />
      <Route path="/terms-and-condition" element={<TermsAndCondition />} />
      <Route path="/discover-medi-pulso-pro" element={<DiscoverMediPulsoPro />} />
      {/* <Route path="/job-offers-for-doctors" element={<JobOffersForDoctors />} /> */}

      {/* PUBLIC doctor profile (will show DoctorProfileHeader if user is a doctor, else public header) */}
      <Route
        path="/profile-info/:doctorId"
        element={<Layout><DoctorPublicProfile isLoaded={isLoaded} /></Layout>}
      />
      <Route
        path="/profile/:firstName-:lastName/:medicalCategory/:city"
        element={<Layout><DoctorPublicProfile isLoaded={isLoaded} /></Layout>}
      />

      <Route
        path="/profile/:nameSlug/:medicalCategory/:city"
        element={<Layout><DoctorPublicProfile isLoaded={isLoaded} /></Layout>}
      />

      <Route
          path="/profile/:name/:medicalCategory/:city/:doctorId"
          element={<Layout><DoctorPublicProfile isLoaded={isLoaded} /></Layout>}
        />

      

      {/* PRIVATE */}
      <Route element={<PrivateRoute />}>
        <Route path="/patient-profile" element={<Layout><PatientAccount /></Layout>} />
        <Route path="/account" element={<Layout><Account /></Layout>} />

        {/* If you want doctor header on these, wrap with Layout */}
        <Route path="/doctor-profile" element={<Layout><DoctorProfile /></Layout>} />
        <Route path="/doctor-profile/:doctorId" element={<Layout><DoctorProfile /></Layout>} />
        <Route path="/doctor-calendar" element={<Layout><Calendar /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/doctor-signup-confirmation" element={<Layout><DoctorSignupConfirmation /></Layout>} />
        <Route path="/doctor-profile-completion" element={<Layout><DoctorProfileCompletion /></Layout>} />
        <Route
          path="/doctor-review/:doctorId"
          element={
            <Layout>
              <DoctorProvider>
                <ReviewSteps />
              </DoctorProvider>
            </Layout>
          }
        />
        <Route
          path="/doctor-appointment/:doctorId"
          element={
            <Layout>
              <DoctorProvider>
                <DoctorAppointment />
              </DoctorProvider>
            </Layout>
          }
        />
        <Route
          path="/appointment-confirmation"
          element={
            <Layout>
              <DoctorProvider>
                <ConfirmationPage />
              </DoctorProvider>
            </Layout>
          }
        />
        
      </Route>

      {/* Doctor dashboard main */}
      <Route
        path="/doctor-profile-info"
        element={<Layout><DoctorProfileInfo /></Layout>}
      />

      {/* Admin-only */}
      {currentAdmin && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="treatments" element={<AdminAddTreatment />} />
          <Route path="doctor-table" element={<DoctorTable />} />
          <Route path="appointments" element={<AppointmentTable />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsersPanel />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      )}

      <Route
        path="/job-offers-for-doctors"
        element={<Layout><JobOffersForDoctors /></Layout>}
      />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </BrowserRouter>

  <Toaster
    position="top-right"
    toastOptions={{
      duration: 2500,
      style: { fontSize: '14px' },
      success: { iconTheme: { primary: '#00c3a5', secondary: '#fff' } }
    }}
  />
  <CookieConsent />
</EnsureDoctorDashboardProvider>
  )
}

export default App