import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Backdrop,
  Fade,
  Pagination,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import { ADD_QUIZ, EDIT_QUIZ, LOGIN, SECRET_KEY } from "../Contants";
const CryptoJS = require("crypto-js");

const quizData = [
  {
    title: "JavaScript Basics",
    description: "A quiz to test your basic JavaScript knowledge.",
    questions: [
      {
        questionText:
          "What is the correct way to declare a variable in JavaScript?",
        options: ["var", "const", "let", "define"],
        correctAnswer: "let",
      },
      {
        questionText:
          "Which of the following is not a primitive data type in JavaScript?",
        options: ["String", "Boolean", "Object", "Number"],
        correctAnswer: "Object",
      },
    ],
  },
  {
    title: "HTML Basics",
    description: "A quiz to test your knowledge of HTML.",
    questions: [
      {
        questionText: "Which HTML element is used for the largest heading?",
        options: ["<h1>", "<heading>", "<head>", "<h6>"],
        correctAnswer: "<h1>",
      },
      {
        questionText: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language",
          "Hyper Tool Markup Language",
        ],
        correctAnswer: "Hyper Text Markup Language",
      },
    ],
  },
  {
    title: "CSS Fundamentals",
    description: "A quiz to test your understanding of CSS.",
    questions: [
      {
        questionText: "What does CSS stand for?",
        options: [
          "Cascading Style Sheets",
          "Computer Style Sheets",
          "Creative Style Sheets",
          "Cascading Sheet Styles",
        ],
        correctAnswer: "Cascading Style Sheets",
      },
      {
        questionText: "Which property is used to change the background color?",
        options: ["color", "background-color", "bgcolor", "background"],
        correctAnswer: "background-color",
      },
    ],
  },
];

function Dashboard() {
  let token = localStorage.getItem("key2");
  const userEncryptedData = localStorage.getItem("key1");
  const bytes = CryptoJS.AES.decrypt(userEncryptedData, SECRET_KEY);
  const userDecryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizListFromDB, setQuizListFromDB] = useState([]);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    vertical: "",
    horizontal: "",
    message: "",
  });
  const { vertical, horizontal, open, message } = snackbarState;

  const handleSnackbarOpen = (newState) => {
    setSnackbarState({ ...newState, open: true });
  };

  const handleSnackbarClose = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    localStorage.clear();
    navigate(`${LOGIN}`);
  };

  const handleLogout = () => {
    handleMenuClose();
  };

  const handleEdit = (id) => {
    console.log("Edit quiz:", id);
    navigate(`${EDIT_QUIZ}/${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete quiz:", id);
    axios
      .delete(`http://localhost:8080/quiz/${id}`, {
        headers: {
          "rx-a": token,
        },
      })
      .then((res) => {
        handleSnackbarOpen({
          vertical: "top",
          horizontal: "center",
          message: res.data.message,
        });
        getQuizListFromDB();
      })
      .catch((error) => {
        console.log(error.response.data.message);
        handleSnackbarOpen({
          vertical: "top",
          horizontal: "center",
          message: error.response.data.message,
        });
      });
  };

  const handleAddQuiz = () => {
    console.log("Add quiz clicked");
    navigate(`${ADD_QUIZ}`);
  };

  const handleViewQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  const handleQuestionChange = (event, value) => {
    setCurrentQuestion(value - 1);
  };
  const getQuizListFromDB = () => {
    console.log("this is method is called");
    axios
      .get(`http://localhost:8080/quiz`)
      .then((res) => {
        setQuizListFromDB(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    console.log("this is called on dashboard load");
    getQuizListFromDB();
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Quiz Admin Panel
          </Typography>
          <Typography variant="body1">{userDecryptedData.userName}</Typography>
          <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
            <Avatar>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Add Quiz Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", margin: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAddQuiz}>
          Add Quiz
        </Button>
      </Box>

      {/* Quiz Table */}
      <TableContainer
        component={Paper}
        sx={{ margin: "50px auto", width: "80%" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizListFromDB.map((quiz, index) => (
              <TableRow key={index}>
                <TableCell>{quiz.title}</TableCell>
                <TableCell>{quiz.description}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleViewQuiz(quiz)}
                    >
                      View
                    </Button>
                    {userDecryptedData.isSupremeUser ? (
                      <>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleEdit(quiz._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(quiz._id)}
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      ""
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Viewing Quiz */}
      <Modal open={isModalOpen} onClose={handleCloseModal} closeAfterTransition>
        <Fade in={isModalOpen}>
          {/* <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh" // Full viewport height for centering vertically
          > */}
          <Box
            sx={{
              backgroundColor: "background.paper",
              border: "2px solid #000",
              boxShadow: 5,
              padding: 4,
              width: "60%",
              maxHeight: "80%",
              overflow: "auto",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {selectedQuiz && (
              <>
                <Typography variant="h4">{selectedQuiz.title}</Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedQuiz.description}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Question {currentQuestion + 1} of{" "}
                  {selectedQuiz.questions.length}
                </Typography>
                <Typography variant="body1">
                  {selectedQuiz.questions[currentQuestion].questionText}
                </Typography>
                <ul>
                  {selectedQuiz.questions[currentQuestion].options.map(
                    (option, i) => (
                      <li key={i}>
                        {option}{" "}
                        {option ===
                        selectedQuiz.questions[currentQuestion].correctAnswer
                          ? "✅"
                          : ""}
                      </li>
                    )
                  )}
                </ul>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Pagination
                    count={selectedQuiz.questions.length}
                    page={currentQuestion + 1}
                    onChange={handleQuestionChange}
                    color="primary"
                  />
                </Box>
              </>
            )}
          </Box>
          {/* </Box> */}
        </Fade>
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={message}
        key={vertical + horizontal}
      />
    </div>
  );
}

export default Dashboard;
