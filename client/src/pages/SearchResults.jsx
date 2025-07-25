import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DoctorPublicProfileHeader from "../components/DoctorPublicProfileHeader";
import axios from "axios";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { BsCameraVideoFill } from "react-icons/bs";
import Carousel from "../components/Carousel";
import { IoIosArrowDown } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import OnlineConsultationFilter from "../components/searchFilter/OnlineConsultationFilter"
import AvailableDatesFilter from "../components/searchFilter/AvailableDatesFilter"
import LanguagesFilter from "../components/searchFilter/LanguagesFilter"
import ChildrenConsultationFilter from "../components/searchFilter/ChildrenConsultationFilter"
import SpecialtyFilter from "../components/searchFilter/SpecialtyFilter"

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]); // Store filtered doctors
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [userLocation, setUserLocation] = useState("");

    const [activeTabs, setActiveTabs] = useState({}); // Maintain active tab per doctor

    const { specialty, locationQuery, results , message} = location.state || {}
    const [showSpecialtyFilter, setShowSpecialtyFilter] = useState(true)

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 


    // Set user's location from the query if available
    useEffect(() => {
        if (locationQuery) {
            setUserLocation(locationQuery); //Use the location from the first query
        }
    }, [locationQuery]);

    
    useEffect(() => {
        if (!results && results.length === 0) {
            setSearchResults([]);
            setFilteredDoctors([]);
            setErrorMessage(message || "No doctors found for the selected criteria.");
            setIsLoading(false);
           
        }


        const fetchReviewsForDoctors = async () => {
            try {
                const reviewRequests = results.map(async (doctor) => {
                    try {
                        const reviewResponse = await axios.get(`${API_BASE_URL}/api/reviews/${doctor._id}`);
                        const reviews = reviewResponse.data || [];

                        console.log(` Doctor ${doctor.firstName} acceptChildren:`, doctor.acceptChildren)

                        return {
                            ...doctor,
                            reviewCount: reviews.length || 0,
                            reviews: reviews,
                        };

                    } catch (err) {
                        return {
                            ...doctor,
                            reviewCount: 0,
                            reviews: [],
                        };
                    }
                });

                const doctorsWithReviews = await Promise.all(reviewRequests);
                setSearchResults(doctorsWithReviews);
                setFilteredDoctors(doctorsWithReviews);
            } catch (error) {
                console.error(" Error fetching reviews:", error.response?.data || error.message);
                setErrorMessage("Failed to fetch reviews.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviewsForDoctors();
    }, [results]);

      useEffect(() => {
        if (location.state?.results?.length > 0) {
          setSearchResults(location.state.results);
          setFilteredDoctors(location.state.results);
          setErrorMessage(""); // Clear previous error
        }
      }, [location.state?.timestamp]); // watch timestamp for every search
      
      
    //Handle navigation clicks for each doctor independently
    const handleTabClick = (doctorId, tab) => {
        setActiveTabs((prev) => ({
            ...prev,
            [doctorId]: tab,
        }));
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <DoctorPublicProfileHeader setShowSpecialtyFilter={setShowSpecialtyFilter} />

            {/* Filter Navigation */}
            <div className="bg-white sticky top-0 z-40">
                <div className="lg:w-[70%] mx-auto rounded">
                    <nav>
                        <ul className="flex flex-wrap px-4 lg:px-0 items-center gap-4 py-4">
                            <li>
                                <OnlineConsultationFilter 
                                    doctors={searchResults} 
                                    setFilteredDoctors={setFilteredDoctors} 
                                    userLocation={userLocation} 
                                />
                            </li>
                            <li>
                                <AvailableDatesFilter
                                    originalDoctors={searchResults}
                                    setFilteredDoctors={setFilteredDoctors}
                                />
                            </li>
                        
                            <li>
                                <LanguagesFilter
                                allDoctors={searchResults}
                                setFilteredDoctors={setFilteredDoctors}
                                />
                            </li>
                            <li>
                                <ChildrenConsultationFilter
                                allDoctors={searchResults}
                                setFilteredDoctors={setFilteredDoctors}
                                />

                            </li>
                            <li className="cursor-pointer flex items-center gap-1 border-[1px] border-gray-300 rounded p-2">
                                <IoFilter />
                                <span className="text-gray-900">More filters</span>
                                <IoIosArrowDown />
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="flex items-center justify-between p-2 lg:w-[70%] mx-auto my-2">
                <h2 className="text-xl font-bold lg:mt-6">Search results</h2>
                <p className="text-gray-500 underline cursor-pointer">How Search Result Work</p>
            </div>
            
            {searchResults.length > 0 && showSpecialtyFilter && (
            <SpecialtyFilter
                allDoctors={searchResults}
                setFilteredDoctors={setFilteredDoctors}
                onSpecialtySelect={() => setShowSpecialtyFilter(false)}  
                onClearFilter={() => setShowSpecialtyFilter(true)}
                setShowSpecialtyFilter={setShowSpecialtyFilter}
            />
            )}



            <div className="lg:w-[70%] mx-auto mt-6">
                {isLoading ? (
                    <p>Loading...</p>
                ) : errorMessage ? (
                    <p className="text">{errorMessage}</p>
                ) : filteredDoctors.length > 0 ? (
                    <ul>
                        {filteredDoctors.map((doctor) => {
                            const activeTab = activeTabs[doctor._id] || "address";

                            return (
                                <li key={doctor._id} className="bg-white w-full mb-6 px-4 rounded shadow-md flex justify-between">
                                    <div className="flex-1 border-r-[1px] border-gray-300 pr-4">
                                        <section className="flex mt-6">
                                            <div 
                                                className="pr-2 mr-3 cursor-pointer"
                                                onClick={() => navigate(`/profile-info/${doctor._id}`)}
                                            >
                                                <img className="w-[120px] h-[120px] rounded-full" src={doctor?.profilePicture} alt="Doctor Profile" />
                                            </div>
                                            <div className="grow">
                                                <div className="flex justify-between">
                                                    <div 
                                                        className="flex gap-1 items-center cursor-pointer"
                                                        onClick={() => navigate(`/profile-info/${doctor._id}`)}
                                                    >
                                                        <span className="font-bold">Dr.</span>
                                                        <p className="font-bold">{doctor?.firstName}</p>
                                                        <p className="font-bold">{doctor?.lastName}</p>
                                                        <p className="font-bold">{doctor?.acceptChildren}</p>

                                                    </div>
                                                </div>

                                                <div className="flex gap-1 mt-2">
                                                    <p>{doctor?.medicalCategory}</p>
                                                    <p className="cursor-pointer underline">more</p>
                                                </div>

                                                <div className="flex gap-4 mt-2">
                                                    <p>{doctor?.city}</p>
                                                    <p className="underline cursor-pointer">1 address</p>
                                                </div>

                                                <div className="flex items-center">
                                                    <MdOutlineStarPurple500 className="text-[#00c3a5] text-2xl" />
                                                    <p className="ml-2">{doctor.reviewCount} {doctor.reviewCount === 1 ? "review" : "reviews"}</p>
                                                </div>
                                            </div>
                                        </section>

                                        <nav className="flex gap-4 border-b-[.5px] border-gray-300 mt-6">
                                            <div
                                                className={`flex items-center gap-2 cursor-pointer pb-3 ${
                                                    activeTab === "address" ? "border-b-4 border-gray-700 text-gray-700 font-semibold" : "text-gray-500"
                                                }`}
                                                onClick={() => handleTabClick(doctor._id, "address")}
                                            >
                                                <p>Address</p>
                                            </div>
                                            <div
                                                className={`flex items-center gap-2 cursor-pointer pb-3 ${
                                                    activeTab === "online" ? "border-b-4 border-gray-700 text-gray-700 font-semibold" : "text-gray-500"
                                                }`}
                                                onClick={() => handleTabClick(doctor._id, "online")}
                                            >
                                                <BsCameraVideoFill className="text-gray-500 text-2xl" />
                                                <p>Online</p>
                                            </div>
                                        </nav>
                                    </div>
                                    <div className="flex-1 px-4 hidden lg:block">
                                        <Carousel doctorId={doctor._id} onDateSelect={(date) => console.log("Selected Date:", date)} />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-slate-500 text-xl">No doctors found for your search criteria.</p>
                )}
            </div>
        </div>
    );
}

export default SearchResults;
