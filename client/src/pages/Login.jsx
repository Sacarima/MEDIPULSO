import React from 'react'
import Header from '../components/Header'

export default function Login() {
  return (
    <div>
      <Header />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-center mt-10">Login</h1>
        <form className="flex flex-col items-center mt-10">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-2 w-80"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2 w-80 mt-4"
          />
          <button className="bg-blue-500 text-white p-2 w-80 mt-4">Login</button>
        </form>
    </div>
    </div>
  )
}

