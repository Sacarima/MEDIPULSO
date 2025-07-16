

function ProgressBar({ currentStep, totalSteps }) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div>
      <div className='w-full bg-gray-200 h-2.5 rounded-full'>
        <div
          className='bg-blue-600 h-2.5 rounded-full'
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className='text-center text-[13px] mt-2'>
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  )
}

export default ProgressBar