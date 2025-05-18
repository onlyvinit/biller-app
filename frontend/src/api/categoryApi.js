import axios from "axios";

// Fetch all categories
export const getCategories = async (token) => {
    try {
        const res = await axios.get("http://localhost:5000/api/categories", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};


// Create a new category
export const createCategory = async (name, token) => {
    try {
        const res = await axios.post("http://localhost:5000/api/categories", { name }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating category:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Update an existing category
export const updateCategory = async (id, name, token) => {
    try {
        const res = await axios.put(`http://localhost:5000/api/categories/${id}`, { name }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating category:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Delete a category
export const deleteCategory = async (id, token) => {
    try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("Error deleting category:", error.response?.data?.message || error.message);
        throw error;
    }
};
