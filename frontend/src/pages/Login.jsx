import { useState } from "react";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import "../assets/login.css"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password);
      console.log("Login Response:", response); 

      if (response && response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);

        alert("Login successful!");

        // Ensure role is correctly stored
        console.log("Stored Role:", localStorage.getItem("role"));

        // Navigate based on role
        if (response.role === "Owner") {
          console.log("Navigating to Owner Dashboard...");
          navigate("/owner-dashboard");
        } else {
          console.log("Navigating to Categories...");
          navigate("/biller");
        }
      } else {
        setError(response?.message || "Invalid login attempt.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="error-message">{error}</p>} {/* Show error message */}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
  
      </form>
    </div>
  );
}

export default Login;
