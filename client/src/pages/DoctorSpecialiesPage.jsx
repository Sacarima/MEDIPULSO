import { useState } from 'react'
import Specialties from '../components/specialtiesTreaments/DoctorSpecialties'
import Treatments from '../components/specialtiesTreaments/Treatments'


const DoctorSpecialtiesPage = () => {
    const [selectedSpecialty, setSelectedSpecialty] = useState(null)

    return (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center">Find a Doctor by Specialty</h1>
    
          {/* Specialties List */}
          <Specialties onSelect={(specialty) => setSelectedSpecialty(specialty)} />
    
          {/* Treatments for Selected Specialty */}
          {selectedSpecialty && <Treatments selectedSpecialty={selectedSpecialty} />}
        </div>
      )
}

export default DoctorSpecialtiesPage