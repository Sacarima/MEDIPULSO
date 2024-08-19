import {useState } from 'react'
import { Link } from 'react-router-dom'
import { BiSolidShow, BiSolidHide  } from "react-icons/bi";
import { Label } from 'flowbite-react'
import MedicalCategoryDropdown from '../components/MedicalCategoryDropdown';

const SignupClinicMoreInfo = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({})

  const handleRoleSelect = (role) => {
    setFormData({
        ...formData,
        role
    })
    }


  const userRole = [
    "Owner", "Manager", "Receptionist", "Doctor", "Nurse", "Memberr of the medical staff", "Other", "Not applicable", "Member of the board", "Administrator", "IT specialist", "Accountant", "HR specialist", "Marketing specialist", "Sales specialist", "Other"
  ]


  return (
    <div>
      <div className='sm:w-full sm:ml-auto sm:mr-8'>
        <h3 className='text-slate-400 text-xl font-semibold'>your data</h3>
        <span>The data below will not be visible, we only need it to set up your profile.</span>
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
                    className='rounded-sm border text-sm mt-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                    placeholder="Name"
                    id="username"
                    
                  />
                </div>
                <div className='flex flex-col w-full sm:w-[46%]'>
                  <Label value="Last name*" />
                  <input
                    type="text"
                    className='rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                    placeholder="Last name"
                    id="surname"
                    
                  />
                </div>
              </div>

              <div className='mt-4 flex flex-col'>
                <Label 
                    value="Your role in the facility*" 
                    className='mb-3'
                />
                <MedicalCategoryDropdown
                  options={userRole}
                  selected={formData.role}
                  onSelect={handleRoleSelect}
                />
              </div>

        <div className=''>
            <span className='font-semibold'>Email *</span>
            <input
              className='w-full rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
              type="text"
            />
        </div>

        <div>
        <span className='font-semibold'>Verify your email *</span>
            <input
              className='w-full rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
              type="text"
            />
        </div>

        <div>
        <span className='font-semibold'>Phone number *</span>
            <input
              className='w-full rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
              type="text"
            />
        </div>
      </div>

      <div className='flex flex-col mt-4'>
        <span className='font-semibold'>Password *</span>
        <div className='flex items-end '>
          <input
            className='rounded-bl-sm rounded-tl-sm w-[35%] border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
            style={{height: '40px'}}
            type={showPassword ? 'text' : 'password'}
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
        <div className='flex items-end '>
          <input
            className='rounded-bl-sm rounded-tl-sm w-[35%] border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
            style={{height: '40px'}}
            type={showPassword ? 'text' : 'password'}
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
            className='rounded-smborder mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
            type="checkbox"
            id='terms'
          />
          <label htmlFor='terms' className='text-sm py-2'>
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
            id='privacy'
          />
          <label htmlFor='privacy'>
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