
import useMediaQuery from '../hooks/useMediaQuery'
import DoctorProfileHeader from './DoctorProfileHeader'
import HomePage from './HomePage'
import Footer from './Footer'




const DoctorProfile = () => {
  

  const isSmallScreen = useMediaQuery('(max-width: 640px)')
  const isMediumScreen = useMediaQuery('(min-width: 641px)) and (max-width: 1024px)')
  const isLargeScreen = useMediaQuery('(min-width: 1025px)')
 

  return (
    <div className="sm:flex flex-row min-h-screen">
    {/* Sticky Navigation */}
    <nav className=" lg:h-screen lg:sticky lg:top-0 bg-gray-100">
      <DoctorProfileHeader />
    </nav>

    {/* Main Scrollable Content */}
    <div className="flex-1 overflow-y-auto">
      <HomePage />
      <Footer />
    </div>
  </div>
  )
}


export default DoctorProfile

