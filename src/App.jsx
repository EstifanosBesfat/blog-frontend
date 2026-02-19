import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import FeedPage from "./pages/FeedPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from "react-hot-toast";
import { clearAuthSession, getAuthToken, getCurrentUser } from "./services/auth";

function App() {
  const [token, setToken] = useState(getAuthToken());
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // Helper to handle login state update
  const handleLoginSuccess = (session) => {
    setToken(session?.token || null);
    setCurrentUser(getCurrentUser());
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handleLogout = () => {
    clearAuthSession();
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar
        isLoggedIn={!!token}
        onLogout={handleLogout}
        currentUser={currentUser}
        onUserUpdated={handleUserUpdate}
      />

      <Routes>
        <Route path="/" element={<FeedPage isLoggedIn={!!token} />} />

        {/* If already logged in, redirect Login/Register to Home */}
        <Route
          path="/login"
          element={
            !token ? (
              <LoginPage onLogin={handleLoginSuccess} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/register"
          element={!token ? <RegisterPage /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
