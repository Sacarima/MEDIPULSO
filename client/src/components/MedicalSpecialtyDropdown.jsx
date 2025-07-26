import { useState, useRef, useEffect } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { BiSolidBriefcase } from "react-icons/bi"
import { motion } from 'framer-motion'

const MedicalDropdownCategory = ({ options, selected, onSelect, isInvalid }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (option) => {
    onSelect(option)
    setIsOpen(false)
  }

 const  container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`w-full text-gray-600 opacity-70 py-[14px] text-left bg-white borde-none ${isInvalid ? 'border-red-600' : 'border-gray-300'} rounded-sm p-2 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected || ' speciality, study or name'}
        <FaChevronDown className={`ml-2 transition-transform text-gray-700 ${isOpen ? 'rotate-180 ease-in' : 'rotate-0 ease-out'}`} />
      </button>
      {isOpen && (
        <motion.ul 
          className="absolute min-w-full md:min-w-[500px] lg:w-full bg-white  rounded-lg shadow-lg max-h-[15rem] sm:max-h-[20rem] overflow-auto mt-1"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {options.map((option, index) => (
            <motion.li
              key={index}
              className=" p-2 hover:bg-gray-100 hover:text-black cursor-pointer flex justify-between w-full"
              onTouchStart={() => handleSelect(option)}
              onMouseDown={() => handleSelect(option)}
              variants={item}
            >
              <div className='flex items-center gap-1'>
              <BiSolidBriefcase className='text-blue-500'/>
                {option}
            </div>
              <span className='text-gray-400 hidden md:block'>Specialties</span>
            </motion.li>
            
            
          ))}
        </motion.ul>
      )}
    </div>
  )
}

export default MedicalDropdownCategory
