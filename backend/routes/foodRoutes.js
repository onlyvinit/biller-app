import express from "express";
const foodRouter = express.Router();
import { varifyToken } from "../utils/tokenUtils.js";
import FoodItems from "../models/FoodItem.js";

// ✅ Add a new food item
foodRouter.post("/", varifyToken, async (req, res) => {
  try {
    const { name, category, price, description } = req.body;
    if (!name || !category || !price || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFoodItem = new FoodItems({ name, category, price, description });
    await newFoodItem.save();

    res.status(201).json({ message: "Food item added successfully", food: newFoodItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding food item", error });
  }
});

// ✅ Get all food items (with category filter)
foodRouter.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {}; // ✅ Filter food by category if provided

    const foodItems = await FoodItems.find(query)
      .populate("category", "name") // ✅ Populate category name
      .exec();

    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching food items", error });
  }
});

// ✅ Update a food item
foodRouter.put("/:id", varifyToken, async (req, res) => {
  try {
    const { name, category, price, description } = req.body;
    const updatedFood = await FoodItems.findByIdAndUpdate(
      req.params.id,
      { name, category, price, description },
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ message: "Food item updated", food: updatedFood });
  } catch (error) {
    res.status(500).json({ message: "Error updating food item", error });
  }
});

// ✅ Delete a food item
foodRouter.delete("/:id", varifyToken, async (req, res) => {
  try {
    const deletedFood = await FoodItems.findByIdAndDelete(req.params.id);

    if (!deletedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ message: "Food item deleted", food: deletedFood });
  } catch (error) {
    res.status(500).json({ message: "Error deleting food item", error });
  }
});

export default foodRouter;
