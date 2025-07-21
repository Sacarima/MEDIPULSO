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

const libraries = ['places']

const App = () => {
 const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    id: 'google-map-script',
  })

  if (loadError) {
    return <div>Error loading Google Maps API</div>
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageMain />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-form" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/questions/:questionId" element={<Questions />} />
        <Route path="/account" element={<Account />} />
       
          <Route path="/services" element={ <Services />} /> 
        
        <Route path="/data-privacy" element={<DataPrivacy />} />
        <Route path="/job-offers-for-doctor" element={<JobOffersForDoctors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/patient-profile" element={<PatientAccount />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/doctor-calendar" element={<Calendar />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/settings" element={<Settings />} />
          <Route 
            path="/doctor-review/:doctorId" 
            element={
              <DoctorProvider>
                <ReviewSteps />
              </DoctorProvider>
            } 
          />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/doctor-appointment/:doctorId" element={
            <DoctorProvider>
              <DoctorAppointment />
            </DoctorProvider>
          } 
            />
        </Route>
        
        <Route path="/doctor-profile-info" element={<DoctorProfileInfo />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/profile-info/:doctorId" element={
          <DoctorPublicProfile isLoaded={isLoaded} />
        
        } 
        />
        <Route path="/signup/doctor" element={<SignupDoctor />} />
        <Route path="/signup/doctor-form" element={<DoctorForm />} />
        <Route path="/signup/clinic-form" element={<ClinicForm />} />
        <Route path="/terms-and-condition" element={<TermsAndCondition />} />
        

        <Route element={<PrivateRoute />}>
          <Route path="/appointment-confirmation" element={
              <DoctorProvider>
                <ConfirmationPage />
              </DoctorProvider>
            } 
            />
          
        </Route>
        <Route path="/doctor-specialties" element={<DoctorSpecialtiesPage />} />
        <Route path="/doctor-profile-completion" element={<DoctorProfileCompletion />} />
        <Route path="/doctor-signup-confirmation" element={<DoctorSignupConfirmation />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/ask-doctor" element={<AskDoctorForm />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App