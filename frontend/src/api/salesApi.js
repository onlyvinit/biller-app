import axios from "axios";

export const addSale = async (saleData) => {
  try {
    // Validate saleData
    if (!saleData.foodItems || !Array.isArray(saleData.foodItems) || saleData.foodItems.length === 0) {
      console.error("Invalid saleData: foodItems must be a non-empty array", saleData);
      throw new Error("foodItems must be a non-empty array");
    }
    if (!saleData.totalAmount || typeof saleData.totalAmount !== "number") {
      console.error("Invalid saleData: totalAmount must be a number", saleData);
      throw new Error("totalAmount must be a number");
    }
    if (!saleData.biller) {
      console.error("Invalid saleData: biller is required", saleData);
      throw new Error("biller is required");
    }

    // Calculate expected total for validation
    const calculatedTotal = saleData.foodItems.reduce(
      (sum, item) => sum + (item.quantity * item.price),
      0
    );
    if (Math.abs(calculatedTotal - saleData.totalAmount) > 0.01) {
      console.error("Invalid saleData: totalAmount mismatch", {
        totalAmount: saleData.totalAmount,
        calculatedTotal,
      });
      throw new Error(`totalAmount (${saleData.totalAmount}) does not match calculated total (${calculatedTotal})`);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      throw new Error("Authentication token missing");
    }

    console.log("Sending Sale Data:", saleData);
    const response = await axios.post("http://localhost:5000/api/sales", saleData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("AddSale response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding sale:", {
      message: error.message,
      response: error.response?.data,
      saleData,
    });
    throw error;
  }
};

export const getSalesData = async (filter = "daily") => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      throw new Error("Authentication token missing");
    }

    console.log("Fetching sales data with filter:", filter);
    const response = await axios.get(`http://localhost:5000/api/sales?filter=${filter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Sales data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales data:", {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};