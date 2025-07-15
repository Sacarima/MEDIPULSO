import Question from "../models/question.model.js"
import User from "../models/user.model.js"
import Doctor from "../models/doctorForm.model.js"
import { errorHandler } from "../utils/error.js"
import moment from "moment"


// Ask a question
// This function allows a user to ask a question.
// It checks if the question text is provided, creates a new question document, and saves it to the database.
// If successful, it returns a success message and the newly created question.
// If the question text is missing or an error occurs, it returns an appropriate error message.
// The function uses async/await for asynchronous operations and handles errors using a try/catch block
export const askQuestion = async (req, res, next) => {
    try {
      const { questionText } = req.body;
  
      if (!questionText) {
        return next(errorHandler(400, "Question text is required."));
      }
  
      const newQuestion = new Question({
        user: req.user.id, 
        questionText,
      });
  
      await newQuestion.save();
  
      res.status(201).json({
        success: true,
        message: "Question submitted successfully.",
        question: newQuestion,
      });
    } catch (error) {
      next(errorHandler(500, "Failed to submit question."));
    }
  }

  // Answer a question
// This function allows a doctor to answer a question.
// It checks if the question ID and answer text are provided, finds the question by ID,
// adds the answer to the question's answers array, and saves the updated question.
// If successful, it returns a success message and the updated question.
// If the question is not found or an error occurs, it returns an appropriate error message.
// The function uses async/await for asynchronous operations and handles errors using a try/catch block
  export const answerQuestion = async (req, res, next) => {
    try {
      const { questionId } = req.params;
      const { text } = req.body;
  
      if (!text) {
        return next(errorHandler(400, "Answer text is required."));
      }
  
      const question = await Question.findById(questionId);
      if (!question) {
        return next(errorHandler(404, "Question not found."));
      }
  
      question.answers.push({
        doctor: req.user.id, // assuming auth middleware sets req.user
        text,
      });
  
      await question.save();
  
      res.status(200).json({
        success: true,
        message: "Answer submitted successfully.",
        question,
      });
    } catch (error) {
      next(errorHandler(500, "Failed to submit answer."));
    }
  };


// Get all questions
// This function retrieves all questions from the database.
// It supports pagination and an optional filter for unanswered questions.
// It uses the Question model to find questions, populates user and doctor details, and returns them in JSON format.
// If an error occurs during the retrieval, it calls the next middleware with an
export const getAllQuestions = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, unanswered } = req.query;
  
      const query = {};
  
      // Optional filter for unanswered questions
      if (unanswered === "true") {
        query.answers = { $size: 0 };
      }
  
      const questions = await Question.find(query)
        .populate("user", "firstName lastName")
        .populate("answers.doctor", "firstName lastName profilePicture")
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
  
      const total = await Question.countDocuments(query);
  
      res.status(200).json({
        success: true,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalQuestions: total,
        questions,
      });
    } catch (error) {
      console.error("❌ Error in getAllQuestions:", error);
      next(errorHandler(500, "Failed to fetch questions."));
    }
  };
  
  

  
// Question controller
// Get question by ID
// This function retrieves a specific question by its ID.
// It populates the user who asked the question and the doctor who answered it.
// If the question is not found, it returns a 404 error.
// If successful, it returns the question details in JSON format.
// If an error occurs during the retrieval, it calls the next middleware with an error handler.
export const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId)
      .populate("user", "firstName lastName")  // Populate the user who asked the question
      .populate("answers.doctor", "firstName lastName profilePicture medicalCategory city")  // Populate the doctor who answered the question

    if (!question) {
      return next(errorHandler(404, "Question not found"));
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    next(errorHandler(500, "Failed to fetch question details"));
  }
};



  // Get user's questions
// This function retrieves all questions asked by the authenticated user.
// It populates the answers with doctor details and sorts the questions by creation date in descending order
// If successful, it returns the questions in JSON format along with the count.
// If an error occurs during the retrieval, it calls the next middleware with an error handler.
  export const getUserQuestions = async (req, res, next) => {
    try {
      const userId = req.user.id;
  
      const questions = await Question.find({ user: userId })
        .populate("answers.doctor", "firstName lastName profilePicture")
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        count: questions.length,
        questions,
      });
    } catch (error) {
      console.error("Error in getUserQuestions:", error);
      next(errorHandler(500, "Failed to fetch your questions."));
    }
  }

  // Get latest answered questions
// This function retrieves the latest questions that have been answered.
// It populates the user who asked the question and the doctors who answered it.
// It sorts the questions by the date of the latest answer and limits the results based on the `limit` query parameter.
// If successful, it returns the questions in JSON format along with the count.
// If an error occurs during the retrieval, it calls the next middleware with an error handler.
  export const getLatestAnsweredQuestions = async (req, res, next) => {
    try {
      const { limit = 10 } = req.query;
  
      const questions = await Question.find({ "answers.0": { $exists: true } })
        .populate("user", "firstName lastName")
        .populate("answers.doctor", "firstName lastName profilePicture")
        .sort({ "answers.updatedAt": -1 }) // latest answer appears first
        .limit(parseInt(limit));
  
      res.status(200).json({
        success: true,
        count: questions.length,
        questions,
      });
    } catch (error) {
      console.error(" Error in getLatestAnsweredQuestions:", error);
      next(errorHandler(500, "Failed to fetch answered questions."));
    }
  }

  // Delete an answer
