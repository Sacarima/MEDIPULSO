import { useEffect, useState } from 'react';
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from 'react-icons/io'


const RandomDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/doctor-form/random-doctors`);  
        const data = await res.json();
        if (res.ok) {
          setDoctors(data.doctors);  // Set the doctors' data with their latest reviews
        } else {
          console.error('Error fetching random doctors:', data.message);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);  // Stop loading once data is fetched
      }
    };

    fetchDoctors();
  }, []);

  // Function to render stars based on the rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push(<IoMdStar key={`full-${i}`} />);
    if (halfStar) stars.push(<IoMdStarHalf key="half" />);
    for (let i = 0; i < emptyStars; i++) stars.push(<IoMdStarOutline key={`empty-${i}`} />);

    return stars;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doctor) => (
        <div key={doctor._id} className="doctor-card mt-4 flex gap-4">
          <div className="flex-shrink-0">
            <img
              src={doctor.profilePicture || "/default-avatar.png"}
              alt="Doctor Avatar"
              className="w-16 h-16 rounded object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-blue-500">{doctor.firstName} {doctor.lastName}</h3>
            <p>{doctor.medicalCategory}</p>
            <p>{doctor.city}</p>

            {/* Display stars for the latest review */}
            <div className="flex text-[#00c3a5] text-xl">
              {doctor.latestReview ? renderStars(doctor.latestReview.rating) : <p>No reviews yet</p>}
            </div>

            {/* Display latest review */}
            {doctor.latestReview && (
              <div className="bg-gray-100 p-4 mt-2 rounded-md">
                <p><strong>{doctor.latestReview.user.firstName} {doctor.latestReview.user.lastName}</strong></p>
                <p>{doctor.latestReview.comment}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RandomDoctors;
