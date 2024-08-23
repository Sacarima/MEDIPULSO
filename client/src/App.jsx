import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Questions from './pages/Questions'
import Account from './pages/Account'
import Services from './pages/Services'
import DataPrivacy from './pages/DataPrivacy'
import JobOffersForDoctors from './pages/JobOffersForDoctors'
import About from './pages/About'
import Contact from './pages/Contact'
import SignUp from './pages/SignUp'
import DashBoard from './pages/DashBoard'
import SignupDoctor from './pages/SignupDoctor'
import DoctorForm from './pages/DoctorForm'
import TermsAndCondition from './pages/TermsAndCondition'
import ClinicForm from './pages/ClinicForm'
// import Header from './components/Header'
// import Footer from './components/Footer'


function App() {
 

  return (
    <BrowserRouter>
      {/* <Header className="md:block" /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="questions" element={<Questions />} />
        <Route path="account" element={<Account />} />
        <Route path="/services" element={<Services />} />
        <Route path="/data-privacy" element={<DataPrivacy />} />
        <Route path="/job-offers-for-doctor" element={<JobOffersForDoctors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signup/doctor" element={<SignupDoctor />} />
        <Route path="signup/doctor-form" element={<DoctorForm />} />
        <Route path="signup/clinic-form" element={<ClinicForm />} />
        <Route path="terms-and-condition" element={<TermsAndCondition />} />
        <Route path="dashboard" element={<DashBoard />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}

export default App