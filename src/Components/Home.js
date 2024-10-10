import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import { LOGIN, START_QUIZ } from "../Contants";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the Quiz App
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            navigate(`${START_QUIZ}`);
          }}
        >
          Start Quiz
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            navigate(`${LOGIN}`);
          }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
