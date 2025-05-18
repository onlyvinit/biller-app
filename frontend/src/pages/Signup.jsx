import { useState } from "react";
import { signup } from "../api/authApi"; // Import the signup function
import { useNavigate } from "react-router-dom";
import "../assets/signup.css"; // Import the CSS file

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Biller"); // Default role
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password, role); 
      alert("Signup successful! Redirecting to login...");
      navigate("/"); // Redirect to login page
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">Signup</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" />
          </div>
          <div className="input-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" />
          </div>
          <div className="input-group">
            <label>Confirm Password:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input-field" />
          </div>
          <div className="input-group">
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
              <option value="Biller">Biller</option>
              <option value="Owner">Owner</option>
            </select>
          </div>
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
