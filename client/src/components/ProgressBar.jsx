import React from 'react';

function ProgressBar({ currentStep, totalSteps }) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div>
      <div className='w-full bg-gray-200 h-2.5 rounded-full'>
        <div
          className='bg-green-600 h-2.5 rounded-full'
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className='text-center text-[13px] mt-2'>
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}

export default ProgressBar;

// different from original

//     <div className="w-full bg-neutral-200 dark:bg-neutral-600 h-2.5 rounded-full mb-2">
//       <div
//         className="bg-green-600 h-3 text-center text-xs rounded-md font-medium leading-none text-slate-100"
//         style={{ width: `${progressPercentage}%` }}
//       >
//         {`${Math.round(progressPercentage)}%`}
//       </div>
//     </div>
//   
