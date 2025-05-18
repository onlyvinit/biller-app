import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/foodManagement.css";
import FoodForm from "./FoodForm";
import FoodList from "./FoodList"; // Import the FoodList component

const FoodManagement = () => {
    const [categories, setCategories] = useState([]); // State for categories
    const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category

    // Fetch categories
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("http://localhost:5000/api/categories", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    return (
        <div className="food-management">
            <FoodForm categories={categories} /> {/* Pass categories to FoodForm */}
            
            <div className="food-category-section">
                <div className="categories-section">
                    <h2>Categories</h2>
                    <ul>
                        {/* List of categories */}
                        {categories.map((category) => (
                            <li
                                key={category._id}
                                onClick={() => setSelectedCategory(category._id)} // Set selected category
                                className={selectedCategory === category._id ? "active" : ""}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="food-items-section">
                    <h2>Food Items</h2>
                    {selectedCategory ? (
                        <FoodList selectedCategory={selectedCategory} /> // Render FoodList when category is selected
                    ) : (
                        <p>Select a category to see food items.</p> // Show message if no category is selected
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodManagement;
