import { useState, useEffect } from "react";
import { Button, Checkbox, Label, Modal } from "flowbite-react";
import { useSelector } from "react-redux";

const ModalForDiseases = ({ openModal, onCloseModal, onSaveDiseases }) => {
  const [selectDiseases, setSelectDiseases] = useState([])
  const { currentDoctor } = useSelector((state) => state.doctor)
  const doctorId = currentDoctor?._id
  const specialtyName = currentDoctor?.specialty?.name
  const [diseases, setDiseases] = useState([]);


  const handleDiseaseChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setSelectDiseases((prev) => [...prev, value]);
    } else {
      setSelectDiseases((prev) =>
        prev.filter((disease) => disease !== value)
      );
    }
  };

  const handleSave = () => {
    onSaveDiseases(selectDiseases);
    onCloseModal();
  };

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        let url
        if (doctorId) {
          url = `http://localhost:7500/api/doctor-form/treatments/${doctorId}`
        } else if (specialtyName) {
           url = `http://localhost:7500/api/treatments/specialty/${specialtyName}`
        } else {
          url = `http://localhost:7500/api/treatments`
        }

        const res =  await fetch(url)
        const data = await res.json()

        // Choose current diseases depend on the route used
        setSelectDiseases(data.selectedDiseases || [])
        setDiseases(data.treatments || [])
      } catch (error) {
        
      }
    }
  }, [openModal, doctorId, specialtyName])

  return (
    <div>
      <Modal show={openModal} size="2xl" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Widget for adding treated diseases
            </h3>
            <p className="text-sm">
              We have prepared a list of diseases treated by specialists like
              you. Select the ones you treat.
            </p>
            <div>
              <span className="">Diseases treated by specialists:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 ml-6">
                <div>
                  {diseases.slice(0, 5).map((disease) => (
                    <div key={disease}>
                      <Checkbox
                        id={disease}
                        value={disease}
                        onChange={handleDiseaseChange}
                        className="text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Label htmlFor={disease} className="ml-1">{disease}</Label>
                    </div>
                  ))}
                </div>
                <div>
                  {diseases.slice(5).map((disease) => (
                    <div key={disease}>
                      <Checkbox
                        id={disease}
                        value={disease}
                        onChange={handleDiseaseChange}
                        className="text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Label htmlFor={disease} className="ml-1">{disease}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button
              className="bg-blue-500 rounded-sm relative left-[90%]"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalForDiseases;
