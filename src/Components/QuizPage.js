import React, { useState, useEffect } from "react";
import {
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

const QuizPage = ({ selectedQuizId, setOpenQuizModal }) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizEndTime, setQuizEndTime] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [timeTaken, setTimeTaken] = useState("");

  // Fetch quiz questions from backend based on selected quiz
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/quiz/${selectedQuizId}`
        );
        setQuestions(response.data.data.questions);
        setQuizStartTime(new Date()); // Start timer when quiz begins
      } catch (error) {
        console.error("Error fetching quiz", error);
      }
    };

    if (selectedQuizId) {
      fetchQuizQuestions();
    }
  }, [selectedQuizId]);

  // Handle user's answer selection
  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer });
  };

  // Handle quiz submission and calculate score
  const handleSubmitQuiz = () => {
    const correctAnswers = questions.map((q) => q.correctAnswer);
    let correctCount = 0;

    questions.forEach((question, index) => {
      if (userAnswers[question._id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const quizEndTime = new Date();
    const timeTaken = Math.round((quizEndTime - quizStartTime) / 1000); // Time taken in seconds
    const calculatedScore = correctCount;
    const calculatedPercentage = (correctCount / questions.length) * 100;

    setScore(calculatedScore);
    setPercentage(calculatedPercentage);
    setTimeTaken(timeTaken);
    setQuizEndTime(quizEndTime);
    setIsReportOpen(true); // Open report modal
  };

  // Close the report modal
  const handleCloseReport = () => {
    setIsReportOpen(false);
    setOpenQuizModal(false);
  };

  // Navigate to next/previous question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div>
      {questions.length > 0 && (
        <div>
          <h3>{`Question ${currentQuestionIndex + 1} of ${
            questions.length
          }`}</h3>
          <h4>{questions[currentQuestionIndex].questionText}</h4>
          <RadioGroup
            value={userAnswers[questions[currentQuestionIndex]._id] || ""}
            onChange={(e) =>
              handleAnswerChange(
                questions[currentQuestionIndex]._id,
                e.target.value
              )
            }
          >
            {questions[currentQuestionIndex].options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="contained"
            style={{ marginRight: "8px" }}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            variant="contained"
            style={{ marginRight: "8px" }}
          >
            Next
          </Button>
          {currentQuestionIndex === questions.length - 1 && (
            <Button
              onClick={handleSubmitQuiz}
              variant="contained"
              color="primary"
              //   style={{ marginTop: "16px" }}
            >
              Submit Quiz
            </Button>
          )}
        </div>
      )}

      {/* Report Modal */}
      <Dialog
        open={isReportOpen}
        onClose={handleCloseReport}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Quiz Report</DialogTitle>
        <DialogContent>
          <h4>
            Score: {score}/{questions.length}
          </h4>
          <h4>Percentage: {percentage.toFixed(2)}%</h4>
          <h4>Time Taken: {timeTaken} seconds</h4>
          <ul>
            {questions.map((question, index) => (
              <li key={question._id}>
                <strong>
                  Q{index + 1}: {question.questionText}
                </strong>
                <p>Your answer: {userAnswers[question._id] || "No answer"}</p>
                <p>Correct answer: {question.correctAnswer}</p>
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReport} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuizPage;
