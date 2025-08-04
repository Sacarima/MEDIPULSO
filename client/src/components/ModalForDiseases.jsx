import { useState, useEffect } from "react";
import { Button, Checkbox, Label, Modal } from "flowbite-react";
import { useSelector } from "react-redux";

const ModalForDiseases = ({
  openModal,
  onCloseModal,
  onSaveDiseases,
  defaultValue = [],   // existing doctor.diseases
  options = [],        // memoizedDiseases
}) => {
  const [selectDiseases, setSelectDiseases] = useState(defaultValue);
  const [newDisease, setNewDisease] = useState("");
  const [diseases, setDiseases] = useState(options);

  const { currentDoctor } = useSelector((state) => state.doctor);
  const doctorId = currentDoctor?._id;
  const specialtyName = currentDoctor?.specialty?.name;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleDiseaseChange = (e) => {
    const { checked, value } = e.target;
    setSelectDiseases((prev) =>
      checked
        ? prev.includes(value)
          ? prev
          : [...prev, value]
        : prev.filter((d) => d !== value)
    );
  };

  const handleAddDisease = () => {
    const trimmed = newDisease.trim();
    if (!trimmed) return;
    setDiseases((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
    setSelectDiseases((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
    setNewDisease("");
  };

  const handleSave = () => {
    // merge original + current to avoid overwriting
    const merged = Array.from(
      new Set([...(defaultValue || []), ...selectDiseases])
    );
    onSaveDiseases(merged);
    onCloseModal();
  };

  useEffect(() => {
    if (!openModal) return;

    (async () => {
      let url;
      if (doctorId) {
        url = `${API_BASE_URL}/api/doctor-form/treatments/${doctorId}`;
      } else if (specialtyName) {
        url = `${API_BASE_URL}/api/treatments/specialty/${specialtyName}`;
      } else {
        url = `${API_BASE_URL}/api/treatments`;
      }

      const res = await fetch(url);
      const data = await res.json();

      // merge instead of replace
      setSelectDiseases((prev) =>
        Array.from(
          new Set([...(prev || defaultValue), ...(data.selectedDiseases || [])])
        )
      );
      setDiseases((prev) =>
        Array.from(
          new Set([...(prev || options), ...(data.treatments || [])])
        )
      );
    })();
  }, [openModal, doctorId, specialtyName, defaultValue, options]);

  return (
    <Modal show={openModal} size="2xl" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium">Widget for adding treated diseases</h3>
          <p className="text-sm">
            We have prepared a list of diseases treated by specialists like you. Select the ones you treat or add new.
          </p>

          {/* New disease input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newDisease}
              onChange={(e) => setNewDisease(e.target.value)}
              placeholder="Type a new disease"
              className="border rounded px-2 py-1 flex-1"
            />
            <button
              type="button"
              onClick={handleAddDisease}
              className="bg-green-500 text-white rounded px-3 py-1 hover:bg-green-600"
            >
              Add
            </button>
          </div>

          {/* Diseases grid */}
          <div>
            <span className="font-bold">Diseases treated by specialists:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 ml-6">
              <div>
                {diseases.slice(0, 5).map((disease) => (
                  <div key={disease}>
                    <Checkbox
                      id={disease}
                      value={disease}
                      checked={selectDiseases.includes(disease)}
                      onChange={handleDiseaseChange}
                      className="text-blue-600 bg-gray-100 focus:ring-blue-500 focus:ring-2"
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
                      checked={selectDiseases.includes(disease)}
                      onChange={handleDiseaseChange}
                      className="text-blue-600 bg-gray-100 focus:ring-blue-500 focus:ring-2"
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
  );
};

export default ModalForDiseases;
//Encompasses a range of activities, from initial diagnosis and treatment to ongoing patient management and research. 