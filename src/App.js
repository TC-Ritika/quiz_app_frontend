import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ADD_QUIZ,
  DASHBOARD,
  EDIT_QUIZ,
  HOME_PAGE,
  LOGIN,
  REGISTRATION_FORM,
  START_QUIZ,
} from "./Contants";
import Login from "./Components/Login";
import Home from "./Components/Home";
import NotFound from "./Components/NotFound";
import Dashboard from "./Components/Dashboard";
import AddQuiz from "./Components/AddQuiz";
import StartQuiz from "./Components/StartQuiz";
import EditQuiz from "./Components/EditQuiz";
import RegistrationForm from "./Components/RegistrationForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME_PAGE} element={<Home />} />
        <Route path={LOGIN} element={<Login />} />
        <Route path={DASHBOARD} element={<Dashboard />} />
        <Route path={ADD_QUIZ} element={<AddQuiz />} />
        <Route path={START_QUIZ} element={<StartQuiz />} />
        <Route path={`${EDIT_QUIZ}/:id`} element={<EditQuiz />} />
        <Route path={REGISTRATION_FORM} element={<RegistrationForm />} />
        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
