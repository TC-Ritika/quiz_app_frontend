import React, { useState, useEffect } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import { Navigate, useNavigate } from "react-router-dom"; // For redirecting after login

import {
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Grid2,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Dashboard from "./Dashboard";
import { DASHBOARD, REGISTRATION_FORM, SECRET_KEY } from "../Contants";
const CryptoJS = require("crypto-js");
const { isEmpty } = require("lodash");

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "400px",
    margin: 20,
    width: "450px",
    paddingRight: 10,
  },
}));

const initialState = {
  userEmail: "",
  userPassword: "",
};

const validationStatus = {
  userEmail: true,
  userPassword: true,
};

function Login(props) {
  const classes = useStyles();
  const [formData, setFormData] = useState(initialState);
  const [showValidation, setShowValidation] = useState(false);
  const navigate = useNavigate(); // Use navigate for redirect
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

  const isDataValid = () => {
    var isValid = true;
    if (validationStatus.userEmail) isValid = false;
    if (validationStatus.userPassword) isValid = false;
    if (!isValid) {
      setShowValidation(true);
    }
    return isValid;
  };
  const handleUserEmailChange = (e) => {
    setFormData({
      ...formData,
      userEmail: e.target.value.trim(),
    });
    validationStatus.userEmail = isEmpty(e.target.value.trim());
  };
  const handlePasswordChange = (e) => {
    setFormData({
      ...formData,
      userPassword: e.target.value.trim(),
    });
    validationStatus.userPassword = isEmpty(e.target.value.trim());
  };
  const handleLogin = (e) => {
    if (isDataValid()) {
      axios
        .post(`http://localhost:8080/adminusers/login`, {
          userEmail: formData.userEmail,
          userPassword: formData.userPassword,
        })
        .then((res) => {
          console.log(res.data);
          // Encrypt
          const ciphertext = CryptoJS.AES.encrypt(
            JSON.stringify(res.data.data),
            SECRET_KEY
          ).toString();
          localStorage.setItem("key1", ciphertext);
          localStorage.setItem("key2", res.headers["rx-a"]);

          // Redirect to dashboard after successful login
          navigate(`${DASHBOARD}`);
        })
        .catch((error) => {
          console.log(error);
          // Show the snackbar for invalid credentials
          handleSnackbarOpen({
            vertical: "top",
            horizontal: "center",
            message: "Invalid Credentials",
          });
        });
    }
  };
  const displayLoginUI = () => {
    return (
      <Grid2
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{
          display: "flex",
          minHeight: "100vh", // Take the full height of the viewport
          backgroundColor: "#F5F5F5",
        }}
      >
        <Card className={classes.root}>
          <CardHeader title="Admin Login" style={{ textAlign: "center" }} />
          <CardContent style={{ paddingTop: "0" }}>
            <Grid2
              container
              direction="column"
              justify="center"
              alignItems="center"
              style={{ margin: "0 20px", width: "auto" }}
            >
              <TextField
                required
                id="user_email"
                label="Email"
                type="email"
                fullWidth
                style={{ margin: "10px" }}
                value={formData.userEmail}
                onChange={handleUserEmailChange}
                error={
                  showValidation ? isEmpty(formData.userEmail.trim()) : false
                }
              />
              <TextField
                required
                id="user_password"
                label="Password"
                type="password"
                fullWidth
                style={{ margin: "10px" }}
                value={formData.userPassword}
                onChange={handlePasswordChange}
                error={
                  showValidation ? isEmpty(formData.userPassword.trim()) : false
                }
              />
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
                onClick={() => {
                  navigate(`${REGISTRATION_FORM}`);
                }}
              >
                Register
              </Button>
            </Grid2>
          </CardContent>
        </Card>
      </Grid2>
    );
  };
  const isAuthenticated = () => {
    var token = localStorage.getItem("key1");
    if (isEmpty(token)) return false;
    return true;
  };

  return (
    <div>
      {isAuthenticated() ? <Dashboard /> : displayLoginUI()}{" "}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        message={message}
        key={vertical + horizontal}
      />
      ;
    </div>
  );
}

export default Login;
