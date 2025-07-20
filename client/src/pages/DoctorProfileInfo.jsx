
import { useState, useEffect, useMemo, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CircularProgressbar from '../components/CircularProgressbar'
import { Alert } from 'flowbite-react'
import MedicalCategoryDropdown from '../components/MedicalCategoryDropdown'
import PhotoUploadModal from '../components/PhotoUploadModal'
import ModalForDiseases from '../components/ModalForDiseases'
import DoctorProfileHeader from '../components/DoctorProfileHeader'
import ProfileInfoNavigation from '../components/ProfileInfoNavigation'
import { updateDoctorStart, updateDoctorSuccess,updateDoctorFailure } from '../redux/doctor/doctorSlice'
import useMediaQuery from '../hooks/useMediaQuery'
import { degrees } from '../data/degrees'
import {diseases } from '../data/diseases'
import { medicalCategories } from '../data/medicalCategories'
import { doctorSpecializations } from '../data/doctorSpecializations'
import { medicalSpecialtiesForAdvice } from '../data/medicalSpecialtiesForAdvice'
import { genders } from '../data/genders'
import { medicalSpecialtyCategory } from '../data/medicalSpecialtyCategory'
import { initializedDoctorFormData } from '../data/initializedDoctorFormData'
import { getStorage, getDownloadURL, ref, uploadBytesResumable, listAll } from 'firebase/storage'
import { app } from '/firebase'
import useAutoDismissError from '../hooks/useAutoDismissError'
import ImageModal from '../components/ImageModal'
import doctorFormDataRequireFields from '../data/doctorFormDataRequireFields'
import { RiImageAddFill } from "react-icons/ri"
import { BsExclamationCircleFill } from "react-icons/bs"
import { LiaTimesSolid } from "react-icons/lia"
import { LuSlidersHorizontal } from "react-icons/lu"
import { GoPlus } from "react-icons/go"
import { FaPen } from "react-icons/fa6"



const  DoctorProfileInfo = ()=> {
 const [formData, setFormData] = useState({})
 const [openModal, setOpenModal] = useState(false)
 const [progress, setProgress] = useState(0)
 const [showMoreAndLess, setShowMoreAndLess] = useState(false)
 const [openContainers, setOpenContainers] = useState({})
 const { currentDoctor, error } = useSelector(state => state.doctor)
 const [doctorInfo, setDoctorInfo] = useState({ diseases: [] })
 const [openPhotoModal, setOpenPhotoModal] = useState(false)
 const [temporaryPhotos, setTemporaryPhotos] = useState([])
 const [updateDoctorError, setUpdateDoctorError] = useAutoDismissError(4000)
 const [updateSuccessDoctor, setUpdateSuccessDoctor] = useState(null)
 const isAboveSmallScreens = useMediaQuery('(min-width: 768px)')
 const [imageFile, setImageFile] = useState(null)
 const [imageFileUrl, setImageFileUrl] = useState(null)
 const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null)
 const [imageFileUploadError, showImageFileUploadError] = useAutoDismissError(4000)
 const [firebasePhotoURLs, setFirebasePhotoURLs] = useState([])
 const [isUploading, setIsUploading] = useState(false)
 const [isPreviewImageModalOpen, setIsPreviewImageModalOpen] = useState(false)
 const [previewImageModal, setPreviewImageModal] = useState(null)

 const [languagesText, setLanguagesText] = useState(
  Array.isArray(formData.languages) ? formData.languages.join(", ") : ""
)





  // Reference for containers
  const licenseRef = useRef(null)
  const photoRef = useRef(null)
  const videoRef = useRef(null)
  const certificateRef = useRef(null)
  const aboutMeRef = useRef(null)
  const socialMediaRef = useRef(null)
  const genderRef = useRef(null)
  const diseasesRef = useRef(null)
  const addPublicationRef = useRef(null)
  const professionalExperienceRef = useRef(null)
  const awardsRef = useRef(null)


  const dispatch = useDispatch()
  const profilePictureSectionRef = useRef(null)

 
 // Use useMemo to optimize performance when rending dropdown options
 const memoizedDegrees = useMemo(() => degrees, [])
 const memoizedMedicalCategories = useMemo(() => medicalCategories, [])
 const memoizedDiseases = useMemo(() => diseases, [])
 const memoizedGenders = useMemo(() => genders, [])
 const memoizedDoctorSpecializations = useMemo(() => doctorSpecializations, [])
 const memoizedMedicalSpecialtiesForAdvice = useMemo(() => medicalSpecialtiesForAdvice, [])
 const memoizedMedicalSpecialtyCategory = useMemo(() => medicalSpecialtyCategory, [])

  // funciton to scroll to a specific container
  const scrollToContainer = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // function to toggle show more and show less to display to which container to scroll to 
  const toggleExpand = () => {
    setShowMoreAndLess(prevState => !prevState)
  }

  useEffect(() => {
    if (currentDoctor) {
      const initializedData = initializedDoctorFormData(currentDoctor)
      setFormData(initializedData)
      
      setDoctorInfo(currentDoctor)
    }
  }, [currentDoctor])

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      const filledFieldsCount = doctorFormDataRequireFields.filter((field) => formData[field]?.toString().trim() !== '').length

      const completionPercentage = doctorFormDataRequireFields.length > 0 ? Math.round((filledFieldsCount / doctorFormDataRequireFields.length) * 100) : 0
      setProgress(completionPercentage)
    }
  }, [formData])



    const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData((prevFormData) => {
        if (name === "languages") {
          const languagesArray = value
            .split(",")
            .map((lang) => lang.trim())
            .filter((lang) => lang !== "");

          return {
            ...prevFormData,
            [name]: languagesArray,
          };
        }

        return {
          ...prevFormData,
          [name]: value,
        };
      });
    };



  

  //function to handle the selection of medical specialty
  const handleDegreeSelect = (selectedDegree) => {
    setFormData({
      ...formData,
      degree: selectedDegree
    })
  }

  // Handle medical category select
  const handleMedicalCategorySelect = (selectedCategory) => {
    setFormData((prev) => ({ ...prev, medicalCategory: selectedCategory }));
  };

  // Handle doctor specialization select
  const handleDoctorSpecializationSelect = (selectedSpecialization) => {
    setFormData((prev) => ({ ...prev, doctorSpecialization: selectedSpecialization }));
  }

  // handle gender category select
  const handleGenderSelect = (selectedGender) => {
    setFormData((prev) => ({...prev, gender: selectedGender}))

  }

  // Handle medical specialty category select
  const handleMedicalSpecialtyCategorySelect = (selectedSpecialtyCategory) => {
    setFormData((prev) => ({ ...prev, medicalSpecialtyCategory: selectedSpecialtyCategory }));
  }

  // Handle medical specialty for advice select
  const handleMedicalSpecialtyForAdviceSelect = (selectedSpecialtyForAdvice) => {
    setFormData({
      ...formData,
      medicalSpecialtyForAdvice: selectedSpecialtyForAdvice
    })
  }

   // function to handle open containers
   const handleOpenContainer= (containerId) => {
    setOpenContainers((prevState) => ({
      ...prevState,
      [containerId]: !prevState[containerId]
    }))
  
  }

  // function to handle close containers
  const handleCloseContainer = (containerId) => {
    setOpenContainers((prevState) => ({
      ...prevState,
      [containerId]: false
    }))
  }

  //function to handle the change in the checkbox for diseases
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    })
  }

  const handleModalClose = () => {
    setOpenModal(false)
  }

  const handleModalOpen = () => {
    setOpenModal(true)
  }

  const handleOpenPhotoModal = () => {
    setOpenPhotoModal(true)
    
  }

  const handlePreviewImageModalOpen = (imageUrl) => {
    setPreviewImageModal(imageUrl)
    setIsPreviewImageModalOpen(true)
  }

  const handlePreviewImageModalClose = () => {
    setPreviewImageModal(null)
    setIsPreviewImageModalOpen(false)
  }


  // function to handle the change in the i photo upload
  const handleImageChange = (event) => {
    const file = event.target.files[0]

        if( file) {
        setImageFile(file)
        setImageFileUrl(URL.createObjectURL(file))
      }  
    }

  useEffect(() => {
    if (imageFile && !isUploading) {
        setIsUploading(true) // sets flag to prevent multiple uploads
        uploadProfileImage()
    }
    }, [imageFile])

    const uploadProfileImage = async () => {
        const storage = getStorage(app)
        const fileName = `${currentDoctor._id}/profilePicture/${imageFile.name}`
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageFileUploadingProgress(progress.toFixed(0))
            },
            (error) => {
                showImageFileUploadError('Image could not be uploaded (File size too large) File size should not exceed 2MB')
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL)
                    setFormData((prev) => ({ ...prev, profilePicture: downloadURL }))
                })
            }
        )
    }


  const handleClosePhotoModal = () => {
    setOpenPhotoModal(false)
  }

  const handleAddPhotos = async (photos) => {
    setTemporaryPhotos((prevPhotos) => [...prevPhotos, ...photos])

    // loop through each phoot and uppload to friebase
    const newPhotoURLs = []
    for (const photo of photos) {
      try {
        const photoURL = await uploadPhotosToFirebase(photo)
        newPhotoURLs.push(photoURL)
      } catch (error) {
        console.log('Error uploading photo:', error)
      }
    }


   if (newPhotoURLs.length > 0) {
    setFormData((prev) => ({
        ...prev,
        photo: newPhotoURLs[newPhotoURLs.length - 1], 
    }));
}

    // close the modal after adding the photos
    setOpenModal(false)
  }

  const handleUploadPhotosToFirebase = async () => {
    await Promise.all(temporaryPhotos.map(photo => handleUploadPhotosToFirebase(photo)))
    setTemporaryPhotos([])
  }

  const uploadPhotosToFirebase = async (photo) => {
    const storage = getStorage(app);
    const fileName = `${currentDoctor._id}/photos/${photo.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, photo);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.log('Error uploading photo:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSaveDiseases = (selectedDiseases) => {
    // Update formData and doctorInfo with selected diseases
    setFormData((prev) => ({ ...prev, diseases: selectedDiseases }))
    setDoctorInfo((prev) => ({ ...prev, diseases: selectedDiseases }))
    setOpenModal(false)
  }


useEffect(() => {
  if (currentDoctor) {
    // Initialize form data using the currentDoctor data
    const initializedData = initializedDoctorFormData(currentDoctor);
    
    setFormData(initializedData);
    
    // Set doctorInfo directly from currentDoctor to maintain diseases and other doctor data
    setDoctorInfo(currentDoctor);
  }
}, [currentDoctor])
 
 useEffect(() => {
  const loadPhotosFromFirebase = async () => {
      const storage = getStorage(app)
      const photofolderRef = ref(storage, `${currentDoctor._id}/photos/`)
      
      try {
        const photosList = await listAll(photofolderRef)
        const urls = await Promise.all(photosList.items.map(async (photoRef) => await getDownloadURL(photoRef))
      )
        setFirebasePhotoURLs(urls)
      
      } catch (error) {
        console.error('Error loading photos from firebase:', error)
      }
    }
    loadPhotosFromFirebase()
  }, [currentDoctor._id])


  // update doctor profile information
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdateDoctorError(null)
    setUpdateSuccessDoctor(null)
    

          const updatedFormData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => {
                if (typeof value === 'string') {
                    return value.trim() !== "";
                } else if (Array.isArray(value)) {
                    return value.length > 0;
                } else if (typeof value === 'boolean') {
                    return true; // keep boolean values as they are significant
                } else {
                    return value !== undefined && value !== null; // handle other non-empty values
                }
            })
        )

        if (Object.keys(updatedFormData).length === 0) {
            setUpdateDoctorError('No changes were made');
            return;
        }

    try {
      dispatch(updateDoctorStart())
      const token = localStorage.getItem('access_token')


      const response = await fetch(`http://localhost:7500/api/doctor-form/update/${currentDoctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFormData),
        credentials: 'include', 
      })

       // upload new phtos in temporary photos to firebase
       const uploadedPhotosURLs = await Promise.all(temporaryPhotos.map(photo => uploadPhotosToFirebase(photo)))

       // combine existing firebase photos with newly added photos
       const updatedPhotos = [...firebasePhotoURLs, ...uploadedPhotosURLs]


      const data = await response.json()
   
      setFormData((prevData) => ({ 
        ...prevData, 
        photo: updatedPhotos.length > 0 ? updatedPhotos[updatedPhotos.length - 1] : prevData.photo }))

      if (!response.ok) {
        dispatch(updateDoctorFailure(data.message))
        setUpdateDoctorError(data.message)
      }else {
        dispatch(updateDoctorSuccess(data))
        setUpdateSuccessDoctor('Your profile information updated successfully')
        setTemporaryPhotos([])
      }
    } catch (error) {
      dispatch(updateDoctorFailure(error.message))
      setUpdateDoctorError(error.message)
    }  
  }

  return (
    <div className='sm:flex flex-row min-h-screen'>
        <DoctorProfileHeader />
        {isAboveSmallScreens && 
            <ProfileInfoNavigation />
        }
        <div className={`bg-[#8080802e] flex-1  p-2`}>
          <div className=''>
              <form className='p-2' onSubmit={handleSubmit}>
              <div className='sm:w-[70%] m-auto flex rounded-md bg-white p-4'>
                <div>
                    <CircularProgressbar progress={progress} />
                    {error && <p>{error}</p>}
                </div>
                <div className='flex flex-col justify-between pl-4'>
                    <h2 className='text-xl'>Complete your profile to attrack more patients</h2>
                    <div>
                      <p
                         className='text-blue-500 cursor-pointer'
                          onClick={() => scrollToContainer(diseasesRef)}
                      >
                        +
                        <span>Add Diseases (+17%)</span>
                      </p>
                      <p
                        className='text-blue-500 cursor-pointer'
                        onClick={() => scrollToContainer(aboutMeRef)}
                      >
                          +
                          <span>Add About me (+10%)</span>
                      </p>
              
                      {showMoreAndLess && (
                        <>
                          <p
                            className='text-blue-500 cursor-pointer'
                            onClick={() => scrollToContainer(socialMediaRef)}
                          >
                            +
                            <span>
                                Add Social media (+5%)
                            </span>
                          </p>
                          <p
                            className='text-blue-500 cursor-pointer'
                            onClick={() => scrollToContainer(certificateRef)}
                          >
                              +
                              <span>
                                Add Certificates (+3%)
                              </span>
                          </p>
                          <p
                            className='text-blue-500 cursor-pointer'
                            onClick={() => scrollToContainer(photoRef)}
                          >
                            +
                            <span>
                              Add Photos (+2%)
                              </span>
                          </p>
                          <p
                            className='text-blue-500 cursor-pointer'
                            onClick={() => scrollToContainer(videoRef)}
                          >
                              +
                              <span>
                                Add Videos (+1%)
                              </span>
                          </p>
                          <p
                            className='text-blue-500 cursor-pointer'
                            onClick={() => scrollToContainer(licenseRef)}
                          >
                            +
                            <span>
                              Add License number (+1%)
                            </span>
                          </p>
                          <p
                            className='text-blue-500 cursor-pointer'
                            onClick={() => scrollToContainer(professionalExperienceRef)}
                          >
                              +
                              <span>
                                Add Professional Experience (+1%)
                              </span>
                          </p>
                          <p
                            className='text-blue-500 cursor-pointer'
                            onClick={() => scrollToContainer(addPublicationRef)}
                          >
                            +
                            <span>
                              Add Publication (+1%)
                            </span>
                          </p>
              
                      </>
                      )}
                    </div>
                    <span
                      className='text-black font-medium cursor-pointer hover:underline'
                      onClick={toggleExpand}
                    >
                      {showMoreAndLess ? 'less' : 'more'}
              </span>
                </div>
              </div>
              {/* Profile completion */}
              <div className='sm:w-[70%] m-auto flex rounded-md bg-white p-4 mt-4'>
                <div className='w-full'>
                  <div className=''>
                    <div className='flex items-center gap-4' >
                        {imageFileUrl || currentDoctor.profilePicture ? (
                            <div className='flex-col' onClick={() => profilePictureSectionRef.current.click()} >
                                <img 
                                    src={imageFileUrl || currentDoctor.profilePicture}
                                    alt="doctor profile photo"
                                    className='w-[6.3rem] h-[7rem] object-cover rounded-md'
                                />
                                <span className=' text-green-500 cursor-pointer' >change photo</span>
                            </div>
                        ) : (

                      <div className='border-[1px] border-gray-300 bg-gray-50 rounded-md cursor-pointer' onClick={() => profilePictureSectionRef.current.click()}>
                        <RiImageAddFill className='text-[6.5rem] text-[#00b39b56]'/>
                        <div className='flex items-center justify-center bg-gray-500 text-white gap-2 px-2 '>
                        <FaPen />
                          <span >Add</span>
                        </div>
                      </div>
                    )}
                      {/* Hidden file input for selecting an image */}
                      <input 
                            type="file" 
                            accept='image/*'
                            onChange={handleImageChange}
                            ref={profilePictureSectionRef}
                            hidden
                        />
                      <h2 className='text-xl'>{currentDoctor.firstName}  <span className='font-bold'>{currentDoctor.lastName}</span></h2>
                    </div>
                    {imageFileUploadError && (
                            <Alert color='failure'>
                            {imageFileUploadError}
                        </Alert>
                        )}
                    <div className='my-5 bg-gray-100 p-2 py-4 rounded-md'>
                      <span className='font-medium'>Want to show your patients the "Cover Photo" section?</span>
                      <p className='mb-5'>A background photo makes your profile more personalized. Upgrade to a higher paln so patients can see your background photo.</p>
                      <span className='text-[#00b39be6] cursor-pointer'>See more &#8658;</span>
                    </div>
                    <span className=' font-bold text-xl my-4'>Your data</span>

                    {/* Doctors personal info */}
                        <div>
                          <div  className='flex flex-col lg:flex-row justify-between items-stretch gap-4 mt-3'>
                            <div className='flex-1'>
                              <label htmlFor="degree" className='font-bold'>Degree</label>
                              <MedicalCategoryDropdown
                                options={memoizedDegrees}
                                selected={formData.degree}
                                defaultValue={currentDoctor.degree}
                                onSelect={handleDegreeSelect}
                                value={formData.degree}
                                id='degree'
                                name='degree'
                                onChange={handleChange}
              
                              />
                            </div>
                            <div className='flex-1 '>
                              <label htmlFor='firstName' className='font-bold'>Name*</label>
                              <input
                                type='text'
                                id='firstName'
                                name='firstName'
                                defaultValue={currentDoctor.firstName}
                               // value={formData.firstName ||''}
                                onChange={handleChange}
                                className='w-full border-[1px] border-gray-300 p-2 h-[3.4rem]'
                              />
                            </div>
                            <div className='flex-1'>
                              <label htmlFor='lastName' className='font-bold'>Last Name*</label>
                              <input
                                type='text'
                                id='lastName'
                                name='lastName'
                                defaultValue={currentDoctor.lastName}
                                //value={formData.lastName || ''}
                                onChange={handleChange}
                                className='w-full border-[1px] border-gray-300  p-2 h-[3.4rem]'
                              />
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center text-gray-500 gap-2 mt-3'>
                            <BsExclamationCircleFill className='text-[.5rem]'/>
                            <span className='text-[.6rem]'>Your name and surname change must be approved by the moderator.</span>
                        </div>
                        <div className='mt-4'>
                          <span className='font-bold'>Medical Categories*</span>
                          <div className='flex flex-col lg:flex-row justify-between gap-4 mt-2'>
                            <div className='grow'>
                              <MedicalCategoryDropdown
                                className=""
                                options={memoizedMedicalCategories}
                                selected={formData.medicalCategory}
                                defaultValue={currentDoctor.medicalCategory}
                                onSelect={handleMedicalCategorySelect}
                                id='medicalCategory'
                                name='medicalCategory'
                                onChange={handleChange}
                              />
                            </div>
                            <div className='grow'>
                              <MedicalCategoryDropdown
                                className=""
                                options={memoizedDoctorSpecializations}
                                selected={formData.doctorSpecialization}
                                defaultValue={currentDoctor.doctorSpecialization}
                                onSelect={handleDoctorSpecializationSelect}
                                id='doctorSpecialization'
                                name='doctorSpecialization'
                                onChange={handleChange}
              
                              />
                            </div>
                            <div className='grow'>
                              <MedicalCategoryDropdown
                                className=""
                                options={memoizedMedicalSpecialtyCategory}
                                selected={formData.medicalSpecialtyCategory}
                                defaultValue={currentDoctor.medicalSpecialtyCategory}
                                onSelect={handleMedicalSpecialtyCategorySelect}
                                id='medicalSpecialtyCategory'
                                name='medicalSpecialtyCategory'
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className='flex items-center gap-3 my-3'>
              
                            <div>
                              <input
                                type='checkbox'
                                id='underSpecialization'
                                name='underSpecialization'
                                defaultValue={currentDoctor.underSpecialization}
                                className=' border-[1px] border-gray-300 p-2 rounded-md cursor-pointer'
                                checked={formData.underSpecialization}
                                onChange={handleCheckboxChange}
                              />
                              <label htmlFor='underSpecialization'> under specialization*</label>
                            </div>
                            <div>
                              <input
                                type='checkbox'
                                id='onlineConsultation'
                                name='onlineConsultation'
                                defaultValue={currentDoctor.onlineConsultation}
                                className=' border-[1px] border-gray-300 p-2 rounded-md cursor-pointer'
                                checked={formData.onlineConsultation}
                                onChange={handleCheckboxChange}
                              />
                              <label htmlFor='onlineConsultation'> online consultation*</label>
                              </div>
                              <div>
                                <input
                                  type='checkbox'
                                  id='acceptChildren'
                                  name='acceptChildren'
                                  defaultValue={currentDoctor.acceptChildren}
                                  className=' border-[1px] border-gray-300 p-2 rounded-md cursor-pointer'
                                  checked={formData.acceptChildren}
                                  onChange={handleCheckboxChange}
                                />
                                <label htmlFor='acceptChildren'> accept children*</label>
                                </div>
                          </div>

                          <div className='flex items-center text-gray-500 gap-2'>
                            <BsExclamationCircleFill className='p text-[.5rem]'/>
                            <span className='text-[.6rem]'>You can choose up to 3 categories</span>
                        </div>
              
                        </div>
                  </div>
                </div>
              </div>

              {/* GENDER  */}
              <div ref={genderRef} className='sm:w-[70%] m-auto  rounded-md bg-white p-4 mt-4'>
                <div className='sm:w-[20%] py-4'>
                  <span className='p-2 font-bold text-xl my-4' htmlFor='gender'>Gender</span>
                  <MedicalCategoryDropdown
                    className=""
                    options={memoizedGenders}
                    defaultValue={currentDoctor.gender}
                    selected={formData.gender}
                    onSelect={handleGenderSelect}
                    id='gender'
                    name='gender'
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* LINCENSE NUMBER PWZ NO. */}
              <div ref={licenseRef} className='lg:w-[70%] w-full m-auto  rounded-md bg-white p-4 mt-4'>
                <div className='w- py-4'>
                  <span className='p font-bold text-xl my-4' >PWZ NO.</span>
                  <div className='flex items-center text-gray-500 gap-2 mb-4'>
                    <BsExclamationCircleFill className='text-[.5rem]'/>
                    <span className='text-[.6rem]'>The change of lisence number will be visible after approval by moderator</span>
                  </div>
                  {openContainers["license"] && (<div className='flex items-center gap-2'>
                    <input
                      type="text"
                      className='border-[1px] border-gray-300 p-2 lg:w-[20%] w-full'
                      id='license'
                      name='license'
                      defaultValue={currentDoctor.license}
                      //value={formData?.license?.value || ''} 
                      onChange={handleChange}
                    />
                    <LiaTimesSolid
                      className='cursor-pointer text-red-400 '
                      onClick={() => handleCloseContainer("license")}
                    />
                  </div>)}
                  <button
                    type='button'
                    className='border-[1px] p-2 rounded-md mt-4'
                    onClick={() => handleOpenContainer("license")}
                  >
                    + Add
                </button>
                </div>
              </div>
              
            {/*  PHOTO UPLOAD */}
            <div ref={photoRef} className="sm:w-[70%] m-auto rounded-md bg-white p-4 mt-4">
              <div>
                <span className="p-2 font-bold text-xl my-4">Photo</span>
                <p className="pl-2">
                  A photo is worth a thousand words. Include more photos to present yourself professionally to patients.
                </p>
                <div
                  className="w-[5rem] h-[5rem] flex mt-5 flex-col items-center justify-center bg-blue-100 text-blue-700 cursor-pointer rounded-md"
                  onClick={handleOpenPhotoModal}
                >
                  <GoPlus className="text-3xl" />
                  <span>Add</span>
                </div>

                {/* Display doctors photos from the database and temporary photo storage */}
                <div className="flex flex-wrap justify-between gap-4 mt-5 cursor-pointer">
                      {firebasePhotoURLs.map((url, index) => (
                        <img 
                          key={`saved-${index}`} 
                          src={url} 
                          alt={`Photo ${index}`} 
                          className="w-36 h-36 object-cover cursor-pointer" 
                          onClick={() => handlePreviewImageModalOpen(url)}
                        />
                      ))}
                      {temporaryPhotos.map((photo, index) => (
                        <img 
                          key={`temp-${index}`} 
                          src={URL.createObjectURL(photo)} 
                          alt={`Preview ${index}`} 
                          className="w-32 h-32 object-cover cursor-pointer " 
                          onClick={() => handlePreviewImageModalOpen(URL.createObjectURL(photo))}
                        />
                      ))}

                      {/* Image preview modal */}
                      <ImageModal 
                        isOpen={isPreviewImageModalOpen} 
                        onClose={handlePreviewImageModalClose} 
                        imageUrl={previewImageModal} 
                      />
                  
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
              
              {/* Photo Upload Modal */}
              <PhotoUploadModal
                openModal={openPhotoModal}
                onCloseModal={handleClosePhotoModal}
                defaultValue={currentDoctor.photo}
                onAddPhotos={handleAddPhotos}
                id='photo'
                name='photo'
                onChange={handleImageChange}
              />

              
              {/*  VIDEO UPLOAD */}
              <div ref={videoRef} className='sm:w-[70%] m-auto  rounded-md bg-white p-4 mt-4'>
                <div>
                  <span className='p-2 font-bold text-xl my-4'>Videos</span>
                  <p className='pl-2'>With videos you can highlight your professionalism even better</p>
                  <div className='w-[13rem] h-[9rem] flex mt-5 flex-col items-center justify-center bg-blue-100 text-blue-700 cursor-pointer rounded-md'>
                    <GoPlus className='text-3xl'/>
                    <span>Add</span>
                  </div>
                  <div className='my-5 bg-gray-100 p-2 py-4 rounded-md'>
                      <span className='font-medium'>Want to show your patients the "Video" section?</span>
                      <p className='mb-5 '>A photo says more than words! Post videos on your profile to better showcase your practice</p>
                      <span className='text-[#00b39be6] cursor-pointer'>See more &#8658;</span>
                    </div>
                </div>
              </div>
              {/*  CERTIFICATE UPLOADS */}
              <div ref={certificateRef} className='sm:w-[70%] m-auto  rounded-md bg-white p-4 mt-4'>
                <div>
                  <span className='p-2 font-bold text-xl my-4'>Certificate</span>
                  <p className='pl-2'>For 71% of patients, the experience of the doctor is important. Certificates confirm your knowledge and skills. Showthem off</p>
                  <div className='w-[5rem] h-[5rem] flex mt-5 flex-col items-center justify-center bg-blue-100 text-blue-700 cursor-pointer rounded-md'>
                    <GoPlus className='text-3xl'/>
                    <span>Add</span>
                  </div>
                  <div className='my-5 bg-gray-100 p-2 py-4 rounded-md'>
                      <span className='font-medium'>Would you like to show your patients the "Certificate" section?</span>
                      <p className='mb-5 '>They often look for additional information about the skill and experience of the doctors. They want to be sure that they are booking an appointment with a specialist in theur field. Show them this by adding your certificates to your profile</p>
                      <span className='text-[#00b39be6] cursor-pointer'>See more &#8658;</span>
                    </div>
                </div>
              </div>
              {/*  ABOUT ME */}
              <div ref={aboutMeRef} className='sm:w-[70%] m-auto  rounded-md bg-white p-4 mt-4'>
                <div>
                  <span className='p-2 font-bold text-xl my-4 pb-'>About me</span>
                  <p className='mb-5 pl-2'>What diseases or procedures are you an expert in ? How much experience do you have in a given specialization ? What are your achievements ? This information is very important to patients looking for the best doctor for them. According to our regulations, the "About Me" section shot not contain information (phone number, email address, or other contact me details)</p>
                  <textarea
                     className='w-full border-[1px] border-gray-300 p-2 h-[10rem] rounded-md'
                     type="text"
                      id="aboutMe"
                      name="aboutMe"
                      defaultValue={currentDoctor.aboutMe}
                      onChange={handleChange}
                  />
                </div>
              </div>
              {/*  SOCIAL MEDIA */}
              <div ref={socialMediaRef} className='sm:w-[70%] m-auto  rounded-md bg-white p-4 mt-4'>
                <div>
                  <span className='p-2 font-bold text-xl my-4'>Social media profiles</span>
                  <p className='pl-2'>Provide links to your socialmedia profiles so patients can get to know you better.</p>
              
                  <div>
                  <div className='flex p-2 justify-between gap-3 mt-6'>
                    <div className='grow'>
                      <label htmlFor='name' className='font-bold'>Facebook</label>
                      <input
                        type='text'
                        id='facebook'
                        name='facebook'
                        defaultValue={currentDoctor.facebook}
                        className='w-full border-[1px] border-gray-200 p-2 h-[3.4rem]'
                        //value={formData?.facebook || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='grow'>
                      <label htmlFor='name' className='font-bold'>Instagram</label>
                      <input
                        type='text'
                        id='instagram'
                        name='instagram'
                        defaultValue={currentDoctor.instagram}
                        className='w-full border-[1px] border-gray-200 p-2 h-[3.4rem]'
                        //value={formData.instagram || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  </div>
                  <div>
                  <div className='flex p-2 justify-between gap-3'>
                    <div className='grow'>
                      <label htmlFor='name' className='font-bold'>LinkedIn</label>
                      <input
                        type='text'
                        id='linkedin'
                        name='linkedin'
                        defaultValue={currentDoctor.linkedin}
                        className='w-full border-[1px] border-gray-200 p-2 h-[3.4rem]'
                        //value={formData.linkedin}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='grow'>
                      <label htmlFor='name' className='font-bold'>YouTube</label>
                      <input
                        type='text'
                        id='youtube'
                        name='youtube'
                        defaultValue={currentDoctor.youtube}
                        className='w-full border-[1px] border-gray-200 p-2 h-[3.4rem]'
                        //value={formData.youtube}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
              
                  </div>
              
                  <div className='p-2 w-[50%]'>
                      <label htmlFor='name' className='font-bold'>Twitter</label>
                      <input
                        type='text'
                        id='twitter'
                        name='twitter'
                        defaultValue={currentDoctor.twitter}
                        className='w-full border-[1px] border-gray-200 p-2 h-[3.4rem]'
                        //value={formData.twitter}
                        onChange={handleChange}
                      />
                    </div>
                  <div className='my-5 bg-gray-100 p-2 py-4 rounded-md'>
                      <span className='font-medium'>Would you like to show your patients the "Social Media" section?</span>
                      <p className='mb-5 '>Go modern! Add links to your social media on your profile to make you easier to find.</p>
                      <span className='text-[#00b39be6] cursor-pointer'>See more &#8658;</span>
                    </div>
                </div>
              </div>
              
              {/* DISEASES */}
              <div ref={diseasesRef} className="sm:w-[70%] m-auto rounded-md bg-white p-4 mt-4">
              <div>
                <span className="p-2 font-bold text-xl my-4 pb-">Diseases</span>
                <p className="mb-5 pl-2">
                  Patients often search for a doctor by typing the name of the diseases or
                  problem they are struggling with into a search engine. If you provide
                  this information, patients will find your profile easily.
                </p>
                <span className="font-bold p-2">Treated diseases</span>
                <div className="mt-1 ml-2">
                  {doctorInfo.diseases && doctorInfo.diseases.length > 0 ? (
                    <ul>
                      {doctorInfo.diseases.map((disease, index) => (
                        <li key={index}>{disease}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center mt-8">
                      <p>No diseases selected yet</p>
                      <p className="my-5">
                        Click and we will help you prepare a list of diseases you treat
                      </p>
                    </div>
                  )}
                </div>
                  <div className="text-center mt-8">
                    <button
                      className="bg-blue-500 text-white rounded-md px-3 py-2 font-medium hover:bg-blue-600"
                      type="button"
                      onClick={handleModalOpen}
                    >
                      Add treated diseases
                    </button>
                  </div>
                </div>
                <ModalForDiseases
                  openModal={openModal}
                  onCloseModal={handleModalClose}
                  defaultValue={currentDoctor.diseases}
                  onSaveDiseases={handleSaveDiseases}
                  options={memoizedDiseases}
                />
              </div>

              {/*  SCOPE OF ADVICE */}
              <div className='lg:w-[70%] m-auto  rounded-md bg-white p-4 mt-4'>
                <div className='w- py-4'>
                  <span className='p font-bold text-xl my-4' >Scope of advice</span>
                  <div className='flex items-center  gap-2 my-4'>
                      <span className=''>What do you do? Be found by patients who will seek help in a given field.</span>
                  </div>
                  {openContainers["scopeAdvice"] && (<div className='flex items-center gap-2'>
                    <div className='flex items-center bg-gray-100 w-full justify-between p-2 py-3 rounded-md'>
                      <div className='flex items-center gap-3 lg:w-[35%] w-full'>
                        <LuSlidersHorizontal className='text-2xl '/>
                        <div className='lg:flex-1'>
                          <MedicalCategoryDropdown
                            className="w-full lg:flex-1"
                            options={memoizedMedicalSpecialtiesForAdvice}
                            selected={formData.medicalSpecialtyForAdvice}
                            defaultValue={currentDoctor.medicalSpecialtyForAdvice}
                            onSelect={handleMedicalSpecialtyForAdviceSelect}
                            id='medicalSpecialtyForAdvice'
                            name='medicalSpecialtyForAdvice'
                            onChange={handleChange}
                          />
                        </div>
                      </div>
              
                      <LiaTimesSolid className='cursor-pointer text-red-400 mr-3' onClick={() => handleCloseContainer("scopeAdvice")}/>
                    </div>
                  </div>)}
                  <button type='button' className='border-[1px] p-2 rounded-md mt-4' onClick={() => handleOpenContainer("scopeAdvice")}>+ Add</button>
                </div>
              </div>
              
              {/* COMPLETE SCHOOLS */}
              <div className='lg:w-[70%] m-auto  rounded-md bg-white p-4 mt-4'>
                <div className='w- py-4'>
                  <span className='p font-bold text-xl my-4' >Completed schools</span>
                  <div className='flex items-center  gap-2 my-4'>
                      <span className=''>For many patients, a doctor's education is as important as their professional experience. Be sure to include information about the school they gradueted from.</span>
                  </div>
                  {openContainers["schoolsCompleted"] && (<div className='flex items-center gap-2'>
                    <div className='flex items-center bg-gray-100 w-full justify-between p-2 py-3 rounded-md'>
                      <div className='flex items-center  gap-3 w-[95%]'>
                        <LuSlidersHorizontal className='text-2xl '/>
                        <div className='flex-1 grow '>
                          <input
                            className='w-[100%] border-gray-200'
                            type="text"
                            placeholder='example, University of Warsaw (Warsaw 2001)'
                            id='schoolCompleted'
                            name='schoolCompleted'
                            defaultValue={currentDoctor.schoolCompleted}
                            //value={formData.schoolCompleted}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
              
                      <LiaTimesSolid className='cursor-pointer text-red-400 mr-3' onClick={() => handleCloseContainer("schoolsCompleted")}/>
                    </div>
              
                  </div>)}
              
                  <button type='button' className='border-[1px] p-2 rounded-md mt-4' onClick={() => handleOpenContainer("schoolsCompleted")}>+ Add</button>
                  <div className='my-5 bg-gray-100 p-2 py-4 rounded-md'>
                      <span className='font-medium'>Want to show your patients your "Graduated Schools" section</span>
                      <p className='mb-5 '>Often it is information a specialist's education that helps in making a decision about schedualing a visit. Be sure to it!</p>
                      <span className='text-[#00b39be6] cursor-pointer'>See more &#8658;</span>
                  </div>
                </div>
              </div>
              
              {/*  PUBLICATION */}
              <div ref={addPublicationRef} className='sm:w-[70%] m-auto  rounded-md bg-white p-4 mt-4'>
                <div className='w- py-4'>
                  <span className='p font-bold text-xl my-4' >Publications</span>
                  <div className='flex items-center  gap-2 my-4'>
                      <span className=''>By sharing your knowledge, you build an image of an expert in your field. Show youe publicarions!</span>
                  </div>
                  {openContainers["publications"] && (<div className='flex items-center gap-2'>
                    <div className='flex items-center bg-gray-100 w-full justify-between p-2 py-3 rounded-md'>
                      <div className='flex items-center  gap-3 w-[95%]'>
                        <LuSlidersHorizontal className='text-2xl '/>
                        <div className='flex-1 grow '>
                          <input
                            className='w-[100%] border-gray-200'
                            type="text"
                            placeholder='e.g Early diagnosis of breast cancer (Medical Journal 2019)'
                            id='publication'
                            name='publication'
                            defaultValue={currentDoctor.publication}
                            //value={formData.publication}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
              
                      <LiaTimesSolid className='cursor-pointer text-red-400 mr-3' onClick={() => handleCloseContainer("publications")}/>
                    </div>
              
                  </div>)}
              
                  <button type='button' className='border-[1px] p-2 rounded-md mt-4' onClick={() => handleOpenContainer("publications")}>+ Add</button>
                  <div className='my-5 bg-gray-100 p-2 py-4 rounded-md'>
                      <span className='font-medium'>Want to show your patients the "Publications section" section</span>
                      <p className='mb-5 '>Prove you are an expert! Showcase your scientific publications</p>
                      <span className='text-[#00b39be6] cursor-pointer'>See more &#8658;</span>
                  </div>
                </div>
              </div>
              
              {/*  AWARD AND DISTINCTIONS */}
              <div ref={awardsRef} className='sm:w-[70%] m-auto  rounded-md bg-white p-4 mt-4'>
                <div className='w- py-4'>
                  <span className='p font-bold text-xl my-4' >Awards and distinctions</span>
                  <div className='flex items-center  gap-2 my-4'>
                      <span className=''>Have you ever won an industry award or distinction? Show them off!</span>
                  </div>
                  {openContainers["award"] && (<div className='flex items-center gap-2' >
                    <div className='flex items-center bg-gray-100 w-full justify-between p-2 py-3 rounded-md'>
                      <div className='flex items-center  gap-3 w-[95%]'>
                        <LuSlidersHorizontal className='text-2xl '/>
                        <div className='flex-1 grow '>
                          <input
                            className='w-[100%] border-gray-200'
                            type="text"
                            placeholder='e.g. Award of the District Medical Chamber in Warsaw for the best doctor of the year 2019'
                            id='award'
                            name='award'
                            defaultValue={currentDoctor.award}
                            //value={formData?.award?.value || ''}
                            onChange={handleChange}
                            onClick={(e) => e.stopPropagation()}  // prevents closing when clicking inside input
                          />
                        </div>
                      </div>
              
                      <LiaTimesSolid className='cursor-pointer text-red-400 mr-3' onClick={() => handleCloseContainer("award")}/>
                    </div>
              
                  </div>)}
              
                  <button type='button' className='border-[1px] p-2 rounded-md mt-4' onClick={() => handleOpenContainer("award")}>+ Add</button>
                  <div className='my-5 bg-gray-100 p-2 py-4 rounded-md'>
                      <span className='font-medium'>Want to show your patients the "Award and Recognition" section</span>
                      <p className='mb-5 '>Show off your achievements! Awards will set you apart from other specialists.</p>
                      <span className='text-[#00b39be6] cursor-pointer'>See more &#8658;</span>
                  </div>
                </div>
              </div>
              {/*  PROFESSIONAL EXPERIENCE */}
              <div ref={professionalExperienceRef} className='sm:w-[70%] m-auto  rounded-md bg-white p-4 mt-4'>
                <div className='w- py-4'>
                  <span className='p font-bold text-xl my-4' >Professional Experience</span>
                  <div className='flex items-center  gap-2 my-4'>
                      <span className=''>Professional experince is an important part of a profile for patients. Tell them about your career path.</span>
                  </div>
                  {openContainers["professionalExperience"] && (<div className='flex items-center gap-2'>
                    <div className='flex items-center bg-gray-100 w-full justify-between p-2 py-3 rounded-md'>
                      <div className='flex items-center  gap-3 w-[95%]'>
                        <LuSlidersHorizontal className='text-2xl '/>
                        <div className='flex-1 grow '>
                          <input
                            className='w-[100%] border-gray-200'
                            type="text"
                            placeholder='e.g. MSMA Hospital, surgery department in Warsaw, 2010-2015'
                            name='professionalExperience'
                            defaultValue={currentDoctor.professionalExperience}
                            id='professionalExperience'
                            //value={formData.professionalExperience}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
              
                      <LiaTimesSolid className='cursor-pointer text-red-400 mr-3' onClick={() => handleCloseContainer("professionalExperience")}/>
                    </div>
              
                  </div>)}
              
                  <button type='button' className='border-[1px] p-2 rounded-md mt-4' onClick={() => handleOpenContainer("professionalExperience")}>+ Add</button>
                  <div className='my-5 bg-gray-100 p-2 py-4 rounded-md'>
                      <span className='font-medium'>Want to show your patients the "Professional Experience" section</span>
                      <p className='mb-5 '>A doctors past is very important to them. Tell them about your past professional experience.</p>
                      <span className='text-[#00b39be6] cursor-pointer'>See more &#8658;</span>
                  </div>
                </div>
              </div>
              {/*  LANGUAGES */}
              <div className='sm:w-[70%] m-auto  rounded-md bg-white p-4 mt-4'>
                <div className='w- py-4'>
                  <span className='p font-bold text-xl my-4' >Knowledge of languages</span>
                  <div className='flex items-center  gap-2 my-4'>
                      <span className=''>Be sure to list all the languages you communicate in. Foreigners alse seek medical help in Poland!</span>
                  </div>
                  <span className='mt-4 font-medium'>Languages you  speak:</span>
                  {currentDoctor.languages?.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2 mt-2">
                      
                      {currentDoctor.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="bg-[#00b39be6] text-white text-sm font-medium px-3 py-1 rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}

                  {openContainers["languages"] && (<div className='flex items-center gap-2'>
                    <div className='flex items-center bg-gray-100 w-full justify-between p-2 py-3 rounded-md'>
                      <div className='flex items-center  gap-3 w-[95%]'>
                        <LuSlidersHorizontal className='text-2xl '/>
                        <div className='flex-1 grow '>

                          <input
                            className="w-[100%] border-gray-200"
                            type="text"
                            placeholder="e.g. English, German, Spanish"
                            name="languages"
                            id="languages"
                            value={languagesText}
                            onChange={(e) => setLanguagesText(e.target.value)}
                            onBlur={() => {
                              const newLanguages = languagesText
                                .split(",")
                                .map((lang) => lang.trim())
                                .filter((lang) => lang !== "");
                            
                              setFormData((prev) => {
                                const existingLanguages = Array.isArray(prev.languages) ? prev.languages : [];
                                const combinedLanguages = [...existingLanguages, ...newLanguages];
                            
                                // Remove duplicates (case-insensitive)
                                const uniqueLanguages = Array.from(
                                  new Set(combinedLanguages.map((lang) => lang.toLowerCase()))
                                ).map((lang) => lang.charAt(0).toUpperCase() + lang.slice(1)); // Optional: capitalize
                            
                                return {
                                  ...prev,
                                  languages: uniqueLanguages,
                                };
                              });
                            }}
                            
                          />


                        </div>
                      </div>
              
                      <LiaTimesSolid className='cursor-pointer text-red-400 mr-3' onClick={() => handleCloseContainer("languages")}/>
                    </div>
              
                  </div>)}
              
                  <button type='button' className='border-[1px] p-2 rounded-md mt-4' onClick={() => handleOpenContainer("languages")}>+ Add</button>
                  <div className='my-5 bg-gray-100 p-2 py-4 rounded-md'>
                      <span className='font-medium'>Want to show your patients the "Knowledge of languages" section</span>
                      <p className='mb-5 '>Reach more patients by showing that you can conduct a visit in a foreign language</p>
                      <span className='text-[#00b39be6] cursor-pointer'>See more &#8658;</span>
                  </div>
                </div>
              </div>
              {/*  save cancel information */}
              <div className='lg:w-[70%] m-auto sm:flex justify-between rounded-md bg-white py-6 p-4 mt-4'>
                <p className='lg:w-[70%]'>We remind you that in many countries, doctors can only publish informal content that does not have advertising charecteristics. Please pay attection to the regulations in your country.</p>
                <div className='flex justify-between gap-3 mt-4'>
                  <button className=' text-blue-500   px-3 py-2 font-medium' type=''>Cancel</button>
                  <button className='bg-blue-500 text-white rounded-sm px-3 py-2 font-medium' type='button' onClick={handleSubmit}>Save changes</button>
                </div>
              </div>
              </form>
          </div>
          <div className='flex justify-center  '>
            {updateDoctorSuccess && updateSuccessDoctor && (
              <Alert color='success' className='my-5'>
               {updateSuccessDoctor}
              </Alert>
            )}
            {updateDoctorError && (
              <Alert color='failure' className='my-5'>
                {updateDoctorError}
              </Alert>
            )}
      
          </div>
        </div>
    </div>
  )
}

export default DoctorProfileInfo