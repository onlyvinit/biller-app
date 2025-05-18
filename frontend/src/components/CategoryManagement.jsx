import { useState, useEffect } from "react";
import { createCategory, updateCategory, deleteCategory, getCategories } from "../api/categoryApi";
import "../assets/category.css";

function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editName, setEditName] = useState("");
    const token = localStorage.getItem("token");

    // Fetch categories on component mount
    const fetchCategories = async () => {
        try {
            const data = await getCategories(token);
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    // Add new category
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        try {
            await createCategory(newCategory, token);
            setNewCategory("");
            fetchCategories(); // Re-fetch categories after adding
        } catch (error) {
            console.error("Error creating category:", error);
            alert("Error creating category!");
        }
    };

    // Enable editing mode for a specific category
    const handleEditClick = (id, currentName) => {
        setEditingCategoryId(id);
        setEditName(currentName);
    };

    // Save edited category
    const handleEditSave = async (id) => {
        if (!editName.trim()) return;

        try {
            await updateCategory(id, editName, token);
            fetchCategories(); // Re-fetch categories after updating
            setEditingCategoryId(null);
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Error updating category!");
        }
    };

    // Delete category
    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await deleteCategory(id, token);
            fetchCategories(); // Re-fetch categories after deleting
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Error deleting category!");
        }
    };

    return (
        <div className="category-container">
            <h2 id="category-header">Manage Categories</h2>

            {/* Add New Category */}
            <form onSubmit={handleAddCategory} className="category-form">
                <input
                    type="text"
                    placeholder="Enter category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                    className="category-input"
                />
                <button type="submit" className="category-add-btn">Add</button>
            </form>

            {/* Category List */}
            <ul className="category-list">
                {categories.map((category) => (
                    <li key={category._id} className="category-item">
                        {editingCategoryId === category._id ? (
                            <>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="category-edit-input"
                                />
                                <div className="button-group">
                                <button onClick={() => handleEditSave(category._id)} className="save-btn">Save</button>
                                <button onClick={() => setEditingCategoryId(null)} className="cancel-btn">Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="category-name">{category.name}</span>
                                <button onClick={() => handleEditClick(category._id, category.name)} className="edit-btn">Edit</button>
                                <button onClick={() => handleDeleteCategory(category._id)} className="delete-btn">Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryManagement;
