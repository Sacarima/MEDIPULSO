import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io";
import DoctorPublicProfileHeader from "../components/DoctorPublicProfileHeader";
import { FaCalendarAlt } from "react-icons/fa";
import RandomDoctors from "../components/doctor/RandomDoctors"
import DoctorReviews from "../components/review/DoctorReviews"
import { RiArrowRightSLine } from "react-icons/ri";
import { GiBeveledStar } from "react-icons/gi"
import onlineImg from "../assets/online.png";
import Footer from "../components/Footer";

const Questions = () => {
  const { questionId } = useParams();  // Get the questionId from the URL
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const res = await fetch(`http://localhost:7500/api/questions/${questionId}`);
        const data = await res.json();
        if (res.ok) {
          setQuestion(data.question);  // Set the question data
        } else {
          console.error('Error fetching question details:', data.message);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);  // Stop loading once data is fetched
      }
    };

    fetchQuestionDetails();
  }, [questionId]);

  // Render stars for the doctor's rating
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

  if (!question) {
    return <p>Question not found.</p>;
  }

  const answerText = question.answers.length === 1 ? "answer" : "answers"; 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg("")
    setErrorMsg("")

    try {
      const res = await fetch("http://localhost:7500/api/questions/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        credentials: "include",
        body: JSON.stringify({ questionText }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Something went wrong.")

      setSuccessMsg("Your question was submitted successfully.")
      setQuestionText("")

        // Wait 2 seconds before hiding the spinner
        setTimeout(() => {
            setLoading(false);
        }, 4000)
    } catch (err) {
      setErrorMsg(err.message)
      setTimeout(() => {
        setLoading(false);
      }, 4000); 
    }
    }


  return (
    <div className="bg-[#f0f4f8] min-h-screen">
      <DoctorPublicProfileHeader />
      <div className="lg:w-[70%] md:w-[90%] mx-auto p-6 shadow rounded-md bg-white">
        <div className="border-b pb-4">
          <span className="text-xl font-medium">Question: {question.questionText}</span>
          {/* Display number of answers */}
          <p className="text-sm text-gray-500  mt-2">
            {question.answers.length} {answerText}
          </p>
        </div>
        <p className="mt-4 text-sm text-gray-500 text-end">
          Asked by: {question.user.firstName} {question.user.lastName}
        </p>
        <div className="mt-6">
          <h3 className="text-xl font-medium mb-4">Answers:</h3>
          {question.answers.length === 0 ? (
            <p>No answers yet.</p>
          ) : (
            question.answers.map((answer, idx) => (
              <div key={idx} className="mt-6 flex flex-col lg:flex-row gap-8">
                <div className="lg:w-[70%] pr-6 bg-gray-100 p-4 rounded">
                  <strong>Doctor's Answer:</strong>
                  <p className="mt-2">{answer.text}</p>
                </div>
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={answer.doctor.profilePicture || "/default-avatar.png"}
                      alt="Doctor Avatar"
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="">
                      <p className="font-medium text-blue-500">
                        Dr. {answer.doctor.firstName} {answer.doctor.lastName}
                      </p>
                      <p className="text-gray-500 text-sm">{answer.doctor.medicalCategory}</p>
                      <p className="text-gray-400 text-sm">{answer.doctor.city}</p>
                      {/* Display stars for the doctor's rating */}
                      <div className="flex text-[#00c3a5] text-xl">
                    
                        <DoctorReviews doctorId={answer.doctor._id} />
                      </div>
                    
                    </div>
                  </div>
                  <button
                      onClick={() => navigate(`/profile-info/${answer.doctor._id}`)}
                      className="bg-blue-500 text-white rounded p-2 mt-4 flex items-center gap-2 "
                    >
                      <FaCalendarAlt />
                      Make an appointment
                    </button>
                </div>
              </div>
            ))
          )}
          <div className="p-4 mx-auto flex mt-10 border-b-[.5px] border-gray-200 my-4">
            <div className="flex-1]">
              <GiBeveledStar className="text-5xl text-[#942ae4ab]"/>
              <span className="text-xl text-[#942ae4ab]">Get answers with an online consultation</span>
              <p>If you need expert advice, schedule an online consultation. You'll get all the answers without leaving your home.</p>
              <div className="">
                <button className="border-[.5px] border-gray-300 rounded-md p-2 mt-4 flex items-center gap-2 cursor-pointer hover:bg-gray-100">
                  <p>Show specialists</p>
                  <RiArrowRightSLine />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <img src={onlineImg} alt="Online Consultation" className="w-[40%] mt-4 ml-auto mr-8" />
            </div>
          </div>
        </div>
        {/* Display random doctors */}
      
      </div>
      <div className="lg:w-[70%] mx-auto mt-6 lg:p-6 shadow bg-white">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Still looking for an answer? Ask a new question</h2>
        </div>
      <div className="p-8 bg-[#e0f7f4] rounded  mx-auto">
              <h2 className="text-lg font-semibold mb-4">Your question</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  className="w-full border border-gray-200 p-3 rounded-md placeholder:text-gray-400"
                  placeholder="Type your health-related question here..."
                  rows={6}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
               
               <ul className=" space-y-1 text-gray-500 text-sm list-disc list-inside dark:text-gray-400">
                <li>Your question will be published anonymously.</li>
                <li>Be sure to ask one specific question, describing the problem concisely.</li>
                <li>The question will go to specialists using the service, not to a specific doctor.</li>
                <li>Remember that asking a question does not replace consultation with a doctor or specialist.</li>
                <li>This place is not for obtaining a diagnosis or confirmation of one already issued by a doctor. For this purpose, make an appointment with a doctor.</li>
                <li>Out of concern for your health, we do not publish information about drug dosages.</li>
               </ul>

               <button
                  type="submit"
                  className="bg-blue-500 text-white w-full lg:w-auto  py-2 px-4 rounded hover:bg-blue-700 cursor-pointer "
                  disabled={loading || questionText.length < 10}
                >
                  {loading ? "Submitting..." : "Submit Question"}
                </button>
                {successMsg && <p className="text-green-600">{successMsg}</p>}
                {errorMsg && <p className="text-red-600">{errorMsg}</p>}
              </form>
        </div>
      </div>

      <div className="w-[70%] mx-auto py-4 text-gray-400 text-sm">
          <p>All content, especially questions and answers, relating to medical topics is for informational purposes only and cannot, under any circumstances, replace a medical diagnosis  </p>
      </div>

      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );

};



export default Questions;
