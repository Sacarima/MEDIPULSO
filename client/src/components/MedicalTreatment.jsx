import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MdOutlineStarBorder, MdOutlineStarPurple500 } from 'react-icons/md';
import DoctorPublicProfileHeader from './DoctorPublicProfileHeader';
import {MdKeyboardArrowUp} from 'react-icons/md';
import axios from 'axios'
import { io } from 'socket.io-client';
import Footer from './Footer';

function MedicalTreatment() {
  const { slug } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [treatmentData, setTreatmentData] = useState(null);
  const [treatment, setTreatment] = useState(null);
  const [doctorRatings, setDoctorRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState({});
  const [err, setErr] = useState(null);

  // Function to handle doctor profile navigation
  const handleDoctorProfile = (doctor) => {
  const profileUrl = `/profile-info/${doctor._id}`;
  window.location.href = profileUrl; // forces full page load
}



const handleToggleFAQ = (index) => {
  setOpenFAQ((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};


  // Fetch treatment data
  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/treatments/slug/${slug}`);
        const data = await res.json();
        setTreatmentData(data)
        setTreatment(data.treatment)

        // Fetch reviews for each doctor in parallel
        if (data.doctors?.length) {
          const reviewPromises = data.doctors.map(async (doc) => {
            const reviewRes = await fetch(`${API_BASE_URL}/api/reviews/${doc._id}`);
            const reviewData = await reviewRes.json();

            const totalReviews = reviewData?.length || 0;
            const avgRating =
              totalReviews > 0
                ? reviewData.reduce((sum, r) => sum + r.rating, 0) / totalReviews
                : 0;

            return {
              doctorId: doc._id,
              avgRating,
              totalReviews,
            };
          });

          const reviews = await Promise.all(reviewPromises);
          const ratingsMap = {};
          reviews.forEach((r) => {
            ratingsMap[r.doctorId] = r;
          });
          setDoctorRatings(ratingsMap);
        }
      } catch (err) {
        console.error('Error fetching treatment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [slug]);


  // Rating stars helper
  const renderStars = (avg) => {
    const fullStars = Math.floor(avg);
    const emptyStars = 5 - fullStars;
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <MdOutlineStarPurple500 key={`full-${i}`} className="text-[#00c3a5] text-xl" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <MdOutlineStarBorder key={`empty-${i}`} className="text-[#00c3a5] text-xl" />
        ))}
      </>
    );
  };

useEffect(() => {
  let alive = true;

  // Build URLs safely
  const API_URL = `${API_BASE_URL}`.trim().replace(/\/$/, ""); 
  const SOCKET_URL = API_URL; // socket on the same origin/port as backend

  // 1) Initial fetch
  (async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/treatments/slug/${slug}`);
      const t = data?.treatment ?? data ?? null;
      if (alive) {
        setTreatment(t);
        setTreatmentData(data); // keep your other sections in sync
      }
    } catch (e) {
      if (alive) setErr("Failed to load treatment");
      console.error(e);
    } finally {
      if (alive) setLoading(false);
    }
  })();

  // 2) Socket.IO live updates
  const socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    // console.log("[socket] connected:", socket.id);
    socket.emit("joinTreatment", slug);
  });

  socket.on("treatment:imagesUpdated", (payload) => {
    // console.log("[socket] imagesUpdated:", payload);
    if (payload?.slug === slug && Array.isArray(payload.images)) {
      // update both pieces of state you render from
      setTreatment((prev) => (prev ? { ...prev, images: payload.images } : prev));
      setTreatmentData((prev) =>
        prev?.treatment
          ? { ...prev, treatment: { ...prev.treatment, images: payload.images } }
          : prev
      );
    }
  });


  // Cleanup on unmount or slug change
  return () => {
    alive = false;
    socket.emit("leaveTreatment", slug);
    socket.disconnect();
  };
}, [slug]); // <-- only depends on slug



  if (loading) return <p className="text-gray-500">Loading images…</p>;
  if (err) return <p className="text-red-500">{err}</p>;



    if (loading) return <p>Loading...</p>;
    if (!treatmentData?.treatment) return <p>No treatment found.</p>;


    const groupedSections = treatment?.sections?.reduce((acc, section) => {
    const { type = 'default' } = section;
    if (!acc[type]) acc[type] = [];
    acc[type].push(section);
    return acc;
    }, {});



  return (
    <div>
      
      <div className="container lg:w-[60%] mx-auto p-6 bg-white ">
        {/* TITLE */}
        <section className="border-b pb-6">
          <h2 className="text-4xl font-bold">{treatmentData.treatment.name}</h2>
          <p className="mt-4 text-gray-700">{treatmentData.treatment.description}</p>
        </section>

        {/* treatment images from firebase */} 
        <section className="border-b-[.8px] py-9 max-h-[700px] overflow-y-hidden">
            <h3 className="text-lg font-semibold mb-3">Treatment Images</h3>

            {Array.isArray(treatment?.images) && treatment.images.length > 0 ? (
            (() => {
                const imgs = [...treatment.images].reverse(); // newest first
                return (
                <>
                    {/* Top featured layout: 1 large + 2 stacked */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Left: featured (first) */}
                    <div className="md:col-span-2">
                        <img
                        src={imgs[0]}
                        alt={`${treatment.name} photo 1`}
                        className="w-full h-full max-h-[680px] object-cover rounded-md"
                        />
                    </div>

                    {/* Right: stacked (second & third if present) */}
                    <div className="flex flex-col gap-4">
                        {imgs[1] && (
                        <img
                            src={imgs[1]}
                            alt={`${treatment.name} photo 2`}
                            className="w-full h-[calc(50%-0.5rem)] max-h-[330px] object-cover rounded-md"
                        />
                        )}
                        {imgs[2] && (
                        <img
                            src={imgs[2]}
                            alt={`${treatment.name} photo 3`}
                            className="w-full h-[calc(50%-0.5rem)] max-h-[330px] object-cover rounded-md"
                        />
                        )}
                    </div>
                    </div>

                    {/* Any remaining images as a compact grid */}
                    {imgs.length > 3 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imgs.slice(3).map((img, idx) => (
                        <img
                            key={`more-${idx}`}
                            src={img}
                            alt={`${treatment.name} photo ${idx + 4}`}
                            className="w-full h-40 object-cover rounded-md"
                        />
                        ))}
                    </div>
                    )}
                </>
                );
            })()
            ) : (
            <p className="text-gray-500">No images available for this treatment.</p>
            )}

        </section>

        <div className="mt-8 space-y-10">

        {/* Benefits */}
        {groupedSections?.benefit && (
            <section>
            <h2 className="text-xl font-semibold mb-2">Benefits</h2>
            <ul className="list-disc ml-6 text-gray-700">
                {groupedSections.benefit.map(item => (
                <li key={item._id}>{item.content}</li>
                ))}
            </ul>
            </section>
        )}

        {/* Steps */}
        {groupedSections?.step && (
            <section>
            <h2 className="text-xl font-semibold mb-2">Procedure Steps</h2>
            <ol className="list-decimal ml-6 text-gray-700 whitespace-pre-line">
                {groupedSections.step.map(item => (
                <li key={item._id}>{item.content}</li>
                ))}
            </ol>
            </section>
        )}

        {/* Candidate */}
        {groupedSections?.candidate && (
            <section>
            <h2 className="text-xl font-semibold mb-2">Who Can Benefit?</h2>
            {groupedSections.candidate.map(item => (
                <div key={item._id} className="text-gray-700">
                <h3 className="font-medium">{item.title}</h3>
                <p className=''>{item.content}</p>
                </div>
            ))}
            </section>
        )}

        {/* Risk */}
        {groupedSections?.risk && (
            <section>
            <h2 className="text-xl font-semibold mb-2">Risks</h2>
            {groupedSections.risk.map(item => (
                <div key={item._id} className="text-gray-700">
                <h3 className="font-medium">{item.title}</h3>
                <p>{item.content}</p>
                </div>
            ))}
            </section>
        )}

        {/* FAQ */}
        {groupedSections?.faq && (
            <section>
            <h2 className="text-xl font-semibold mb-2">FAQs</h2>
            {groupedSections.faq.map(item => (
                <div key={item._id} className="text-gray-700">
                <h3 className="font-medium">{item.title}</h3>
                <p>{item.content}</p>
                </div>
            ))}
            </section>
        )}

        {/* Default sections (e.g. how it works, recovery, etc.) */}
        {groupedSections?.default && (
            <section>
            {groupedSections.default.map(item => (
                <div key={item._id} className="mb-4 text-gray-700">
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className=' whitespace-pre-wrap'>{item.content}</p>
                </div>
            ))}
            </section>
        )}
        </div>

        

        {/* Service price by city */}
        <section>
        <h3 className="text-3xl mt-6">Service price by city</h3>
        <div className="border-[1px] shadow-sm rounded-md mt-3">
           {treatment?.priceByCity?.length > 0 ? (
            treatment.priceByCity.map((cityData, index) => (
                <div
                key={index}
                className="mt-2 border-b-[.5px] p-4 flex justify-between"
                >
                <div>
                    <span className="font-medium underline">{cityData.city}</span>
                    <p className="text-gray-600">
                    {cityData.clinicsCount} clinics, {cityData.doctorsCount} doctors
                    </p>
                </div>
                <p className="font-medium">From {cityData.minPrice} PLN</p>
                </div>
            ))
            ) : (
            <p className="text-gray-500 p-4">No pricing data available.</p>
            )}
        </div>
        </section>


        {/* RECOMMENDED SPECIALISTS */}
        <section className="my-10">
          <h3 className="lg:text-3xl text-xl font-semibold py-4">
            {treatmentData.treatment.name}: recommended specialists and clinics
          </h3>
          <div className="mt-2 border p-4 shadow-sm rounded-md">
            {treatmentData.doctors.map((doc) => {
              const ratingInfo = doctorRatings[doc._id] || { avgRating: 0, totalReviews: 0 };
              return (
                <div
                  key={doc._id}
                  className="flex gap-4 items-center my-4 justify-between py-2 border-t"
                >
                  <div className="flex gap-2">
                    <img
                      src={doc.profilePicture || '/default-doc.jpg'}
                      alt={`${doc.firstName} ${doc.lastName}`}
                      className="w-[100px] h-[100px] border"
                    />
                    <div>
                      <li>
                        Dr. {doc.firstName} {doc.lastName}
                      </li>
                      {/* Reviews */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center">
                          {renderStars(ratingInfo.avgRating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {ratingInfo.totalReviews}{' '}
                          {ratingInfo.totalReviews === 1 ? 'review' : 'reviews'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDoctorProfile(doc)}
                    className="border px-3 py-1 rounded-md cursor-pointer hover:bg-slate-100 hover:border-[#00c3a5] hover:shadow-sm hidden lg:block"
                >
                    Show profile
                  </button>
                </div>
              );
            })}
          </div>
        </section>


            {groupedSections?.faq?.length > 0 && (
            <section className='mt-12'>
                <h2 className='text-3xl font-medium py-2'>Frequently asked questions</h2>
                <div className='border-[1px] p-4 mt-6 shadow-sm rounded-md'>
                {groupedSections.faq.map((faq, index) => (
                    <div key={faq._id || index}>
                    {/* FAQ Question */}
                    <div
                        className='flex justify-between cursor-pointer gap-2 py-4 border-t-[.5px] hover:bg-slate-100'
                        onClick={() => handleToggleFAQ(index)}
                    >
                        <p className={`${openFAQ[index] ? 'text-gray-400' : 'text-gray-700'}`}>
                        {faq.title}
                        </p>
                        <MdKeyboardArrowUp
                        className={`transition-transform text-gray-400 text-xl ${
                            openFAQ[index] ? 'rotate-180 ease-in' : 'rotate-0 ease-out'
                        }`}
                        />
                    </div>

                    {/* FAQ Answer */}
                    {openFAQ[index] && (
                        <div>
                        <p className='text-sm text-gray-700 mb-4'>{faq.content}</p>
                        </div>
                    )}
                    </div>
                ))}
                </div>
            </section>
            )}

        
      </div>

      

      <div className="bg-[#f7f9fa] p-6 mt-10 rounded-md">
        <Footer />
      </div>
    </div>
  );
}

export default MedicalTreatment;
