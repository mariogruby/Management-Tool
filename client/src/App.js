import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/auth.js";
import AppLayout from "./components/AppLayout";
import Task from "./components/Task";
import Signup from './auth/Signup';
import Login from "./auth/Login";
import LayoutMessage from "./components/Welcome.jsx";
import AuthLayout from "./auth/AuthLayout.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  console.log('render app..')
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  return (
    <AppLayout>
      <Toaster
        position="top-right"
        gutter={8}
      />
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <AuthLayout><Login /></AuthLayout>} />

        <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <AuthLayout><Signup /></AuthLayout>} />

        <Route path="/:projectId" element={isLoggedIn ? <Task /> : <Navigate to="/login" />} />

        <Route path="/" element={isLoggedIn ? <LayoutMessage /> : <Navigate to="/login" />} />
      </Routes>
    </AppLayout>
  );
}

export default App;

