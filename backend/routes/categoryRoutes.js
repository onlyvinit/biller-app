import express from "express";
import { varifyToken, varifyownerRole } from "../utils/tokenUtils.js";
import Category from "../models/categoryModel.js";

const categoryRoutes = express.Router();

// 🟢 Debugging Middleware: Logs Headers for Every Request
categoryRoutes.use((req, res, next) => {
    console.log("Incoming Headers:", req.headers);
    next();
});

// 🟢 Create a Category (Only Owner)
categoryRoutes.post("/", varifyToken, varifyownerRole, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// 🟢 Get All Categories
categoryRoutes.get("/", varifyToken, async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// 🟡 UPDATE Category (Only Owner)
categoryRoutes.put("/:id", varifyToken, varifyownerRole, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// 🔴 DELETE Category (Only Owner)
categoryRoutes.delete("/:id", varifyToken, varifyownerRole, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

export default categoryRoutes;
