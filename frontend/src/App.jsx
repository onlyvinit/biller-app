import { Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Added import for jwtDecode
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OwnerDashboard from "./pages/OwnerDashboard";
import BillerDashboard from "./pages/BillerDashboard";
import CategoryManagement from "./components/CategoryManagement";
import Navbar from "./components/Navbar";
import FoodManagement from "./components/FoodManagement";
import "./index.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#3e2723" }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  let userRole;

  if (token) {
    try {
      const decoded = jwtDecode(token); // Use imported jwtDecode
      userRole = decoded.role; // Assumes token has 'role' field
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  // Load dark mode state from localStorage
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  return (
    <ErrorBoundary>
      <div className={isDarkMode ? "dark-mode" : ""}>
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Routes>
          <Route path="/" element={<Login isDarkMode={isDarkMode} />} />
          <Route path="/signup" element={<Signup isDarkMode={isDarkMode} />} />
          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute requiredRole="Owner">
                <OwnerDashboard isDarkMode={isDarkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/biller"
            element={
              <ProtectedRoute requiredRole="Biller">
                <BillerDashboard isDarkMode={isDarkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category-management"
            element={
              <ProtectedRoute requiredRole="Owner">
                <CategoryManagement isDarkMode={isDarkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/food-management"
            element={
              <ProtectedRoute requiredRole="Owner">
                <FoodManagement isDarkMode={isDarkMode} />
              </ProtectedRoute>
            }
          />
          {/* Redirect old /categoryManage to new path */}
          <Route path="/categoryManage" element={<Navigate to="/category-management" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;