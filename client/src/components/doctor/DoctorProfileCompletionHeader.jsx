
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const DoctorProfileCompletionHeader = ({ completedSteps, step }) => {
  const steps = [
    { letter: 'A', title: 'Office name & address' },
    { letter: 'B', title: 'Service provided' },
    { letter: 'C', title: 'Consultation prices' },
    { letter: 'D', title: 'Payment method' },
    { letter: 'E', title: 'Certification' },
    { letter: 'F', title: 'Calendar' },
  ];

  const calculateProgressWidth = () => {
    return `${((step - 1) / (steps.length - 1)) * 100}%`;
  };

  return (
    <header className="bg-white sticky top-0 z-10">
      <div className="py-2 border-b border-gray-300">
        <nav className="w-full overflow-x-auto px-4 sm:px-6 md:px-8 lg:w-[70%] lg:mx-auto">
          <ul className="flex items-center gap-4 py-2 min-w-[600px] lg:min-w-0">
            {steps.map((item, index) => {
              const isCompleted = completedSteps.includes(index + 1);
              const isActive = step === index + 1;

              return (
                <li key={index} className="flex items-center gap-2 whitespace-nowrap">
                  {/* Circle showing letter or checkmark */}
                  <p
                    className={`flex items-center justify-center border-[1px] rounded-full w-8 h-8 shrink-0
                      ${isCompleted ? "text-[#00c3a5]" : ""}
                      ${isActive && !isCompleted ? "text-white bg-[#00c3a5]" : ""}
                      ${!isCompleted && !isActive ? "text-gray-500" : ""}`}
                  >
                    {isCompleted ? (
                      <IoIosCheckmarkCircleOutline className="text-gray-400 text-2xl" />
                    ) : (
                      item.letter
                    )}
                  </p>

                  {/* Step title */}
                  <p
                    className={`text-sm ${
                      isActive
                        ? "text-[#00c3a5] font-medium"
                        : isCompleted
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </p>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Progress bar */}
      <div className="relative h-[2px] bg-gray-200">
        <div
          className="absolute top-0 left-0 h-full bg-[#00c3a5] transition-all duration-300 ease-in-out"
          style={{ width: calculateProgressWidth() }}
        ></div>
      </div>
    </header>
  );
};

export default DoctorProfileCompletionHeader;
