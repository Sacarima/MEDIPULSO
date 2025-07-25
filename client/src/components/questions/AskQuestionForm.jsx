import { useState, useEffect } from "react"
import DoctorPublicProfileHeader from "../DoctorPublicProfileHeader"
import { FaCheckCircle } from "react-icons/fa"
import questionImg from "../../assets/question.png"
import LoadingOverlay from "../LoadingOverlay"
import { BiSolidMessageDots } from "react-icons/bi"
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from 'react-icons/io'
import { IoEnterSharp } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { TbMessages } from "react-icons/tb";
import { FaUserDoctor } from "react-icons/fa6";
import axios from "axios"
import DoctorReviews from "../review/DoctorReviews"
import MostActiveDoctors from "./MostActiveDoctors"
import { Link } from "react-router-dom"
import Footer from "../Footer"

const AskDoctorForm = () => {
  const [questionText, setQuestionText] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [specialties, setSpecialties] = useState([])
  const [popularQuestions, setPopularQuestions] = useState([])
  const [visibleQuestions, setVisibleQuestions] = useState(3)
  const [stats, setStats] = useState({
       questionsAsked: 0,
       answersProvided: 0,
       doctorsSpecialists: 0,
     });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

 const loadMoreQuestions = () => {
    setVisibleQuestions(visibleQuestions + 3)
  }


     // Fetch Specialties
     useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/specialties`);
                setSpecialties(response.data.specialties || []);
            } catch (error) {
                console.error(" Failed to fetch specialties:", error.response?.data || error.message);
            }
        };
        fetchSpecialties();
      }, []);

 
      const fetchPopularQuestions = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${API_BASE_URL}/api/questions/popular`);
          const data = await res.json();
          if (res.ok) {
            setPopularQuestions(data.questions);
          } else {
            console.error('Error fetching popular questions:', data.message);
          }
        } catch (err) {
          console.error('Error fetching popular questions:', err);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchPopularQuestions();
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

      useEffect(() => {
        const fetchStats = async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/stats`); 
            const data = await res.json();
      
            if (res.ok) {
              setStats(data.stats); // Ensure you are setting the stats correctly
            } else {
              console.error("Error fetching stats:", data.message);
            }
          } catch (err) {
            console.error("Error fetching stats:", err);
          }
        };
      
        fetchStats();
      }, [])

        //getFirstThreeParagraphs
        const truncateByWords = (text, maxWords = 40) => {
            const words = text.trim().split(/\s+/);  // Split text by spaces to get words
            return {
              limited: words.slice(0, maxWords).join(" "),  // Limit the words to maxWords and join back to text
              isTruncated: words.length > maxWords,  // Check if there are more words than allowed
            };
          };
          
      

      
      const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setSuccessMsg("")
        setErrorMsg("")
    
        try {
          const res = await fetch(`${API_BASE_URL}/api/questions/ask`, {
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
    <div className="bg-gray-100 min-h-screen">
        
        <DoctorPublicProfileHeader />
        {loading && <LoadingOverlay isLoading={loading} delay={4000} />}
        <nav className="lg:w-[70%] w-full mx-auto">
            <ul className="flex ml-2 items-center space-x-2 text-gray-500 text-sm mt-4  ">
                <li className="cursor-pointer hover:underline">Home Page</li>
                <li>/</li>
                <li className="cursor-pointer hover:underline">Questions and Answers</li>
            </ul>
        </nav>
        <div className="lg:w-[70%] w-full mx-auto bg-white p-6 mt-4 rounded">
            <div className="flex flex-col lg:flex-row mt-4">
                <div className="lg:w-[60%] w-full">
                    <h2 className="text-3xl">Ask our doctors a question</h2>
                    <p className="mt-2">Get help with your health concerns using the knowledge of our doctors and specialists.</p>
                    <div className="flex items-center gap-2 mt-4">
                        <FaCheckCircle className="text-[#00c3a5]"/>
                        <p>You get some answers</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <FaCheckCircle className="text-[#00c3a5]"/>
                        <p>Most often within 48 hours</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <FaCheckCircle className="text-[#00c3a5]"/>
                        <p>Completely free!</p>
                    </div>
                </div>

                <div className="lg:w-[40%]">
                    <img src={questionImg} alt="two people inquiring" />
                </div>
            </div>
            <div className="p-8 bg-[#e0f7f4] w-full rounded  mx-auto">
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
                  className="bg-blue-500 text-white  py-2 px-4 rounded hover:bg-blue-700 cursor-pointer "
                  disabled={loading || questionText.length < 10}
                >
                  {loading ? "Submitting..." : "Submit Question"}
                </button>
                {successMsg && <p className="text-green-600">{successMsg}</p>}
                {errorMsg && <p className="text-red-600">{errorMsg}</p>}
              </form>
        </div>

     <div className="flex items-center gap-4 mt-8 justify-between pb-8 pt-4">
            <div className="flex items-center gap-4">
                <BiSolidMessageDots className="text-4xl text-blue-500"/>
                <div>
                    <h2>{stats.questionsAsked}</h2>
                    <p>Questions asked by patients</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <TbMessages className="text-4xl text-blue-500"/>
                <div>
                    <h2>{stats.answersProvided}</h2>
                    <p>Answers provided by doctors</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <FaUserDoctor className="text-4xl text-blue-500"/>
                <div className="">
                    <h2>{stats.doctorsSpecialists}</h2>
                    <p className="mr-6">Doctors and specialists answering questions</p>
                </div>
            </div>
        </div>
        </div>   

        <div className="lg:w-[70%] mx-auto bg-white p-6 mt-4 pb-14 rounded">
            <div className="border-b pb-4">
                <span className="text-xl font-medium">How does it work?</span>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-4 mt-4">
                <div className="text-center">
                    <div className="bg-slate-100 w-12 h-12 mx-auto rounded-full text-center my-4">
                        <p className="p-3">1</p>
                    </div>
                    <p className="font-medium text-lg">You ask a question</p>
                    <p>You ask a short question regarding your health concerns.</p>
                </div>
                <div className="text-center">
                    <div className="bg-slate-100 w-12 h-12 mx-auto rounded-full text-center my-4">
                        <p className="p-3">2</p>
                    </div>
                    <p className="font-medium text-lg">The question is sent to doctors</p>
                    <p>The question is verified by a moderator and then sent to the appropriate doctors and specialists.</p>
                </div>
                <div className="text-center">
                    <div className="bg-slate-100 w-12 h-12 mx-auto rounded-full text-center my-4">
                        <p className="p-3">3</p>
                    </div>
                    <p className="font-medium text-lg">The doctor answers</p>
                    <p>Typically, a question is answered by several doctors and specialists.</p>
                </div>
                <div className="text-center">
                    <div className="bg-slate-100 w-12 h-12 mx-auto rounded-full text-center my-4">
                        <p className="p-3">4</p>
                    </div>
                    <p className="font-medium text-lg">You are reading the answer</p>
                    <p>We will notify you about the doctor's response by email.</p>
                </div>
            </div>
        </div>
        


        <div className="lg:w-[70%] w-full mx-auto">
        {/* Display popular questions */}
        <div className="bg-white p-6 mt-8 rounded">
            <div className="border-b pb-4">
            <span className="text-xl font-medium">Most popular questions from the last 30 days</span>
            </div>

            {loading ? (
            <p>Loading...</p>
            ) : popularQuestions.length === 0 ? (
            <p>No popular questions found.</p>
            ) : (
            popularQuestions.slice(0, 3).map((question) => (  // Limit to first 3 questions
                <div key={question._id} className="my-6">
                <div className="p-4 shadow-md rounded border-t-[.5px]">
                    {/* Truncate Question Text */}
                    {(() => {
                    const { limited: limitedQuestionText, isTruncated: questionTruncated } = truncateByWords(question.questionText);
                    return (
                        <>
                        <p className="cursor-pointer hover:underline" onClick={() => window.location.href = `/questions/${question._id}`}>
                            {limitedQuestionText}
                        </p>
                        {questionTruncated && (
                        
                                <IoEnterSharp  className="text-3xl mt-2 text-blue-500 cursor-pointer" onClick={() => window.location.href = `/questions/${question._id}`}/>
                        
                        )}
                        </>
                    );
                    })()}
                </div>
                {question.answers.slice(0, 1).map((answer, idx) => (  // Only show the first answer for preview
                    <div key={idx} className="mt-8 flex gap-6 ">
                    {/* Truncate Answer Text */}
                    {(() => {
                        const { limited: limitedAnswerText, isTruncated: answerTruncated } = truncateByWords(answer.text);
                        return (
                        <div className="lg:w-[70%] w-full pr-6 bg-gray-100 p-4 rounded ">
                            <strong>Doctor's Answer:</strong> {limitedAnswerText}
                            {answerTruncated && (
                            
                                <IoEnterSharp  className="text-3xl mt-2 text-blue-500 cursor-pointer" onClick={() => window.location.href = `/questions/${question._id}`}/>
                            
                            )}
                        </div>
                        );
                    })()}
                    <div className="grow">
                        <Link to={`/profile-info/${answer.doctorInfo._id}`}>
                        <div className="flex gap-4 cursor-pointer">
                            <img
                            src={answer.doctorInfo.profilePicture || "/default-avatar.png"}
                            alt="Doctor Avatar"
                            className="w-14 h-14 rounded"
                            />
                            <div className="">
                            <p className="font-medium text-blue-500">
                                Dr. {answer.doctorInfo.firstName} {answer.doctorInfo.lastName}
                            </p>
                            <p>{answer.doctorInfo.specialty}</p>
                            <p>{answer.doctorInfo.degree}</p>
                            </div>
                        </div>
                        </Link>
                        <Link to={`/profile-info/${answer.doctorInfo._id}`}>
                        <button className="bg-blue-500 flex mt-4 items-center gap-2 p-2 shrink rounded text-white cursor-pointer" type="button">
                            <FaCalendarAlt />
                            <p>Make an appointment</p>
                        </button>
                        </Link>
                    </div>
                    </div>
                ))}
                </div>
            ))
            )}
        </div>
        </div>

        


        

        <div className="lg:w-[70%] w-full mx-auto mt-8">
            <MostActiveDoctors />
        </div>

        <div className="bg-white">
            <Footer />
        </div>
    </div>
  )
}

export default AskDoctorForm
                    