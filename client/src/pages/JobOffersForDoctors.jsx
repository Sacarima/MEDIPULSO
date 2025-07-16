import { useState, useEffect, useRef} from 'react'
import DoctorProfileHeader from '../components/DoctorProfileHeader'
import CircularProgressbar from '../components/CircularProgressbar'
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react'
import ModalForDiseases from '../components/ModalForDiseases'
import PhotoUploadModal from '../components/PhotoUploadModal'
import { GoPlus } from 'react-icons/go'


export default function JobOffersForDoctors() {
  const [progress, setProgress] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [ temporaryPhotos, setTemporaryPhotos] = useState([])
  const photoRef = useRef(null)

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleAddPhotos = (photos) => {
    setTemporaryPhotos((prevPhotos) => [...prevPhotos, ...photos])
    setOpenModal(false)
  }

  const handleSaveForm = () => {

    //logic form saving here
    console.log('Form saved', temporaryPhotos)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevState) => (prevState >= 100 ? 0 : prevState + 10))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <DoctorProfileHeader />
      <div className='bg-gray-200 h-screen'>
        <div className='w-[70%] m-auto text-center text-black p-6          '>
          <h2 className='text-2xl mb-6'>
            We will be happy to clarify all issues.
          </h2>
          <p className=''>
            If you have any questions or concerns regarding the methods of securing or processing data on our website,
            <br /> please contact us by e-mail at
            <a href='mailto:' className='text-blue-500'>
            <button className='mt-6 bg-blue-500 px-4 py-3'> here </button>
            </a>
          </p>

          <div>
            {/* PHOTO UPLOAD */}
      <div ref={photoRef} className="w-[70%] m-auto rounded-md bg-white p-4 mt-4">
        <div>
          <span className="p-2 font-bold text-xl my-4">Photo</span>
          <p className="pl-2">
            A photo is worth a thousand words. Include more photos to present yourself professionally to patients.
          </p>
          <div
            className="w-[5rem] h-[5rem] flex mt-5 flex-col items-center justify-center bg-blue-100 text-blue-700 cursor-pointer rounded-md"
            onClick={handleOpenModal}
          >
            <GoPlus className="text-3xl" />
            <span>Add</span>
          </div>

          {/* Display temporarily added photos */}
          <div className="flex gap-4 mt-5">
            {temporaryPhotos.length > 0 ? (
              temporaryPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(photo)}
                  alt={`Preview ${index}`}
                  className="w-32 h-32 object-cover"
                />
              ))
            ) : (
              <p>No photos added yet.</p>
            )}
          </div>

          <div className="my-5 bg-gray-100 p-2 py-4 rounded-md">
            <span className="font-medium">
              Want to show your patients the "Photo" section?
            </span>
            <p className="mb-5">
              Get to know yourself better! Add photos of your office or show the result of your work.
            </p>
            <span className="text-[#00b39be6] cursor-pointer">See more &#8658;</span>
          </div>
        </div>
      </div>

      {/* Save button to save the form */}
      <div className="text-center mt-4">
        <button
          className="bg-green-500 text-white rounded-md px-4 py-2"
          onClick={handleSaveForm}
        >
          Save Information
        </button>
      </div>

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        openModal={openModal}
        onCloseModal={handleCloseModal}
        onAddPhotos={handleAddPhotos} // Pass photos from modal
      />
          </div>
          
          {/* <div>
            <Button onClick={() => setShowModal(true)}>Toggle modal</Button>
            <Modal show={showModal} size='md' onClose={() => setShowModal(false)} popup>
              <ModalBody>
                <ModalForDiseases />
              </ModalBody>
            </Modal>
          </div>
          <div className='w-[70%] m-auto'>
              <h1>Circular progressbR</h1>
              <CircularProgressbar progress={progress} />
          </div> */}
          </div>
        
      </div>

      
        
       </div>
  )
}
