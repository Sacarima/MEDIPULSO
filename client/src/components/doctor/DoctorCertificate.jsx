
import { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "/firebase";

const storage = getStorage(app);

const DoctorCertificate = ({ handleNext, handleBack, setCertificateUpload }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false); //Modal state

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError("");
  };

  //Handle file upload
  const uploadCertificate = () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) { // 15MB Limit
      setError("File size must be less than 15MB.");
      return;
    }

    if (!file.type.includes("pdf") && !file.type.includes("image")) {
      setError("Only PDF and image files are allowed.");
      return;
    }

    const storageRef = ref(storage, `certificates/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setError("Upload failed. Please try again.");
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setFileUrl(url);
        setError("");
      }
    );
  };

  // Handle Next Step
  const handleNextStep = () => {
    if (!licenseNumber.trim()) {
      setError("Please enter your license number.");
      return;
    }
    if (!fileUrl) {
      setError("Please upload your certificate before proceeding.");
      return;
    }

    setCertificateUpload({ licenseNumber, certificateUrl: fileUrl });
    handleNext();
  };

   //  Handle modal close when clicking outside
   const handleOutsideClick = (e) => {
    if (e.target.id === "modalBackground") {
      setShowPreview(false);
    }
  };

  return (
    <div>
      <section className="lg:pr-24 p-6 lg:mt-24">
        <h2 className="text-3xl">Certification</h2>
        <p className="text-sm mt-4 text-gray-400">
          Please provide your license number or document confirming your right to practice as a doctor.
        </p>

        {/*  License Number Input */}
        <div className="flex flex-col mt-4">
          <label htmlFor="licenseNumber" className="font-semibold">PWZ No.</label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            className="border border-gray-300 p-2 rounded mt-2"
            required
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />
        </div>

        {/*  File Upload Input */}
        <p className="font-semibold mt-8">Degree Scan</p>
        <div className="w-full py-9 bg-gray-50 rounded-2xl border border-gray-300 gap-3 grid border-dashed">
          {fileUrl ? (
            <div className="flex flex-col items-center">
              <p className="text-green-500 text-sm">File Uploaded Successfully!</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                onClick={() => setShowPreview(true)}
              >
                Preview File
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
                onClick={() => {
                  setFile(null);
                  setFileUrl("");
                  setUploadProgress(0);
                }}
              >
                Remove File
              </button>
            </div>
          ) : (
            <div>
              <input type="file" hidden id="fileUpload" accept=".pdf,image/*" onChange={handleFileChange} />
              <label htmlFor="fileUpload" className="flex flex-col items-center cursor-pointer">
                <svg className="mx-auto" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 4V28M20 28L12 20M20 28L28 20M4 36H36"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <p className="text-gray-400 text-xs">PNG, JPG, or PDF, smaller than 15MB</p>
                <div className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Choose File</div>
              </label>
            </div>
          )}
        </div>
        <button
            className="bg-blue-500 text-white px-4 py-2 mt-2 w-full rounded"
            onClick={uploadCertificate}
          >
            Upload File
          </button>

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <p className="mt-2 text-blue-500 text-sm">Uploading... {Math.round(uploadProgress)}%</p>
        )}

        {/* Show Errors */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-end mt-5">
          <button className="text-gray-400 shadow-sm border-[1px] w-24 mt-5 mb-2 py-2 rounded" onClick={handleBack}>
            Back
          </button>
          <button className="text-white bg-blue-500 w-24 mt-5 mb-2 py-2 rounded" onClick={handleNextStep}>
            Next
          </button>
        </div>

        {/* File Preview Modal */}
        {showPreview && (
          <div
            id="modalBackground"
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={handleOutsideClick}
          >
            <div className="bg-white p-5 rounded-lg max-w-lg relative">
              {/*  Close Button */}
              <button
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs"
                onClick={() => setShowPreview(false)}
              >
                X
              </button>

              {/* File Preview */}
              {fileUrl.includes(".pdf") ? (
                <iframe src={fileUrl} className="w-full h-[500px]" title="PDF Preview"></iframe>
              ) : (
                <img src={fileUrl} alt="Uploaded" className="w-full rounded" />
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default DoctorCertificate;
