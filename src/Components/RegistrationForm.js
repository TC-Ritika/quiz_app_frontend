import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid2,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../Contants";

const RegistrationForm = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
  });

  const navigate = useNavigate(); // Use navigate for redirect

  const handleSnackbarOpen = (message) => {
    setSnackbarState({ open: true, message });
  };

  const handleSnackbarClose = () => {
    setSnackbarState({ open: false, message: "" });
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!userName) newErrors.userName = "User Name is required";
    if (!userEmail) {
      newErrors.userEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      newErrors.userEmail = "Email is invalid";
    }
    if (!userPassword) {
      newErrors.userPassword = "Password is required";
    } else if (userPassword.length < 6) {
      newErrors.userPassword = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    console.log("handle submit is called");
    e.preventDefault();
    if (validateForm()) {
      const registrationData = {
        userName,
        userEmail,
        userPassword,
      };
      // API request would go here.
      console.log("Registration data:", registrationData);
      axios
        .post(`http://localhost:8080/adminusers/add`, registrationData)
        .then((res) => {
          console.log(res.data);
          handleSnackbarOpen("Registration successful!");
          // After 2 seconds, redirect to Login page
          setTimeout(() => {
            navigate(`${LOGIN}`); // Redirect to login page
          }, 2000); // Redirect after 2 seconds

          // Reset the form
          setUserName("");
          setUserEmail("");
          setUserPassword("");
          console.log("then is completed");
        })
        .catch((error) => {
          console.log(error);
          handleSnackbarOpen("Server error");
        });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        marginTop: "50px",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Registration Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={3}>
          <Grid2 item size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="User Name"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              error={Boolean(errors.userName)}
              helperText={errors.userName}
            />
          </Grid2>

          <Grid2 item size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              error={Boolean(errors.userEmail)}
              helperText={errors.userEmail}
            />
          </Grid2>

          <Grid2 item size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              error={Boolean(errors.userPassword)}
              helperText={errors.userPassword}
            />
          </Grid2>

          <Grid2 item size={{ xs: 3 }}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Register
            </Button>
          </Grid2>
        </Grid2>
      </form>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarState.message}
      />
    </Box>
  );
};

export default RegistrationForm;
