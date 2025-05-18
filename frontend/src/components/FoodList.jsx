import React, { useEffect, useState } from "react";
import axios from "axios";

const FoodList = ({ selectedCategory }) => {
    const [foodItems, setFoodItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [editItemId, setEditItemId] = useState(null);
    const [editedItem, setEditedItem] = useState({});
    const token = localStorage.getItem("token");

    // Fetch food items based on selected category
    useEffect(() => {
        if (!selectedCategory) return; // Prevent unnecessary API calls

        axios
            .get(`http://localhost:5000/api/food?category=${selectedCategory}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setFoodItems(res.data);
            })
            .catch((err) => console.error("Error fetching food items:", err));
    }, [selectedCategory, token]);

    // Handle checkbox change for selection
    const handleCheckboxChange = (id) => {
        setSelectedItems((prev) => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) newSelected.delete(id);
            else newSelected.add(id);
            return newSelected;
        });
    };

    // Handle edit mode
    const handleEditClick = (food) => {
        setEditItemId(food._id);
        setEditedItem({ name: food.name, price: food.price, description: food.description });
    };

    // Handle input changes during editing
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedItem((prev) => ({ ...prev, [name]: value }));
    };

    // Handle save
    const handleSaveClick = (id) => {
        axios
            .put(`http://localhost:5000/api/food/${id}`, editedItem, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setFoodItems((prev) =>
                    prev.map((item) => (item._id === id ? { ...item, ...editedItem } : item))
                );
                setEditItemId(null);
            })
            .catch((err) => console.error("Error updating food item:", err));
    };

    // Handle deletion of selected food items
    const handleDeleteSelected = () => {
        const deletePromises = Array.from(selectedItems).map((id) =>
            axios.delete(`http://localhost:5000/api/food/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
        );

        Promise.all(deletePromises)
            .then(() => {
                setFoodItems((prev) => prev.filter((item) => !selectedItems.has(item._id)));
                setSelectedItems(new Set());
            })
            .catch((err) => console.error("Error deleting food items:", err));
    };

    return (
        <div>
            <button
                className="delete-selected-btn"
                onClick={handleDeleteSelected}
                disabled={selectedItems.size === 0}
            >
                Delete Selected
            </button>

            <table className="food-items-table">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {foodItems.length > 0 ? (
                        foodItems.map((food) => (
                            <tr key={food._id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.has(food._id)}
                                        onChange={() => handleCheckboxChange(food._id)}
                                    />
                                </td>

                                {editItemId === food._id ? (
                                    <>
                                        <td>
                                            <input
                                                name="name"
                                                value={editedItem.name}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="price"
                                                type="number"
                                                value={editedItem.price}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="description"
                                                value={editedItem.description}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => handleSaveClick(food._id)}>
                                                Save
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{food.name}</td>
                                        <td>${food.price}</td>
                                        <td>{food.description}</td>
                                        <td>
                                            <button onClick={() => handleEditClick(food)}>
                                                Edit
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No food items found for this category.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FoodList;
