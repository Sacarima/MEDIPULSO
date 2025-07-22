import { useEffect, useState } from "react";
import { GoChevronRight } from "react-icons/go";
import { MdClose } from "react-icons/md";
import axios from "axios";
import useClickOutside from "../../hooks/useClickOutside"
import { useRef } from "react";
import { LiaTimesSolid } from "react-icons/lia";


const SpecialtyFilter = ({ allDoctors, setFilteredDoctors , onSpecialtySelect, setShowSpecialtyFilter}) => {
  const [specialties, setSpecialties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 



  const modalRef = useRef(null);
  const containerRef = useRef(null);

  useClickOutside(modalRef, () => setIsModalOpen(false));

  //Fetch specialties on mount
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/specialties`);
        setSpecialties(response.data.specialties || []);
      } catch (error) {
        console.error("Failed to fetch specialties:", error.message);
      }
    };
    fetchSpecialties();
  }, []);

  // Handle filtering when a specialty is selected
  const handleSpecialtyClick = (specialty) => {
    setSelectedSpecialty(specialty);
    const filtered = allDoctors.filter(
      (doctor) =>
        doctor.medicalCategory?.toLowerCase() === specialty.toLowerCase()
    );
    setFilteredDoctors(filtered);
    setIsModalOpen(false);
    onSpecialtySelect?.()
  };

  const handleClear = () => {
    setSelectedSpecialty(null);
    setFilteredDoctors(allDoctors);
  };

  const filteredSpecialties = specialties.filter((spec) =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
                
                return(
                    <div className="p-6 lg:w-[70%] mx-auto bg-blue-500 text-white rounded">
                        <div className="flex items-center justify-between font-medium">
                           <span>What kind of specialist are you looking for?</span>
                           <LiaTimesSolid 
                                className="cursor-pointer text-xl text-white hover:text-gray-100"
                                onClick={() => setShowSpecialtyFilter(false)}
                            />
                       </div>
                        <div className="w-full" ref={containerRef}>
                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                            {specialties.slice(0, 5).map((spec) => (
                            <span
                                key={spec._id}
                                onClick={() => handleSpecialtyClick(spec.name)}
                                className="bg-white text-blue-600 py-1 px-2 rounded font-medium cursor-pointer"
                            >
                                {spec.name}
                            </span>
                            ))}
                            <div
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-white text-blue-600 py-1 px-2 rounded font-medium cursor-pointer"
                            >
                            <span>See more</span>
                            <GoChevronRight className="text-gray-400" />
                            </div>
                        </div>
                        {isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
                            <div
                                ref={modalRef}
                                className="bg-white w-full max-w-md rounded shadow-lg p-6 relative"
                            >
                                <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Available Specializations
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    <MdClose size={20} />
                                </button>
                                </div>
                                <input
                                type="text"
                                placeholder="Search for a specialty..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded mb-4 text-gray-700"
                                />
                                <div className="max-h-60 overflow-y-auto">
                                {filteredSpecialties.map((spec) => (
                                    <div
                                    key={spec._id}
                                    onClick={() => handleSpecialtyClick(spec.name)}
                                    className="flex justify-between items-center text-gray-700 py-2 px-3 hover:bg-gray-100 cursor-pointer rounded"
                                    >
                                    <span>{spec.name}</span>
                                    <GoChevronRight className="text-gray-400" />
                                    </div>
                                ))}
                                {filteredSpecialties.length === 0 && (
                                    <p className="text-sm text-gray-400">No specialties found</p>
                                )}
                                </div>
                                {selectedSpecialty && (
                                <button
                                    onClick={handleClear}
                                    className="mt-4 w-full bg-[#00b39b] text-white py-1 rounded flex items-center justify-center"
                                >
                                    <MdClose className="mr-2" /> Clear Filter
                                </button>
                                )}
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
                );
            };

export default SpecialtyFilter;
