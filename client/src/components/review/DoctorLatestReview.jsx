import { useEffect, useState } from 'react';
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const DoctorLatestReview = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

  useEffect(() => {
    const fetchDoctorsWithReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/doctors-with-latest-reviews`);  
        const data = await res.json();
        if (res.ok) {
          setDoctors(data.doctors);  // Set the doctors' data with their latest reviews
        } else {
          console.error('Error fetching doctors with reviews:', data.message);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);  // Stop loading after data fetch
      }
    };

    fetchDoctorsWithReviews();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push(<IoMdStar key={`full-${i}`} />);
    if (halfStar) stars.push(<IoMdStarHalf key="half" />);
    for (let i = 0; i < emptyStars; i++) stars.push(<IoMdStarOutline key={`empty-${i}`} />);

    return stars;
  }

   //getFirstThreeParagraphs
   const truncateByWords = (text, maxWords = 40) => {
    const words = text.trim().split(/\s+/);  // Split text by spaces to get words
    return {
      limited: words.slice(0, maxWords).join(" "),  // Limit the words to maxWords and join back to text
      isTruncated: words.length > maxWords,  // Check if there are more words than allowed
    };
  };

  return (
    <div className="">
      {loading ? (
        <p>Loading...</p>
      ) : doctors.length === 0 ? (
        <p>No active doctors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Display only the first 3 doctors */}
          {doctors.slice(0, 3).map((doctor) => (
            <div key={doctor._id} className="doctor-card mt-4 flex gap-4">
              <div className="flex-shrink-0">
                  {/* Link to the doctor's profile */}
                  <Link to={`/profile-info/${doctor._id}`} className='w-full'>
                    <img
                      src={doctor.profilePicture || "/default-avatar.png"}
                      alt="Doctor Avatar"
                      className="w-16 h-16 rounded object-cover"
                    />
                  </Link>
              </div>

              {/* Display the latest review if it exists */}
              {doctor.latestReview ? (
                <div className="mt-2">
                    <div className='flex items-center justify-between gap-2'>
                        <Link to={`/profile-info/${doctor._id}`} className='w-full'>
                          <span className="text-blue-500 font-medium cursor-pointer">{doctor.firstName} {doctor.lastName}</span>
                        </Link>
                        <div className="flex text-[#00c3a5] text-xl">{renderStars(doctor.latestReview.rating)}</div>
                    </div>
                  
                  <div className="mt-2 bg-gray-100 p-4 rounded-md">
                    
                  <div className="mt-2 bg-gray-100  rounded-md">

                    {/* Truncate the review comment */}
                    {doctor.latestReview.comment && (
                        <p>
                        {truncateByWords(doctor.latestReview.comment, 20).limited} {/* Change 20 to your desired limit */}
                        {truncateByWords(doctor.latestReview.comment, 20).isTruncated && (
                            <span className="text-gray-900 font-medium text-sm cursor-pointer ml-2 hover:underline" onClick={() => navigate(`/profile-info/${doctor._id}`)}>
                            More...
                            </span>
                        )}
                        </p>
                    )}
                    </div>

                    {/* Display user name only if available */}
                    {doctor.latestReview.user && doctor.latestReview.user.firstName && doctor.latestReview.user.lastName && (
                      <p className='text-slate-500 text-end'><strong>{doctor.latestReview.user.firstName}</strong></p>
                    )}
                  </div>
                </div>
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorLatestReview;
