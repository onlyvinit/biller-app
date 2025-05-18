import axios from "axios";

// Helper function to get the authorization headers
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found! Please log in.");
    }
    return { Authorization: `Bearer ${token}` };
};

// Fetch all billers
export const getBillers = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/billers", {
            headers: getAuthHeaders(),
        });

        return response.data; // Returns the list of billers
    } catch (error) {
        console.error("Error fetching billers:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch billers.");
    }
};

// Delete a biller
export const deleteBiller = async (billerId) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/billers/${billerId}`, {
            headers: getAuthHeaders(),
        });

        return response.data; // Success message
    } catch (error) {
        console.error("Error deleting biller:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete biller.");
    }
};

export const updateBiller = async (billerId, updatedData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found! Please log in.");

        const response = await axios.put(
            `http://localhost:5000/api/billers/${billerId}`,
            updatedData,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return response.data; // Updated biller data
    } catch (error) {
        console.error("Error updating biller:", error.response?.data || error);
        throw error;
    }
};

