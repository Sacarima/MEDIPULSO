import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useRef } from "react"
import { Button, Modal, Spinner } from "flowbite-react"
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "/firebase"



const PhotoUploadModal = ({ openModal, onCloseModal, onAddPhotos }) => {
    const [selectedFiles, setSelectedFiles] = useState([])
    const [errorMessages, setErrorMessages] = useState('')
    const { currentDoctor } = useSelector((state) => state.doctor)
    const [imageFileUrl, setImageFileUrl] = useState(null) 
    const [imageFile, setImageFile] = useState(null)
    
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0)
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [loading, setLoading] = useState(false)
    const fileRef = useRef(null)


    const handleFilesSelection = (event) => {
        const newFiles = Array.from(event.target.files)
        setLoading(true)
        setTimeout(() => {
            setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles])
            setLoading(false)
            setErrorMessages('')
        }, 1000)
    }

    const handleFilesDrop = (event) => {
        event.preventDefault()
        const newFiles = Array.from(event.dataTransfer.files)
        setLoading(true)
        // loading delay
        setTimeout(() => {
            setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles])
            setLoading(false)
            setErrorMessages('')
        }, 1000)
    }

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    const handleDeleteAll = () => {
        setSelectedFiles([])
    }

    const handleUpload = () => {
        //upload files logic needs to be coded here
        if ( selectedFiles.length > 0) {
            onAddPhotos(selectedFiles)
            onCloseModal()
        } else {
            setErrorMessages('Please select at least one photo before uploading.')
        }
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
          setImageFile(file)
          setImageFileUrl(URL.createObjectURL(file))
        }
      }
    
      const handleChange = (event) => {
        handleImageChange(event)
        handleFilesSelection(event)
      }
      
      useEffect(() => {
        if (imageFile) {
          console.log('Uploading image:', imageFile)
          uploadImage(imageFile)
        }
      }, [imageFile])

      const uploadImage = async (file) => {
        if (!file) {
          console.error('No file provided for upload')
          return
        }
        const storage = getStorage(app)
        const fileName = new Date().getTime() + '-' + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = 
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log('Upload progress' + progress + '% done')
              setImageFileUploadingProgress(Math.round(progress))
            },
            (error) => {
              setImageFileUploadError('Failed to upload image (File must be less than 2MB)')
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageFileUrl(downloadURL)
                console.log("File uploaded successfully:", downloadURL)
              }
            )
            }
          )
       })
      }


    return (
        <div>
            <Modal show={openModal} size="2xl" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Upload Photos
          </h3>
          <p >Drag and drop your photos here or select them from your computer.</p>

          {/* Drag-and-Drop Area */}
          <div
            className="w-full h-48 border-2 border-dashed border-gray-300 flex items-center justify-center"
            onDrop={handleFilesDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              id="file-upload"
              name="file-upload"
              multiple
              accept="image/*"
              //onChange={handleFilesSelection}
              onChange={handleChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {loading ? (
                <Spinner>Loading...</Spinner> // Loading Animation
              ) : (
                <>
                <div className="relative inline-block text-lg group">
                    <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-blue-500 rounded-lg group-hover:text-white">
                    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                    <span className="absolute left-0 w-full h-48  transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-blue-500 group-hover:-rotate-180 ease"></span>
                    <span className="relative">Drag and drop files here, or click to select files</span>
                    </span>
                    <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-blue-500 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>

                </div>            
                 </>
              )}
            </label>
          </div>

          {/* Error Message */}
          {errorMessages && (
            <p className="text-red-500">{errorMessages}</p> 
          )}

          {/* Preview Section */}
          <div className="flex flex-wrap gap-4">
            {selectedFiles.length > 0 ? (
              selectedFiles.map((file, index) => (
                <img
                  key={index}
                  src={imageFileUrl || URL.createObjectURL(file)}
                  alt={`preview ${index}`}
                  className="w-32 h-42 object-cover"
                />
              ))
            ) : (
              <p>No files selected</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Button color="gray" onClick={handleDeleteAll}>
              Delete All
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleUpload}>Upload</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
        </div>
    )
}

export default PhotoUploadModal