// This function allows a doctor or admin to delete an answer to a question.
// It checks if the user is authorized to delete the answer (either the doctor who wrote it or an admin).
// If the answer is found, it removes it from the question's answers array
// and saves the updated question.
// If successful, it returns a success message.
  export const deleteAnswer = async (req, res, next) => {
    try {
      const { questionId, answerIndex } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
  
      const question = await Question.findById(questionId);
      if (!question) {
        return next(errorHandler(404, "Question not found"));
      }
  
      const answer = question.answers[answerIndex];
      if (!answer) {
        return next(errorHandler(404, "Answer not found"));
      }
  
      // Check if the user is the doctor who wrote it, or is an admin
      const isDoctorAnswer = answer.doctor.toString() === userId;
      const isAdmin = userRole === "admin";
  
      if (!isDoctorAnswer && !isAdmin) {
        return next(errorHandler(403, "You are not allowed to delete this answer."));
      }
  
      // Remove the answer
      question.answers.splice(answerIndex, 1);
      await question.save();
  
      res.status(200).json({
        success: true,
        message: "Answer deleted successfully.",
      });
    } catch (error) {
      console.error(" Error deleting answer:", error);
      next(errorHandler(500, "Failed to delete answer."));
    }
  };


  // Get popular questions from the last 30 days
// This function retrieves the most popular questions based on the number of answers they received in the last 30 days.
// It aggregates questions, unwinds the answers to count them, and sorts by the number of answers.
// It limits the results to the top 5 questions and fetches doctor details for each answer.
// If successful, it returns the popular questions along with their answers and doctor details. 
export const getPopularQuestions = async (req, res, next) => {
  try {
    const thirtyDaysAgo = moment().subtract(30, "days").toDate(); // Get date 30 days ago

    const popularQuestions = await Question.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }, // Filter questions from the last 30 days
        },
      },
      {
        $unwind: "$answers", // Unwind answers to count them
      },
      {
        $group: {
          _id: "$_id",
          questionText: { $first: "$questionText" },
          answersCount: { $sum: 1 }, // Count answers for the question
          answers: { $push: "$answers" }, // Push answers into an array
        },
      },
      {
        $sort: { answersCount: -1 }, // Sort by number of answers (most popular first)
      },
      {
        $limit: 5, // You can adjust the number here based on how many questions you want to show
      },
    ]);

    // Fetch doctor details for each answer
    const questionsWithDoctorDetails = await Promise.all(
      popularQuestions.map(async (question) => {
        const questionsWithDoctor = await Promise.all(
          question.answers.map(async (answer) => {
            const doctor = await Doctor.findById(answer.doctor); // Assuming Doctor is used here
            return {
              ...answer,
              doctorInfo: doctor,
            };
          })
        );
        return {
          ...question,
          answers: questionsWithDoctor,
        };
      })
    );

    res.status(200).json({
      success: true,
      questions: questionsWithDoctorDetails,
    });
  } catch (err) {
    console.error(" Error fetching popular questions:", err);
    next(errorHandler(500, "Failed to fetch popular questions."));
  }
}

// Get most active doctors in the last 30 days
// This function retrieves the most active doctors based on the number of answers they provided in the last 30 days.
// It aggregates answers, counts them per doctor, sorts by the number of answers, and limits the results to the top 5 doctors.
// It also fetches doctor details such as name, profile picture, specialty, and city.
// If successful, it returns the most active doctors along with their details
// If an error occurs, it calls the next middleware with an error handler.
export const getMostActiveDoctors = async (req, res, next) => {
  try {
    const thirtyDaysAgo = moment().subtract(30, "days").toDate(); // Date 30 days ago

    const activeDoctors = await Question.aggregate([
      {
        $unwind: "$answers", // Unwind the answers array
      },
      {
        $match: {
          "answers.createdAt": { $gte: thirtyDaysAgo }, // Filter answers from the last 30 days
        },
      },
      {
        $group: {
          _id: "$answers.doctor", // Group by doctor
          answersCount: { $sum: 1 }, // Count the number of answers for each doctor
        },
      },
      {
        $sort: { answersCount: -1 }, // Sort by the number of answers in descending order
      },
      {
        $limit: 5, // Show the top 5 most active doctors (you can adjust this)
      },
      {
        $lookup: {
          from: "doctorforms", // Assuming the doctor model is "doctorforms"
          localField: "_id",
          foreignField: "_id",
          as: "doctorDetails",
        },
      },
      {
        $unwind: "$doctorDetails", // Unwind to get a single doctor object
      },
      {
        $project: {
          doctorId: "$_id",
          answersCount: 1,
          doctorName: {
            $concat: ["$doctorDetails.firstName", " ", "$doctorDetails.lastName"],
          },
          profilePicture: "$doctorDetails.profilePicture",
          specialty: "$doctorDetails.medicalSpecialtyCategory",
          city: "$doctorDetails.city",
        },
        // city: "$doctorDetails.city",
      },
    ]);

    res.status(200).json({
      success: true,
      activeDoctors,
    });
  } catch (err) {
    console.error("Error in getMostActiveDoctors:", err);
    next(errorHandler(500, "Failed to fetch most active doctors."))
  }
}

  
  
  
  
  