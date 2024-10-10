import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid2,
  Snackbar,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, useParams } from "react-router-dom";
import { DASHBOARD } from "../Contants";

const EditQuiz = () => {
  let token = localStorage.getItem("key2");
  const { id } = useParams(); // Get the id from route params
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    vertical: "",
    horizontal: "",
    message: "",
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const navigate = useNavigate(); // Use navigate for redirect
  const [errors, setErrors] = useState({});

  const { vertical, horizontal, open, message } = snackbarState;

  useEffect(() => {
    // Fetch the quiz details by ID to populate the form
    axios
      .get(`http://localhost:8080/quiz/${id}`, {
        headers: { "rx-a": token },
      })
      .then((res) => {
        const { title, description, questions } = res.data.data;
        console.log(JSON.stringify(res.data.data));
        setTitle(title);
        setDescription(description);
        setQuestions(questions);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleSnackbarOpen = (newState) => {
    setSnackbarState({ ...newState, open: true });
  };

  const handleSnackbarClose = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";

    if (questions.length < 5) {
      newErrors.questions = "At least 5 questions are required";
    } else {
      questions.forEach((q, index) => {
        if (!q.questionText) {
          newErrors[`question_${index}`] = `Question ${index + 1} is required`;
        }

        const filledOptions = q.options.filter((opt) => opt.trim() !== "");
        if (filledOptions.length < 4) {
          newErrors[
            `options_${index}`
          ] = `Each question must have at least 4 options`;
        }

        if (!q.correctAnswer) {
          newErrors[
            `correctAnswer_${index}`
          ] = `Please select the correct answer for question ${index + 1}`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const quizData = {
        title,
        description,
        questions,
      };

      axios
        .patch(`http://localhost:8080/quiz/${id}`, quizData, {
          headers: { "rx-a": token },
        })
        .then((res) => {
          console.log(res.data);
          handleSnackbarOpen({
            vertical: "top",
            horizontal: "center",
            message: res.data.message,
          });
        })
        .catch((error) => {
          handleSnackbarOpen({
            vertical: "top",
            horizontal: "center",
            message: "server error",
          });
        });
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 1000,
          margin: "auto",
          padding: 3,
          border: "1px solid #ddd",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Edit Quiz
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <TextField
                fullWidth
                label="Quiz Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={Boolean(errors.title)}
                helperText={errors.title}
                disabled
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 8 }}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={Boolean(errors.description)}
                helperText={errors.description}
                disabled
              />
            </Grid2>

            {questions.map((question, qIndex) => (
              <Grid2 container spacing={2} key={qIndex}>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={`Question ${qIndex + 1}`}
                    variant="outlined"
                    value={question.questionText}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, e.target.value)
                    }
                    error={Boolean(errors[`question_${qIndex}`])}
                    helperText={errors[`question_${qIndex}`]}
                  />
                </Grid2>

                {question.options.map((option, optIndex) => (
                  <Grid2 size={{ xs: 6 }} key={optIndex}>
                    <TextField
                      fullWidth
                      label={`Option ${optIndex + 1}`}
                      variant="outlined"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(qIndex, optIndex, e.target.value)
                      }
                    />
                  </Grid2>
                ))}

                {errors[`options_${qIndex}`] && (
                  <Grid2 xs={12}>
                    <FormHelperText error>
                      {errors[`options_${qIndex}`]}
                    </FormHelperText>
                  </Grid2>
                )}

                <Grid2 size={{ xs: 6 }}>
                  <FormControl
                    fullWidth
                    error={Boolean(errors[`correctAnswer_${qIndex}`])}
                  >
                    <InputLabel id="demo-simple-select-helper-label">
                      Correct Answer
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleCorrectAnswerChange(qIndex, e.target.value)
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {question.options.map((opt, idx) => (
                        <MenuItem key={idx} value={opt}>
                          {`Option ${idx + 1}: ${opt}`}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors[`correctAnswer_${qIndex}`]}
                    </FormHelperText>
                  </FormControl>
                </Grid2>
              </Grid2>
            ))}

            {errors.questions && (
              <Grid2 xs={12}>
                <FormHelperText error>{errors.questions}</FormHelperText>
              </Grid2>
            )}

            <Grid2 xs={12}>
              <IconButton onClick={addQuestion} color="primary">
                <AddCircleOutlineIcon />
              </IconButton>
              <Typography variant="body1">Add Question</Typography>
            </Grid2>

            <Grid2 xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Submit Quiz
              </Button>{" "}
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={() => {
                  navigate(`${DASHBOARD}`);
                }}
              >
                Back
              </Button>
            </Grid2>
          </Grid2>
        </form>
      </Box>{" "}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={message}
        key={vertical + horizontal}
      />
    </>
  );
};

export default EditQuiz;
