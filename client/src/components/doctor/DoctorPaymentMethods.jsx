

import { useState } from 'react'

const DoctorPaymentMethods = ({ handleNext, handleBack, setPaymentMethods }) => {
  const [selectedMethods, setSelectedMethods] = useState([])
  const [customMethod, setCustomMethod] = useState('')
  const [error, setError] = useState('')

  //  Handle checkbox selection
  const handleCheckboxChange = (method) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method) // Remove if already selected
        : [...prev, method] // Add if not selected
    )
    setError('') // Clear error when a method is selected
  }

  // Handle adding custom payment methods
  const handleAddCustomMethod = () => {
    if (customMethod.trim() && !selectedMethods.includes(customMethod)) {
      setSelectedMethods([...selectedMethods, customMethod.trim()])
      setCustomMethod('')
      setError('') // Clear error when adding a method
    }
  }

  //  Handle Next Step
  const handleNextStep = () => {
    if (selectedMethods.length === 0) {
      setError('Please select at least one payment method.')
      return
    }

    setPaymentMethods(selectedMethods) // Save selected methods
    handleNext()
  }

  return (
    <div>
      <section className="lg:pr-24 p-6 lg:mt-24 flex flex-col">
        <div>
          <h2 className="text-3xl mb-8">What type of payment methods do you accept in your office?</h2>
          <span className="font-medium">Select payment methods</span>

          {error && <p className="text-red-500">{error}</p>}

          {/* Payment Methods List */}
          {['Blik', 'Cash', 'Card payment', 'Bank transfer', 'Installment transfer', 'Revolut'].map((method, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id={method}
                name={method}
                className="rounded mt-2 text-3xl p-2 mb-2"
                checked={selectedMethods.includes(method)}
                onChange={() => handleCheckboxChange(method)}
              />
              <label htmlFor={method} className="">
                {method}
              </label>
            </div>
          ))}

          {/* Input for Custom Payment Method */}
          <div className="mt-5">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Add a custom payment method..."
              value={customMethod}
              onChange={(e) => setCustomMethod(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
              onClick={handleAddCustomMethod}
            >
              Add Method
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-end mt-auto">
          <button
            className="text-gray-500 border-[1px] w-24 mt-5 mb-2 py-2 rounded shadow-md"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className="text-white bg-blue-500 w-24 mt-5 mb-2 py-2 rounded"
            onClick={handleNextStep}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  )
}

export default DoctorPaymentMethods
