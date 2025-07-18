import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdClose } from "react-icons/md";
import useClickOutside from "../../hooks/useClickOutside";

const knownLanguages = [
  "English", "Spanish", "French", "German", "Portuguese", "Italian", "Arabic",
  "Russian", "Mandarin", "Hindi", "Bengali", "Polish", "Dutch", "Greek",
  "Hebrew", "Swedish", "Turkish", "Czech", "Hungarian", "Korean", "Japanese",
  "Ukrainian", "Norwegian", "Finnish", "Romanian", "Thai", "Vietnamese"
];

const LanguagesFilter = ({ allDoctors, setFilteredDoctors }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((lang) => lang !== language)
        : [...prev, language]
    );
  };

  const handleReset = () => {
    setSelectedLanguages([]);
    setFilteredDoctors(allDoctors);
  }

    useEffect(() => {
        if (selectedLanguages.length === 0) {
        setFilteredDoctors(allDoctors);
        return;
        }
    
        const normalizedSelected = selectedLanguages.map((l) => l.toLowerCase().trim());
    
        const filtered = allDoctors.filter((doctor) => {
        const normalizedDoctorLangs = doctor.languages?.map((lang) => lang.toLowerCase().trim()) || [];
        return normalizedSelected.some((selLang) => normalizedDoctorLangs.includes(selLang));
        });
    
        setFilteredDoctors(filtered);
    }, [selectedLanguages, allDoctors, setFilteredDoctors]);
  

  const filteredLanguageOptions = knownLanguages.filter((lang) =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="cursor-pointer flex items-center gap-1 border border-gray-300 rounded p-2"
        onClick={handleDropdownToggle}
      >
        <span className="text-gray-900">Languages</span>
        <IoIosArrowDown />
      </div>

      {isDropdownOpen && (
        <div className="absolute z-50 bg-white shadow-md p-4 rounded mt-2 w-80 border border-gray-200">
          <input
            type="text"
            placeholder="Search"
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="max-h-60 overflow-y-auto px-1">
            {filteredLanguageOptions.map((language) => (
              <label key={language} className="flex items-center mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(language)}
                  onChange={() => handleLanguageChange(language)}
                  className="mr-2 cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                {language}
              </label>
            ))}

            {filteredLanguageOptions.length === 0 && (
              <p className="text-sm text-gray-400">No results found</p>
            )}
          </div>

          {selectedLanguages.length > 0 && (
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

export default LanguagesFilter;
