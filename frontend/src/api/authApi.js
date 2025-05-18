import axios from "axios";

export const signup = async (name, email, password, role) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/signup", {
      name,
      email,
      password,
      confirmPassword: password,
      role,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      return { success: true, message: "Signup successful!" };
    }
  } catch (error) {
    console.error("Error signing up:", error.response?.data?.message || error.message);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);

      // Fetch user details after login
      const userDetails = await getUserDetails(response.data.token);

      return {
        success: true,
        token: response.data.token,
        role: userDetails?.role,
        message: "Login successful!",
      };
    }
  } catch (error) {
    console.error("Error logging in:", error.response?.data?.message || error.message);
    throw error;
  }
};



export const getUserDetails = async (token) => {
  try {
    const response = await axios.get("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetched User Details:", response.data);
    return response.data; // Should contain name, email, and role
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return null;
  }
};
