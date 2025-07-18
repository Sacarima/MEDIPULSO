import React from 'react'
import useMediaQuery from '../hooks/useMediaQuery'

const ProfileInfoNavigation = () => {

  const isAboveSmallScreens = useMediaQuery('(min-width: 640px)')

 const containerStyle = {
    width: '20rem',
    height: '100vh',
    backgroundColor: 'red',
    marginLeft: '4.5rem',
    zIndex: '10',
    transition: 'all 300ms',
  }

  return (
    
        <div className='hidden md:block'>
          <div className=" sm:sticky sm:top-0 flex flex-col h-screen bg-white text-[1rem] w-1/4 min-w-[10rem] max-w-[16rem] p-4 " >
                    <ul className="py-4">
                      {/* Profile Section */}
                      <li className="px-4 py-2 hover:bg-gray-100">
                        Profile
                        {/* Submenu */}
                        <ul className={`ml-4 py-2 ${!isAboveSmallScreens && 'hidden'}`}>
                          <li className="px-4 cursor-pointer py-1 hover:bg-gray-200">Edit Profile</li>
                          <li className="px-4 cursor-pointer py-1 hover:bg-gray-200 whitespace-nowrap">Public profile</li>
                          <li className="px-4 cursor-pointer py-1 hover:bg-gray-200">Addresses</li>
                        </ul>
                      </li>
                      {/* Additional Items */}
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Appointment channels</li>
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Profile statistics</li>
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Promotions</li>
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Certificates</li>
                    </ul>
              <div className='bg-[#00b39be6] p-1 w-full rounded'>
                <button className='w-full cursor-pointer bg-white text-[#00b39be6] py-2 rounded text-sm font-medium'>Discover Medi Pulso Pro</button>
              </div>
          </div>
        </div>
    
  )
}

export default ProfileInfoNavigation