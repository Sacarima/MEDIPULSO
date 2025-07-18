
import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { MdKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import { useNavigate } from "react-router-dom"
import { useDoctor } from "./context/DoctorContext"

// Helper functions
const generateDates = (startDate, numberOfDays = 60) => {
  const dates = [];
  for (let i = 0; i < numberOfDays; i++) {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + i);
    dates.push(newDate);
  }
  return dates;
};

const formatDay = (date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleString("en-us", { weekday: "short" });
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-us", { day: "numeric", month: "short" });
};

const CustomArrow = ({ onClick, direction }) => (
  <div
    onClick={onClick}
    className={`absolute ${
      direction === "left" ? "left-[-20px] z-10 top-[10px]" : "right-[-20px] top-[10px]"
    } cursor-pointer bg-blue-100 text-blue-500 p-2 rounded-full`}
  >
    {direction === "left" ? (
      <MdKeyboardArrowLeft className="text-xl" />
    ) : (
      <MdOutlineKeyboardArrowRight className="text-xl" />
    )}
  </div>
);

const Carousel = ({ doctorId }) => {
  const today = new Date();
  const [dates, setDates] = useState(generateDates(today, 60)); // Extend to 60 days (2 months)
  const [availableTimes, setAvailableTimes] = useState({});
  const [visibleRows, setVisibleRows] = useState(5); // Control visible rows
  const [startIndex, setStartIndex] = useState(0); // Control visible days
  const sliderRef = useRef(null); // Reference for the slider
  const doctorData = useDoctor()
  const navigate = useNavigate()

  

  const fetchMonthlyAvailability = async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:7500/api/doctor-availability/${doctorId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include credentials for authentication
      });

        if (response.status === 404) {
          console.warn(`No availability found for doctor ${doctorId}.`);
          setAvailableTimes({});  
          return;
        }
    
        if (!response.ok) {
          throw new Error(`HTTP Error! status: ${response.status}`);
        }

      const data = await response.json();
      const availability = data.availability || {};
      const monthlyAvailability = availability.monthlyAvailability || [];

      // Map the availability to a date-based format
      const mappedAvailability = {};
      monthlyAvailability.forEach((entry) => {
        entry.dates.forEach((dateObj) => {
          const formattedDate = new Date(dateObj.date).toISOString().split("T")[0];
          mappedAvailability[formattedDate] = dateObj.times?.length ? dateObj.times : ["-"];
        });
      });

      setAvailableTimes(mappedAvailability);
    } catch (error) {
      console.error("Failed to fetch monthly availability:", error)
      setAvailableTimes({}); // Reset to empty object
    }
  };

  useEffect(() => {
    fetchMonthlyAvailability(doctorId);
  }, [doctorId]);

  const handleNext = () => {
    if (startIndex + 4 < dates.length) {
      setStartIndex((prev) => prev + 4);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 4);
    }
  }

  const handleTimeSlotClick = (date, timeSlot) => {
    // Format the date, time, and year
    const formattedDate = date.toLocaleDateString("en-us", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const slot = `${formattedDate} ${timeSlot}`; 

    // Save selected slot to localStorage
    localStorage.setItem("selectedSlot", slot)

    // Debugging: Check if slot is stored
    console.log("Saved to LocalStorage:", localStorage.getItem("selectedSlot"));
  
    // Redirect to the doctor-appointment page
    navigate(`/doctor-appointment/${doctorId}`, { state: { slot } });
  };
 

  const visibleDates = dates.slice(startIndex, startIndex + 4);

  return (
    <div className="relative flex flex-col gap-4 items-center">
      {/* Navigation Arrows */}
      <div className="relative w-full flex justify-between items-center">
        {/* Left Arrow */}
        <CustomArrow
          onClick={handlePrev}
          direction="left"
          className={startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}
        />

        {/* Dates */}
        <div className="flex  gap-4 mx-auto">
          {visibleDates.map((date, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer rounded-md w-32 text-center  text-gray-700"
            >
              <p className="text-sm">{formatDay(date)}</p>
              <p>{formatDate(date)}</p>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <CustomArrow
          onClick={handleNext}
          direction="right"
          className={startIndex + 4 >= dates.length ? "opacity-50 cursor-not-allowed" : ""}
        />
      </div>

      {/* Time Slots */}
      <div className="grid grid-cols-4 gap-4 text-center mt-4">
        {visibleDates.map((date, colIndex) => {
          const formattedDate = date.toISOString().split("T")[0];
          const timeSlots = availableTimes[formattedDate] || ["-"];
          const displayedSlots = [
            ...timeSlots.slice(0, visibleRows),
            ...(visibleRows > timeSlots.length ? Array(visibleRows - timeSlots.length).fill("-") : []),
          ];

          return (
            <div key={colIndex} className="flex  gap-2 flex-col">
              {displayedSlots.map((timeSlot, rowIndex) => (
                <div
                  key={`${colIndex}-${rowIndex}`}
                  className={`p-2 ${
                    timeSlot !== "-"
                      ? "bg-blue-50 w-32 hover:border-[1px] h-10  border-blue-500 text-blue-500 font-medium rounded-md cursor-pointer "
                      : "text-gray-400 w-32"
                  }`}
                  
                  onClick={() => {
                    if (timeSlot !== "-") {
                      handleTimeSlotClick(date, timeSlot); // Call the handler with date and time
                    }
                  }}
                >
                  {timeSlot}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Show More Hours */}
      <button
        onClick={() => setVisibleRows((prev) => prev + 5)}
        className="text-blue-500 py-2 flex m-auto items-center gap-2"
      >
        <p>Show more hours</p>
      </button>
    </div>
  );
};

export default Carousel;






