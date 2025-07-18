import { IoCheckmark } from "react-icons/io5"
import securityImage from '../assets/ilustratorgray.png'
import logo from '../assets/fivicon.png'
import dataimage from '../assets/ilustrator.png'
import { CgNotes } from "react-icons/cg"
import { BsFileEarmarkPost } from "react-icons/bs"
import { HiCheckBadge } from "react-icons/hi2"
import DataPrivacyHeader from '../components/DataPrivacyHeader'
import DataPrivacyFooter from '../components/DataPrivacyFooter'

export default function DataPrivacy() {
  return (
    <div className=''>
        <DataPrivacyHeader />
        <div className='bg-[#f7f9fa]'>
          <section className='lg:w-[70%] w-full m-auto flex flex-col lg:flex-row px-4 pt-14 pb-8'>

            <div className='lg:w-[60%] order-2 lg:order-none'>
              <div className='sm:m flex flex-col justify-center sm:min-h-full'>
                <h2 className='text-3xl mb-3 text-center lg:text-start mt-8 '>Your and your patients' data is safe with us</h2>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='bg-white p-2 rounded-full'>
                    <IoCheckmark className='text-[#00b39be6] text-xl'/>
                  </div>
                  <p>The data you enter remains your exclusive property</p>
                </div>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='bg-white p-2 rounded-full'>
                    <IoCheckmark className='text-[#00b39be6]'/>
                  </div>
                  <p>All information is encrypted and secure</p>
                </div>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='bg-white p-2 rounded-full'>
                    <IoCheckmark className='text-[#00b39be6]'/>
                  </div>
                  <p>Medi-Pulse does not share or sell your data</p>
                </div>
                  <div>
                    <button className='bg-blue-500 text-white py-2 px-2 rounded-[3px] mt-6 cursor-pointer w-full lg:w-auto'>Learn more</button>
                  </div>
              </div>
            </div>

            <div className='lg:w-[40%] order-1 lg:order-none '>
              <img src={securityImage} alt="" />
            </div>

          </section>
        </div>

        <div className=''>
          <section className='lg:w-[70%] m-auto flex flex-col lg:flex-row px-4 pt-14 pb-8 gap-4 '>
          <div className='lg:w-[50%] '>
              <img className='w-[80%] mx-auto lg:mx-none' src={dataimage} alt="" />
            </div>

            <div className='lg:w-[50%] fle'>
              <div className='flex flex-col justify-center sm:min-h-full'>
                <h2 className='text-3xl mb-3 '>You are the sole owner of your datas</h2>
                <div className='flex items-center gap-2 mb-3'>
                  
                  <p>We want to dispel any doubts you might have about the security of the data entrusted to us. The guiding principle is:</p>
                </div>
                <div className='flex items-center gap-2 mb-3'>
                  
                  <p className='font-medium'>Everything you enter into the system remains your exclusive property</p>
                </div>
                <div className=''>
                  
                  <span className='font-medium'>Your data will not be shared or distributed.</span>
                  <p>This means we will never share or sell your information to third parties, other practices, clinics or doctors.</p>
                </div>
              </div>
            </div>
            
          </section>
        </div>

        <div className='bg-[#f7f9fa]'>
          <section className='lg:w-[70%] m-auto px-4 pt-14 pb-8 '>
            <div className='lg:w-[70%] m-auto'>
              <h2 className='text-center text-2xl mb-3'>Patient data from Medi-Pulse also belongs to you</h2>
              <p className='mb-3'>We hope that you no longer have any doubts about the security of your patients' data. And what about the data of new patients who come to you via the Medi-Pulse service?
                <span className='font-medium ml-1'>Your current patients and patients acquired from the Medi-Pulse service are saved in separate databases </span>
                that will never mix. The same security rules apply to both.
              </p>
              <p className='text-center'>The only difference is that we occasionally send promotional offers to patients who reached you via Medi-Pulse.</p>
            </div>
            <div className='flex flex-col lg:flex-row gap-3 mt-10 mb-4'>
              <div className='lg:w-[50%] bg-blue-500 rounded pb-12'>
                <div className='px-6 pt-6'>
                  <CgNotes className='text-5xl text-white bg-[#dedede66] p-3 rounded mb-3'/>
                  <h2 className='text-white font-medium pt-4'>Your patient's data</h2>
                  <hr className='my-4'/>
                  <ul className='text-white'>
                    <li>• No part of your data is shared or sold to third parties</li>
                    <hr className='my-4'/>
                    <li>• Medi-Pulse does not send promotional messages to your patients (you can, however, send your patients personalized promotional offers)</li>
                    <hr className='my-4'/>
                    <li>• Other clinics and doctors do not have access to your data (unless you grant them access to manage your practice)</li>
                  </ul>
                </div>
              </div>

              <div className='lg:w-[50%] bg-[#00b39be6] rounded'>
              <div className='px-6 pt-6'>
                  <img className='text-5xl w-12 text-white bg-[#dedede66] p-3 rounded mb-3' src={logo} alt='logo'/>
                  <h2 className='text-white font-medium pt-4'>Your patients' data obtained by Medi-Pulse</h2>
                  <hr className='my-4'/>
                  <ul className='text-white'>
                    <li>• No part of your data is shared or sold to third parties</li>
                    <hr className='my-4'/>
                    <li>• We send promotional offers only to those patients who have expressed such a desire (they can resign from this at any time)</li>
                    <hr className='my-4'/>
                    <li>• You only have access to information that you entered yourself. You do not have access to information entered by other doctors on the ZnanyLekarz website</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className=''>

          <section className='lg:w-[70%] m-auto pl-4 py-14 pr-14'>
            <h2 className='text-2xl mb-3'>Your data is safe with Amazon Web Service</h2>
            <p className='mb-3'><span className='font-medium'>Medi-Pulse is hosted on Amazon Web Services (AWS) servers.</span> AWS is the world's largest cloud computing platform, used by millions of companies around the world. AWS servers are located in data centers that meet the highest security standards.</p>
            <p>Storing data in the cloud gives you unlimited access from anywhere in the world and from all devices. At the same time, it protects against data loss and theft and does not allow unauthorized access. With Amazon Web Service, 
              <span className='font-medium'>your data is protected, among others, by continuous backup and a professional firewall.</span>
            </p>
          </section>
        </div>

        <div className='bg-[#f7f9fa]'>
          <section className='lg:w-[70%] m-auto px-4 pt-14 pb-8 '>
            <div className='lg:w-[70%] m-auto'>
              <h2 className=' text-2xl mb-3'>Ensure GDPR compliance</h2>
              <p>The Premium profile gives you access to the ZnanyLekarz online calendar. As a result, 
                <span className='font-medium'>you gain access to a tool that will allow you to meet the security conditions: storing, deleting and creating backup copies of data, which are required by GDPR</span>
              </p>
            </div>
            <h3 className='text-xl mt-8'>How does the Medi-Pulse Premium service meet GDPR requirements?</h3>
          </section>
        </div>

        <div className=''>

          <section className='lg:w-[70%] m-auto pl-4 py-14 pr-8'>
            <h2 className='text-2xl mb-3'>Medi-Pulse takes your privacy very seriously</h2>
            <p className='mb-3'>ZnanyLekarz services, such as the electronic calendar, have been designed to ensure ease of use and maximum security of your data. Here's how we make your work easier and ensure data security.</p>
          </section>
        </div>

        <div className='bg-[#f7f9fa]'>
          <section className='lg:w-[70%] m-auto px-4 pt-14 pb-8 '>
              
            <div className='flex flex-col lg:flex-row gap-3 mt-10 mb-4'>
              <div className=' rounded pb-12'>
                <div className='px-6 pt-6'>
                  <CgNotes className='text-5xl text-[#00b39be6] bg-[#00b39b2f] p-3 rounded mb-3'/>
                  <h2 className=' font-medium py-4'>Safe but comfortable</h2>
                  
                  <p>Your data is yours alone. Neither we nor anyone else has access to it. If you want, you can share your calendar with others.</p>
                </div>
              </div>

              <div className=' rounded'>
              <div className='px-6 pt-6'>
              <BsFileEarmarkPost className='text-5xl text-[#00b39be6] bg-[#00b39b2f] p-3 rounded mb-3'/>
                  <h2 className=' font-medium py-4'>Well secured but accessible</h2>
                  
                  <p>Your data is protected by a 256-bit script, which protects it from unauthorized access. At the same time, thanks to the Amazon Web Service cloud storage service, you have access to your data from anywhere in the world and from all devices.</p>
                </div>
                </div>

              <div className='w  rounded'>
              <div className='px-6 pt-6'>
              
              <HiCheckBadge className='text-5xl text-[#00b39be6] bg-[#00b39b2f] p-3 rounded mb-3'/>
                  <h2 className=' font-medium py-4'>Providing close contact, but without being intrusive</h2>
                  
                  <p>We take pride in the way we build relationships with patients – we stay in touch, but we don’t impose ourselves. We only send promotional offers to those who have expressed such a desire.</p>
                </div>
                </div>
              </div>
          </section>
        </div>
        
        <DataPrivacyFooter />
    </div>
  )
}