import { useState, useEffect} from 'react'
import Header from '../components/Header'
import DeleteConfirmation from '../components/DeleteConfirmation'


export default function Home() {
  return (
    <div className=' '>
      <Header />
      <div className='flex flex-col items-center h-full'>
        <h1 className='text-4xl text-center mt-10'>Welcome to Medipulso</h1>
        <DeleteConfirmation />
      </div>
    </div>
  )
}
