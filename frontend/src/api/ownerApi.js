import axios from "axios";

export const getOwnerDetails = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found! Please log in.");
    }

    const response = await axios.get("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Contains name, email, and role
  } catch (error) {
    console.error("Error fetching owner details:", error.response?.data || error);
    return null;
  }
};
