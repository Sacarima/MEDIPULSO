import { useState, useRef, useEffect } from 'react'
import { FaChevronDown } from 'react-icons/fa'

const MedicalDropdownCategory = ({ options, selected, onSelect, isInvalid, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`w-full text-gray-600 opacity-70 text-left bg-white border ${isInvalid ? 'border-red-600' : 'border-gray-300'} rounded-sm p-2 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected || ' -- choose --'}
        <FaChevronDown className={`ml-2 transition-transform text-gray-700 ${isOpen ? 'rotate-180 ease-in' : 'rotate-0 ease-out'}`} />
      </button>
      {isOpen && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-[15rem] sm:max-h-[20rem] overflow-auto mt-1">
          {options.map((option, index) => (
            <li
              key={index}
              className="p-2 hover:bg-blue-400 hover:text-white cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicalDropdownCategory;
