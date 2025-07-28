import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DoctorPhotoGallery = ({ photoURLs = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const modalRef = useRef();

  const handleOpenModal = (index) => {
    setActiveIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % photoURLs.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + photoURLs.length) % photoURLs.length);
  };

  const displayedPhotos = photoURLs.slice(0, 3);
  const hiddenCount = photoURLs.length - 3;

  return (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-4">
        {/* Large left photo */}
        {displayedPhotos[0] && (
          <div
            className="col-span-2 cursor-pointer"
            onClick={() => handleOpenModal(0)}
          >
            <img
              src={displayedPhotos[0]}
              alt="Doctor Photo 1"
              className="w-full h-[300px] object-cover rounded-md"
            />
          </div>
        )}

        {/* Two stacked right photos */}
        <div className="flex flex-col gap-4">
          {displayedPhotos[1] && (
            <div
              className="w-full h-[140px] cursor-pointer"
              onClick={() => handleOpenModal(1)}
            >
              <img
                src={displayedPhotos[1]}
                alt="Doctor Photo 2"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}
          {displayedPhotos[2] && (
            <div
              className="relative w-full h-[140px] cursor-pointer"
              onClick={() => handleOpenModal(2)}
            >
              <img
                src={displayedPhotos[2]}
                alt="Doctor Photo 3"
                className="w-full h-full object-cover rounded-md"
              />
              {hiddenCount > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-xl font-semibold rounded-md">
                  +{hiddenCount}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div
            ref={modalRef}
            className="relative bg-white p-4 rounded-lg max-w-[90%] max-h-[90%] flex flex-col items-center"
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-black"
            >
              <FaTimes size={24} />
            </button>

            <img
              src={photoURLs[activeIndex]}
              alt={`modal-photo-${activeIndex}`}
              className="max-h-[70vh] w-auto rounded-md"
            />

            <div className="flex justify-between w-full mt-4">
              <button onClick={handlePrev} className="text-gray-700 hover:text-black">
                <FaChevronLeft size={28} />
              </button>
              <button onClick={handleNext} className="text-gray-700 hover:text-black">
                <FaChevronRight size={28} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPhotoGallery;
