import React from 'react'
import Header from '../components/Header'
import HomePage from '../components/HomePage'
import Footer from '../components/Footer'

function HomePageMain() {
  return (
    <div>
        <div className='bg-[#00c3a5]'>
          <div className='2xl:w-[70%] md:w-[100%] m-auto 2xl:bg-[#00c3a5]'>
            <Header />
          </div>
        </div>
        <HomePage />
        <Footer />
    </div>
  )
}

export default HomePageMain