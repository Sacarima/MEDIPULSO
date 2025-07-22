import { useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import useClickOutside from "../../hooks/useClickOutside";
import axios from "axios";
import dayjs from "dayjs";

const AvailableDatesFilter = ({ originalDoctors, setFilteredDoctors }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("whenever");
  const dropdownRef = useRef(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOptionChange = async (value) => {
    setSelectedOption(value);
    setIsDropdownOpen(false);

    // Handle availability logic
    if (value === "whenever") {
      setFilteredDoctors(originalDoctors);
      return;
    }

    const today = dayjs();
    const targetDate = value === "today" ? today : today.add(3, "day");
    const formattedDate = targetDate.format("YYYY-MM-DD");

    try {
      const response = await axios.get(`${API_BASE_URL}/api/doctor-form/search?availability=${formattedDate}`);
      const availableDoctors = response.data.doctors || [];

      const filtered = originalDoctors.filter((doc) =>
        availableDoctors.some((d) => d._id === doc._id)
      );

      setFilteredDoctors(filtered);
    } catch (error) {
      console.error(" Error fetching available doctors:", error);
      setFilteredDoctors([]);
    }
  };

  const handleClear = () => {
    setSelectedOption("whenever");
    setFilteredDoctors(originalDoctors);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="cursor-pointer flex items-center gap-1 border-[1px] border-gray-300 rounded p-2"
        onClick={handleDropdownToggle}
      >
        <span className="text-gray-900">Available dates</span>
        <IoIosArrowDown className="text-gray-500" />
      </div>

      {isDropdownOpen && (
        <div className="absolute bg-white shadow-md p-4 rounded mt-2 w-80 border-[.5px] z-50">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="availability"
                value="today"
                checked={selectedOption === "today"}
                onChange={() => handleOptionChange("today")}
              />
              Today
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="availability"
                value="within3days"
                checked={selectedOption === "within3days"}
                onChange={() => handleOptionChange("within3days")}
              />
              Within 3 days
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="availability"
                value="whenever"
                checked={selectedOption === "whenever"}
                onChange={() => handleOptionChange("whenever")}
              />
              Whenever
            </label>
          </div>

          {selectedOption !== "whenever" && (
            <button
              className="bg-[#00b39b] text-white w-full mt-4 py-1 rounded"
              onClick={handleClear}
            >
              Clear Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailableDatesFilter;
