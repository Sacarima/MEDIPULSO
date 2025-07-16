import {useState } from 'react'
import { Link } from 'react-router-dom'
import { BiSolidShow, BiSolidHide  } from "react-icons/bi"
import { Label } from 'flowbite-react'
import MedicalCategoryDropdown from '../components/MedicalCategoryDropdown'

const SignupClinicMoreInfo = ({formData, setFormData, invalidFields, setInvalidFields}) => {
  const [showPassword, setShowPassword] = useState(false)

  // Helper function to determine if a field is invalid
  const isFieldInvalid = (field) => invalidFields.includes(field)

  
  const handleInputChange = (field, value) => {
    setFormData({ 
      ...formData, 
      [field]: value 
    })

    if (invalidFields.includes(field) && value.trim() !== '') {
      setInvalidFields(invalidFields.filter(item => item !== field))
    }
  }

  const handleCategorySelect = (field, value) => {
    setFormData({ 
      ...formData, 
      [field]: value 
    })
  }


  
  // Toggle the checkbox when a individual checkbox is clicked
  const handleCheckbox = (e) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const userRole = [
    "Owner", "Manager", "Receptionist", "Doctor", "Nurse", "Memberr of the medical staff", "Other", "Not applicable", "Member of the board", "Administrator", "IT specialist", "Accountant", "HR specialist", "Marketing specialist", "Sales specialist", "Other"
  ]

  console.log('Invalid fields:', invalidFields);
  console.log('Form Data:', formData);

  return (
    <div>
      <div className='sm:w-full sm:ml-auto sm:mr-8'>
        <h3 className='text-slate-400 text-2xl font-semibold pb-3'>Your data</h3>
        <span className='text-[13px]'>The data below will not be visible, we only need it to set up your profile.</span>
        <div className='border-b-[1px] mt-5'>
        </div>

        <div className='mt-4'>
        </div>

        
      </div>
              <div className='flex flex-col mt-4'>
                <div className='sm:flex justify-between w-full'>
                <div className='flex w-full flex-col sm:w-[46%]'>
                  <Label value="Name*" />
                  <input
                    type="text"
                    className={`block w-full mt-1 px-3 py-2 border placeholder-gray-400 rounded-md ${isFieldInvalid('firstName') ? 'border-red-600' : 'border-gray-300'}`}
                    placeholder="Enter your name"
                    id="firstName"
                    value={formData.firstName}
                    name='firstName'
                    onChange={(e) => handleInputChange('firstName', e.target.value)}

                    
                  />
                </div>
                <div className='flex flex-col w-full sm:w-[46%]'>
                  <Label  value="Last name*" />
                  <input
                    type="text"
                    className={`block w-full mt-1 px-3 py-2 border placeholder-gray-400 rounded-md ${isFieldInvalid('lastName') ? 'border-red-600' : 'border-gray-300'}`}
                    placeholder="Enter your last name"
                    id="lastName"
                    value={formData.lastName}
                    name='lastName'
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    
                  />
                </div>
              </div>

              <div className='my-4  flex flex-col'>
                <Label 
                    value="Your role in the facility*" 
                    className='mb-3'
                />
                <MedicalCategoryDropdown
                  options={userRole}
                  selected={formData.roleInFacility}
                  onSelect={(selectedRole) => handleInputChange('roleInFacility', selectedRole)}
                  isInvalid={isFieldInvalid('roleInFacility')}
                  value={formData.roleInFacility}
                  id='roleInFacility'
                  name='roleInFacility'
                  className={`block w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out  ${isFieldInvalid('roleInFacility') ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => setFormData({ ...formData, roleInFacility: e.target.value })}
                />
              </div>

        <div className='mb-4'>
            <span className='font-semibold'>Email *</span>
            <input
              className={`block w-full mt-1 px-3 py-2 border placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out  ${isFieldInvalid('email') ? 'border-red-500' : 'border-gray-300'}`}
              type="text"
              placeholder='Enter your email'
              id='email'
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              name='email'

            />
        </div>

        <div className='mb-4'>
        <span className='font-semibold'>Verify your email *</span>
            <input
              type="text"
              placeholder='Enter your email again'
              id='verifyEmail'
              name='verifyEmail'
              value={formData.verifyEmail}
              onChange={(e) => handleInputChange('verifyEmail', e.target.value)}
              className={`block w-full mt-1 px-3 placeholder-gray-400 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out  ${isFieldInvalid('verifyEmail') ? 'border-red-500' : 'border-gray-300'}`}
            />
        </div>

        <div>
        <span className='font-semibold'>Phone number *</span>
            <input
              className={`block w-full mt-1 placeholder-gray-400 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out  ${isFieldInvalid('phoneNumber') ? 'border-red-500' : 'border-gray-300'}`}
              type="text"
              placeholder='Enter your phone number'
              id='phoneNumber'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}

            />
        </div>
      </div>

      <div className='flex flex-col mt-4'>
        <span className='font-semibold'>Password *</span>
        <div className='flex items-end '>
          <input
            className={`block w-full mt-1 px-3 placeholder-gray-400 py-2 border rounded-tl-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out  ${isFieldInvalid('password') ? 'border-red-500' : 'border-gray-300'}`}
            style={{height: '40px'}}
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            id='password'
            name='password'
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}

          />
          <button
            className='border px-2 rounded-br-sm rounded-tr-sm border-gray-300 bg-white text-gray-400 active:bg-gray-200 transition duration-300 ease-in-out'
            onClick={() => setShowPassword(!showPassword)}
            style={{height: '40px'}}
          >
            {showPassword ? <BiSolidHide  /> : <BiSolidShow  />}
          </button>
        </div>
      </div>

      <div className='flex flex-col mt-4'>
        <span className='font-semibold'>Confirm password *</span>
        <div className='flex items-end  mb-4'>
          <input
            className={`block w-full sm:w-[35%] placeholder-gray-400  mt-1 px-3 py-2 border rounded-tl-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out  ${isFieldInvalid('confirmPassword') ? 'border-red-500' : 'border-gray-300'}`}
            style={{height: '40px'}}
            type={showPassword ? 'text' : 'password'}
            placeholder='Please confirm your password'
            id='confirmPassword'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          />
          <button
            className='border px-2 rounded-br-sm rounded-tr-sm border-gray-300 bg-white text-gray-400 active:bg-gray-200 transition duration-300 ease-in-out'
            onClick={() => setShowPassword(!showPassword)}
            style={{height: '40px'}}
          >
            {showPassword ? <BiSolidHide  /> : <BiSolidShow  />}
          </button>
        </div>

      <div>
        <div className='flex items-start gap-2'>
          <input
            className={`rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out ${isFieldInvalid('profileStatistcs') ? 'border-red-600' : 'border-gray-300'}`}
            type="checkbox"
            id='termsConditions'
            name='termsConditions'
            checked={formData.termsConditions}
            onChange={handleCheckbox}
          />
          <label htmlFor='termsConditions' className='text-sm py-2'>
            I accept 
            <Link>
              <span className='text-blue-500 mx-1'>the terms and conditions</span>
            </Link>
            of services provided by Medi-Pulso. I have read
            <Link>
              <span className='text-blue-500 mx-1'>the information on the processing of personal data .</span>
            </Link>
            *
          </label>
      </div>
      <div className='text-sm flex flex-col'>
        <div className='flex gap-2 items-center'>
          <input
            className='rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
            type="checkbox"
            id='profileStatistcs'
            name='profileStatistcs'
            checked={formData.profileStatistcs}
            onChange={handleCheckbox}
          />
          <label htmlFor='profileStatistcs'>
              We will send you profile statistics, review notifications and information
              <Link>
                <span className='text-blue-500 mx-1'>about Medi-Pulse features</span>
              </Link>
          
          </label>
        </div>
        <br />
        <span className='text-slate-400 ml-6 mt'>Uncheck if you do not want to receive such notifications.</span>

    </div>
    </div>
    </div>
    </div>
  )
}

export default SignupClinicMoreInfo