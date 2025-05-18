import React, { useEffect, useState } from "react";

const FoodForm = ({ editingFood, setEditingFood, categories }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(""); // Dropdown selection
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // Fill form when editing
  useEffect(() => {
    if (editingFood) {
      setName(editingFood.name);
      setCategory(editingFood.category?._id || editingFood.category || ""); // Ensure category is correctly set
      setPrice(editingFood.price);
      setDescription(editingFood.description);
    } else {
      setName("");
      setCategory("");
      setPrice("");
      setDescription("");
    }
  }, [editingFood]);

  const token = localStorage.getItem("token"); // Get auth token

  // ✅ POST (Add New Food)
  const addFood = async () => {
    const foodData = {
      name,
      category,
      price: parseFloat(price), // Ensure price is stored as a number
      description,
    };

    try {
      const response = await fetch("http://localhost:5000/api/food/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(foodData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add food item");
      }

      alert("Food item added!");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // ✅ PUT (Update Existing Food)
  const updateFood = async () => {
    const foodData = {
      name,
      category,
      price: parseFloat(price), // Ensure price is stored as a number
      description,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/food/${editingFood._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(foodData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update food item");
      }

      alert("Food item updated!");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // ✅ Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    editingFood ? updateFood() : addFood();
  };

  return (
    <>
      <h3>{editingFood ? "Edit Food Item" : "Add Food Item"}</h3>
      <div className="food-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Food Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* ✅ Category Selection Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">{editingFood ? "Update" : "Add"}</button>

          {/* ✅ Cancel Editing Button */}
          {editingFood && (
            <button type="button" onClick={() => setEditingFood(null)}>
              Cancel
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default FoodForm;
