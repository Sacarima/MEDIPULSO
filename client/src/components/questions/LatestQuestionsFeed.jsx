import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

const LatestQuestionsFeed = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

  useEffect(() => {
    const fetchLatestQuestions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/questions/answered-latest?limit=5`);
        const data = await res.json();
        if (data.success) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestQuestions();
  }, []);

  //getFirstThreeParagraphs
  const truncateByWords = (text, maxWords = 30) => {
    const words = text.trim().split(/\s+/);
    return {
      limited: words.slice(0, maxWords).join(" "),
      isTruncated: words.length > maxWords,
    };
  };
  
  

  if (loading) return <p>Loading latest Q&A...</p>;

  return (
    <div className="p-4 rounded-xl bg-white ">
    {questions.length === 0 ? (
      <p>No answered questions yet.</p>
    ) : (
      questions.slice(0, 3).map((q) => {  // Limit to first 3 questions
        const { limited: limitedQuestionText, isTruncated: questionTruncated } = truncateByWords(q.questionText);
  
        return (
          <div key={q._id} className="mb-4 pb-3">
            <p
              className="font-medium text-gray-600 whitespace-pre-wrap cursor-pointer hover:underline"
              onClick={() => navigate(`/questions/${q._id}`)}
            >
              Q: {limitedQuestionText}
              {questionTruncated && (
                <span
                  className="text-blue-600 cursor-pointer ml-2 hover:underline"
                  onClick={() => navigate(`/questions/${q._id}`)}
                >
                  More...
                </span>
              )}
            </p>
            <p className="text-sm text-gray-500 text-end">
              Asked by: {q.user.firstName} {q.user.lastName}
            </p>
  
            <div className="mt-2">
              {q.answers.slice(0, 1).map((a, idx) => {  // Limit to first answer only
                const { limited: limitedAnswerText, isTruncated: answerTruncated } = truncateByWords(a.text);
                return a.doctor ? (
                  <div className="mt-4" key={idx}>
                    <p className="text-gray-400 uppercase">Doctor's answer:</p>
                    <div className="text-sm flex items-start gap-4 mt-2">
                      <Link to={`/profile-info/${a.doctor._id}`} className="flex-shrink-0">
                        <img
                          src={a.doctor.profilePicture || "/default-avatar.png"}
                          alt="Doctor avatar"
                          className="w-16 h-16 rounded object-cover"
                        />
                      </Link>
                      <div className="flex flex-col  leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                        <Link to={`/profile-info/${a.doctor._id}`} >
                          <p className="font-medium text-blue-500">
                            Dr. {a.doctor.firstName} {a.doctor.lastName}
                          </p>
                        </Link>
                        <p className="whitespace-pre-wrap">
                          {limitedAnswerText}
                          {answerTruncated && (
                            <span
                              className="text-blue-600 cursor-pointer ml-2 hover:underline"
                              onClick={() => navigate(`/questions/${q._id}`)}
                            >
                              More...
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="text-sm text-red-600 mt-2">
                    Answer by a deleted doctor:
                    <p>{a.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })
    )}
  </div>
  
);
}

export default LatestQuestionsFeed