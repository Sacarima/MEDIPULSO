import Question from '../models/question.model.js';
import DoctorForm from '../models/doctorForm.model.js';

export const getStats = async (req, res, next) => {
    try {
      // 1. Count the total number of questions asked
      const questionCount = await Question.countDocuments();
  
      // 2. Count the total number of answers provided by doctors
      const answerCount = await Question.aggregate([
        { $unwind: "$answers" },
        { $group: { _id: null, totalAnswers: { $sum: 1 } } },
      ]);
  
      // 3. Count the total number of active doctors
      const doctorCount = await DoctorForm.countDocuments({ role: 'doctor' })
  
      // Send the stats response
      res.status(200).json({
        success: true,
        stats: {
          questionsAsked: questionCount,
          answersProvided: answerCount[0]?.totalAnswers || 0, // Aggregate result
          doctorsSpecialists: doctorCount,
        },
      });
    } catch (err) {
      console.error(" Error fetching stats:", err);
      next(errorHandler(500, "Failed to fetch statistics."));
    }
  };

