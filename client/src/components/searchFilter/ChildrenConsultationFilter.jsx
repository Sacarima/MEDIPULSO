import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdToggleOff, MdToggleOn, MdClose } from "react-icons/md";
import useClickOutside from "../../hooks/useClickOutside";

const ChildrenConsultationFilter = ({ allDoctors, setFilteredDoctors }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [acceptsChildren, setAcceptsChildren] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleToggleAcceptsChildren = () => {
    setAcceptsChildren((prev) => !prev);
  };

  const handleReset = () => {
    setAcceptsChildren(false);
    setFilteredDoctors(allDoctors);
  };

  useEffect(() => {
    if (!acceptsChildren) {
      setFilteredDoctors(allDoctors);
      return;
    }

    const filtered = allDoctors.filter((doctor) => doctor.acceptChildren === true);
    setFilteredDoctors(filtered);
  }, [acceptsChildren, allDoctors, setFilteredDoctors]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="cursor-pointer flex items-center gap-1 border border-gray-300 rounded p-2"
        onClick={handleDropdownToggle}
      >
        <span className="text-gray-900">Children consultation</span>
        <IoIosArrowDown />
      </div>

      {isDropdownOpen && (
        <div className="absolute z-50 bg-white shadow-md p-4 rounded mt-2 w-80 border border-gray-200">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <span>Specialists who treat younger patients</span>
            <div onClick={handleToggleAcceptsChildren} className="cursor-pointer text-xl">
              {acceptsChildren ? (
                <MdToggleOn className="text-[#00b39b] text-5xl" />
              ) : (
                <MdToggleOff className="text-gray-500 text-5xl" />
              )}
            </div>
          </div>

          {acceptsChildren && (
            <button
              onClick={handleReset}
              className="mt-4 w-full bg-[#00b39b] text-white py-1 rounded flex items-center justify-center"
            >
              <MdClose className="mr-2" /> Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChildrenConsultationFilter;
