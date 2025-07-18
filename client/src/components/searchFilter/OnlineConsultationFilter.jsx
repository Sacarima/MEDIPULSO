import { useState, useEffect, useRef } from "react";
import { BsCameraVideoFill } from "react-icons/bs";
import { MdToggleOff, MdToggleOn } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import useClickOutside from "../../hooks/useClickOutside";

const OnlineConsultationFilter = ({ doctors, setFilteredDoctors, userLocation }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showOnlineConsultation, setShowOnlineConsultation] = useState(false);
    const [searchInMyLocation, setSearchInMyLocation] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

    // Toggle dropdown visibility
    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Toggle Online Consultation filter
    const handleOnlineConsultationToggle = () => {
        setShowOnlineConsultation((prev) => !prev);
        setSearchInMyLocation(false); // Reset location filter
    };

    // Toggle Location filter (only if Online Consultation is enabled)
    const handleLocationToggle = () => {
        if (!showOnlineConsultation) return;
        setSearchInMyLocation((prev) => !prev);
    };

    // Reset filters
    const handleReset = () => {
        setShowOnlineConsultation(false);
        setSearchInMyLocation(false);
        setFilteredDoctors(doctors);
    };

    // Apply filters dynamically
    useEffect(() => {

        let filtered = doctors;

        if (showOnlineConsultation) {
            filtered = filtered.filter((doctor) => {
                return doctor?.onlineConsultation === true; //Ensure explicit comparison
            });
    
        }

        if (showOnlineConsultation && searchInMyLocation) {
            filtered = filtered.filter((doctor) => {
                return doctor.city?.toLowerCase() === userLocation.toLowerCase();
            });
        }
       
        setFilteredDoctors(filtered);
    }, [showOnlineConsultation, searchInMyLocation, doctors, setFilteredDoctors, userLocation]);

    return (
        <div className="relative z-10" ref={dropdownRef}>
            {/* Button to trigger dropdown */}
            <div 
                className="flex items-center gap-1 cursor-pointer border-[1px] border-gray-300 rounded p-2" 
                onClick={handleDropdownToggle}
            >
                <BsCameraVideoFill className="text-gray-400" />
                <span className="text-gray-900">Online consultation</span>
                <IoIosArrowDown className="text-gray-500" />
            </div>

            {/* Dropdown Content */}
            {isDropdownOpen && (
                <div className="absolute bg-white shadow-lg p-4 rounded mt-2 w-80 border-[.5px]">
                    {/* First Toggle (Show Online Doctors) */}
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <span>Show all specialists who offer online consultation</span>
                        <div onClick={handleOnlineConsultationToggle} className="cursor-pointer text-xl">
                            {showOnlineConsultation ? (
                                <MdToggleOn className="text-[#00b39b] text-5xl" />
                            ) : (
                                <MdToggleOff className="text-gray-500 text-5xl" />
                            )}
                        </div>
                    </div>

                    {/*  Second Toggle (Search in My Location) */}
                    <div 
                        className={`flex justify-between items-center ${!showOnlineConsultation ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        onClick={handleLocationToggle}
                    >
                        <span>Search only in my location ({userLocation})</span>
                        <div className="text-xl">
                            {searchInMyLocation ? (
                                <MdToggleOn className="text-[#00b39b] text-5xl" />
                            ) : (
                                <MdToggleOff className="text-gray-500 text-5xl" />
                            )}
                        </div>
                    </div>

                    {/* Total Doctors Count (On the Far Right) */}
                    {showOnlineConsultation && (
                        <div className="text-sm text-right text-gray-500 mt-2">
                            {doctors.filter((doctor) => doctor.onlineConsultation).length}{" "}
                            {doctors.filter((doctor) => doctor.onlineConsultation).length === 1 ? "doctor available" : "doctors available"}
                        </div>
                    )}


                    {/* Reset Button (Only Appears If First Toggle is ON) */}
                    {showOnlineConsultation && (
                        <button 
                            className="bg-[#00b39b] text-white w-full mt-4 py-1 rounded" 
                            onClick={handleReset}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OnlineConsultationFilter;

