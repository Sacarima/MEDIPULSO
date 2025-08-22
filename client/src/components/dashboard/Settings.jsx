import React, { useState } from 'react'
import { BiSolidShow, BiSolidHide  } from "react-icons/bi"
import Header from '../Header';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Mock API call for updating settings
    setTimeout(() => {
      setSuccess('Settings updated successfully');
      setError('');
    }, 1000);
  };

  return (
    <div>
      {/* <Header /> */}
      <div className="p-6 bg-gray- rounded-lg shadow-md lg:w-[70%] mx-auto flex flex-col h-screen justify-center items-center">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Account Settings</h2>
      
        {/* Error & Success Messages */}
        {error && <div className="bg-red-500 text-white p-3 rounded-md">{error}</div>}
        {success && <div className="bg-green-500 text-white p-3 rounded-md">{success}</div>}
        {/* User Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='flex flex-col md:flex-row gap-4'>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName} // Assuming username is the same as email for simplicity
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className='relative'>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-10 text-gray-500"
            >
              {showPassword ? <BiSolidHide className="text-xl" /> : <BiSolidShow className="text-xl" />}
            </button>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
