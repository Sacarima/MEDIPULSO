import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { CiAlarmOn } from 'react-icons/ci'
import { TbMessageDots } from 'react-icons/tb'
import { RiMenuSearchLine } from "react-icons/ri"
import { IoBulbOutline } from "react-icons/io5"
import { HiOutlineBuildingOffice2 } from "react-icons/hi2"
import { FaDiagnoses } from "react-icons/fa"
import { PiChatTeardropTextThin } from "react-icons/pi"
import { BsFillEnvelopeDashFill } from "react-icons/bs"
import { FaArrowDownWideShort } from "react-icons/fa6"
import { LiaDiagnosesSolid } from "react-icons/lia"
import { GiDuration } from "react-icons/gi"
import { TfiAlarmClock } from "react-icons/tfi"


const OptionsStep = ({ selectedOptions, onOptionSelect, onContinue }) => {

  const options = [
    { label: 'Detailed explanations', value: 'Detailed explanations' },
    { label: 'Physician involvement', value: 'Physician involvement' },
    { label: 'Treatment Effectiveness', value: 'Treatment Effectiveness' },
    { label: 'Friendly office', value: 'Friendly office' },
    { label: 'Punctuality', value: 'Punctuality' },
    { label: 'Others', value: 'Others_Positive' }
  ]
  
  const optionsNegative = [
    { label: 'Lack of communication', value: 'Lack of communication' },
    { label: 'Lack of empathy', value: 'Lack of empathy' },
    { label: 'I dont like the treatment', value: 'I dont like the treatment' },
    { label: 'The visit was too short', value: 'The visit was too short' },
    { label: 'Delayed visit', value: 'Delayed visit' }, 
    { label: 'Others', value: 'Others_Negative' }
  ]

  const iconMap = {
    'Detailed explanations': <RiMenuSearchLine  />,
    'Punctuality': <CiAlarmOn />  ,
    'Physician involvement': <IoBulbOutline />,
    'Treatment Effectiveness': <FaDiagnoses />,
    'Friendly office': <HiOutlineBuildingOffice2 />,
    'Others': <TbMessageDots />
  }

  const iconMapNegative = {
    'Lack of communication': <FaArrowDownWideShort />,
    'Lack of empathy': <BsFillEnvelopeDashFill />,
    'The visit was too short': <TfiAlarmClock />,
    'I dont like the treatment': <LiaDiagnosesSolid />,
    'Delayed visit': <GiDuration/>,
    'Others': <PiChatTeardropTextThin />
  }

  return (
    <div>
      <div>
        {/* POSITIVE REVVIEW */}
        <span className='font-medium text-xl block mb-2'>What did you like best?</span>
        <p className='text-gray-400 mb-8'>Please select at least one option</p>
        <div className='flex flex-wrap gap-2'>
          {options.map((option) => {
            const isSelected = selectedOptions.includes(option.value)
            return (
              <button
                key={option.value}
                onClick={() => onOptionSelect(option.value)}
                className={`px-3 py-2 rounded-md border inline-flex items-center
                  ${isSelected ? 'bg-[#00c3a621] border-[#00c3a5] text-[#00c3a5] font-medium' : 'bg-white border-gray-300 text-gray-700'}
                  hover:border-[#00c3a5] hover:bg-gray-50 transition-colors`}
              >
                {iconMap[option.label] && (
                  <span className={`mr-2 ${isSelected ? 'text-[#00c3a5]' : 'text-[#00c3a5]'}`}>
                    {iconMap[option.label]}
                  </span>
                )}
                {option.label}
              </button>
            )
          })}
        </div>
        {/* NEGATIVE REVIEW */}
        <span className='font-medium text-xl block my-6'>Is there anything worth improving?</span>
        <div className='flex flex-wrap gap-2'>
          {optionsNegative.map((option) => {
            const isSelected = selectedOptions.includes(option.value)
            return (
              <button
                key={option.value}
                onClick={() => onOptionSelect(option.value)}
                className={`px-3 py-2 rounded-md border inline-flex items-center
                  ${isSelected ? 'bg-red-50 border-red-500 text-red-500 font-medium' : 'bg-white border-gray-300 text-gray-700'}
                  hover:border-red-600  transition-colors`}
              >
                {iconMapNegative[option.label] && (
                  <span className={`mr-2 ${isSelected ? 'text-red-400' : 'text-red-500'}`}>
                    {iconMapNegative[option.label]}
                  </span>
                )}
                {option.label}
              </button>
            )
          })}
        </div>
        <div className='flex justify-end mt-4'>
          <button
            disabled={selectedOptions.length === 0}
            onClick={onContinue}
            className={
              `text-white px-3 py-2 rounded-sm flex items-center gap-1 transition-colors
               ${selectedOptions.length === 0
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`
            }
          >
            Continue <FaArrowRight className='text-2xl'/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default OptionsStep

