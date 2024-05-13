import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/auth.js";
import AppLayout from "./components/layouts/AppLayout.jsx";
import Task from "./components/tasks/Task";
import Signup from './auth/Signup';
import UpdateUser from './auth/Update.jsx';
import Login from "./auth/Login";
import LayoutMessage from "./components/layouts/LayoutMessage.jsx";
import AuthLayout from "./auth/AuthLayout.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <AppLayout>
      <Toaster
        position="top-right"
        gutter={8}
      />
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ?
            <Navigate to="/" />
            :
            <AuthLayout><Login /></AuthLayout>}
        />

        <Route
          path="/signup"
          element={isLoggedIn ?
            <Navigate to="/" />
            :
            <AuthLayout><Signup /></AuthLayout>}
        />

        <Route
          path="/update"
          element={isLoggedIn ?
            <AuthLayout><UpdateUser /></AuthLayout>
            :
            <Navigate to="/login" />}
        />

        <Route
          path="/:projectId"
          element={isLoggedIn ?
            <Task />
            :
            <Navigate to="/login" />}
        />

        <Route
          path="/"
          element={isLoggedIn ?
            <LayoutMessage />
            :
            <Navigate to="/login" />}
        />
      </Routes>
    </AppLayout>
  );
};

export default App;