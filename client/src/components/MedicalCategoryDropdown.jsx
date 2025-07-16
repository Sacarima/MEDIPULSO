import { useState, useRef, useEffect } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { motion } from 'framer-motion'


const MedicalDropdownCategory = ({ options, selected, onSelect, isInvalid, className }) => {
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

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`w-full text-gray-600 opacity-70 py-[15px] text-left bg-white border ${isInvalid ? 'border-red-600' : 'border-gray-300'} rounded-sm p-2 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected || ' -- choose --'}
        <FaChevronDown className={`ml-2 transition-transform text-gray-700 ${isOpen ? 'rotate-180 ease-in' : 'rotate-0 ease-out'}`} />
      </button>
      {isOpen && (
        <motion.ul 
          className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-[15rem] sm:max-h-[20rem] overflow-auto mt-1"
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: {
              clipPath: "inset(0% 0% 0% 0% round 10px)",
              transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
              }
            },
            closed: {
              clipPath: "inset(50% 50% 50% 50% round 10px)",
              transition: {
                when: "afterChildren"
              }
            }
          }}
        >
          {options.map((option, index) => (
            <motion.li
              key={index}
              className="p-2 hover:bg-blue-400 hover:text-white cursor-pointer"
              onClick={() => handleSelect(option)}
              variants={itemVariants}
            >
              {option}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}

export default MedicalDropdownCategory
