import { useEffect, useState } from 'react';
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from 'react-icons/io';

const DoctorReviews = ({ doctorId }) => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:7500/api/reviews/${doctorId}`);
        const data = await res.json();
        if (res.ok) {
          // Calculate the average rating
          const totalRating = data.reduce((acc, review) => acc + review.rating, 0);
          const avgRating = totalRating / data.length;
          setAverageRating(avgRating);
        } else {
          console.error('Error fetching reviews:', data.message);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, [doctorId]);

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

  return (
    <div>
      <div className='flex text-[#00c3a5] text-xl'>{renderStars(averageRating)}</div>
    </div>
  );
};

export default DoctorReviews;
