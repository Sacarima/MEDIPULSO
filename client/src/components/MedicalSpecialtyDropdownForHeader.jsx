import { useState, useRef, useEffect } from 'react';
import { BiSolidBriefcase } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';
import axios from 'axios';
import useMediaQuery from '../hooks/useMediaQuery';

const MedicalSpecialtyDropdownForHeader = ({ selected, onSelect }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const dropdownRef = useRef(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/specialties`);
        setSpecialties(res.data.specialties || []);
      } catch (error) {
        console.error(" Failed to fetch specialties:", error);
      }
    };

    fetchSpecialties();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full  opacity-70 py-[10px] text-left border-gray-300 rounded-sm p-2 flex items-center justify-between focus:outline-none"
      >
        {selected || 'speciality, study or name'}
        <IoIosArrowDown
          className={`ml-2 text-white transition-transform ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute  lg:w-[500px] w-full bg-white border text-gray-500 border-gray-300 z-40 rounded-lg shadow-lg max-h-[15rem] sm:max-h-[20rem] overflow-auto mt-1">
          {specialties.map((spec) => (
            <li
              key={spec._id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
              onClick={() => handleSelect(spec.name)}
            >
              <div className="flex items-center gap-1">
                <BiSolidBriefcase className="text-blue-500" />
                {spec.name}
              </div>
              <span className="text-gray-400 ">Specialty</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicalSpecialtyDropdownForHeader;
