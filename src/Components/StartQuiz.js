import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import QuizPage from "./QuizPage"; // Import the QuizPage

const StartQuiz = () => {
  const [username, setUsername] = useState("");
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [openQuizModal, setOpenQuizModal] = useState(false);

  // Fetch quizzes from the backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/quiz`);
        setQuizList(response.data.data);
      } catch (error) {
        console.error("Error fetching quizzes", error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = () => {
    if (username && selectedQuiz) {
      setOpenQuizModal(true);
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleCloseQuizModal = () => {
    setOpenQuizModal(false);
  };

  return (
    <Container>
      <h2>Start a Quiz</h2>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Select a Quiz</InputLabel>
        <Select
          value={selectedQuiz}
          onChange={(e) => {
            console.log(e.target.value);
            setSelectedQuiz(e.target.value);
          }}
          fullWidth
        >
          {quizList.map((quiz) => (
            <MenuItem key={quiz._id} value={quiz._id}>
              {quiz.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleStartQuiz}
        fullWidth
        style={{ marginTop: "16px" }}
      >
        Start Quiz
      </Button>

      {/* Quiz Modal */}
      <Dialog
        open={openQuizModal}
        onClose={handleCloseQuizModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Quiz</DialogTitle>
        <DialogContent>
          <QuizPage
            selectedQuizId={selectedQuiz}
            setOpenQuizModal={setOpenQuizModal}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQuizModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StartQuiz;
