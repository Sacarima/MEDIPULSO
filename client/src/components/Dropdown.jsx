import { useState } from 'react';
import { AiOutlineCaretRight, AiOutlineCaretLeft } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center">
      <button
        className="w-full flex items-center pl-2 justify-between gap-1 font-bold rounded-lg tracking-wider border-4 border-transparent md:hidden"//adjust the padding
        // Toggle the dropdown menu
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Register for free
        {!isOpen ? (
          <AiOutlineCaretRight className="h-8 pb-1" />
        ) : (
          <AiOutlineCaretLeft className="h-8" />
        )}
      </button>
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-gray-800 text-white rounded-lg p-4 md:w-auto md:top-10 md:right-0 md:left-auto md:bg-transparent md:text-black md:p-0 md:static">
          <div className="w-full p-4 flex flex-col items-center rounded-lg justify-center md:flex-row md:space-x-4 md:space-y-0 space-y-2">
            <Link to="/signup" className="w-full text-center hover:font-semibold md:hover:text-blue-500">
              As a Client
            </Link>
            <Link to="/doctors" className="w-full text-center hover:font-semibold md:hover:text-blue-500">
              As a Doctor
            </Link>
            <Link to="/clinic" className="w-full text-center hover:font-semibold md:hover:text-blue-500">
              As a Facility
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
