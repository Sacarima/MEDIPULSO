import mongoose from "mongoose"


const answerSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorForm",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } 
);

const questionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    answers: [answerSchema], // embedded answers
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema)