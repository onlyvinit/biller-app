import { Link } from "react-router-dom";
import "../assets/navbar.css";

function Navbar({ isDarkMode, setIsDarkMode }) {
    const token = localStorage.getItem("token");

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <>

            <nav className={`navbar ${isDarkMode ? "dark-mode" : ""}`}>
                <div className="nav-left">
                    <Link to="/owner-dashboard" className="logo">Billing App</Link>
                </div>
                
                <div className="nav-right">
                    <button onClick={toggleTheme} className="theme-toggle">
                        {isDarkMode ? "🌙" : "☀️"}
                    </button>

                    {token ? (
                        <div className="user-profile">
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </div>
                    ) : (
                        <div className="auth-links">
                            <Link to="/">Login</Link>
                            <Link to="/signup">Signup </Link>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;
