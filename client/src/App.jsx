import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Questions from './pages/Questions'
import Account from './pages/Account'
import Services from './pages/Services'
import DataPrivacy from './pages/DataPrivacy'
import About from './pages/About'
import Contact from './pages/Contact'
import Signup from './pages/Signup'
import DashBoard from './pages/DashBoard'


function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="questions" element={<Questions />} />
        <Route path="account" element={<Account />} />
        <Route path="/services" element={<Services />} />
        <Route path="/data-privacy" element={<DataPrivacy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="sign-up" element={<Signup />} />
        <Route path="dashboard" element={<DashBoard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App