import axios from "axios";

const BASE_URL = "http://localhost:5000/api/food"; // ✅ Correct Backend URL

export const getFoodItems = async (category) => {
  try {
    const token = localStorage.getItem("token"); // ✅ Include token if needed
    const response = await axios.get(`${BASE_URL}?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching food items:", error);
    throw error;
  }
};

export const addFoodItem = async (foodData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(BASE_URL, foodData, {
      headers: {
        "Content-Type": "application/json", // ✅ Fixed missing Content-Type
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding food item:", error);
    throw error;
  }
};

export const updateFoodItem = async (id, foodData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${BASE_URL}/${id}`, foodData, {
      headers: {
        "Content-Type": "application/json", // ✅ Fixed missing Content-Type
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating food item:", error);
    throw error;
  }
};

export const deleteFoodItem = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting food item:", error);
    throw error;
  }
};
