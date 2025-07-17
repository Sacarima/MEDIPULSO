import { useEffect, useState } from "react"
import { TbMessages } from "react-icons/tb"
import DoctorReviews from "../review/DoctorReviews"
import { Link } from "react-router-dom"

const MostActiveDoctors = () => {
  const [activeDoctors, setActiveDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch the most active doctors
  const fetchActiveDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:7500/api/questions/most-active-doctors");
      const data = await res.json();
      if (res.ok) {
        setActiveDoctors(data.activeDoctors); // Set the data received from backend
      } else {
        console.error("Error fetching active doctors:", data.message);
      }
    } catch (err) {
      console.error("Error fetching active doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveDoctors();
  }, []);

  return (
    <div className="p-4 rounded bg-white">
      <div className="border-b-[.5px] border-gray-300 pb-2 ">
        <span className="text-xl font-medium">Most Active Doctors in the Last 30 Days</span>
    </div>
      {loading ? (
        <p>Loading...</p>
      ) : activeDoctors.length === 0 ? (
        <p>No active doctors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDoctors.slice(0, 3).map((doctor) => (
            <div>
                <div key={doctor.doctorId} className="doctor-card mt-8 flex gap-4">
                  <Link to={`/profile-info/${doctor.doctorId}`}>
                      <img
                        src={doctor.profilePicture || "/default-avatar.png"}
                        alt="Doctor Avatar"
                        className="w-16 h-16 rounded"
                      />
                  </Link>
                  <div>
                    <span className="text-blue-500 font-medium">{doctor.doctorName}</span>
                    <p>{doctor.specialty}</p>
                    <p className="text-gray-500">{doctor.city}</p>
                    <DoctorReviews doctorId={doctor.doctorId} />
                
                  </div>
                </div>
                <div className="flex items-cente gap-4 mt-4">
                        <TbMessages  className="text-3xl text-[#00c3a5]"/>
                        <div>
                            <span className="font-bold text-xl">{doctor.answersCount}</span>
                            <p>Answers in the last 30 days </p>
                        </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MostActiveDoctors;
