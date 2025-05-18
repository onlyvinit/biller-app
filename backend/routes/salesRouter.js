import express from "express";
import mongoose from "mongoose";
import Sales from "../models/salesModel.js";
import User from "../models/User.js";
import FoodItem from "../models/FoodItem.js"; // Correct import

const salesRouter = express.Router();

// ✅ Record a new sale
salesRouter.post("/", async (req, res) => {
  try {
    const { foodItems, totalAmount, biller } = req.body;

    // Validate required fields
    if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
      return res.status(400).json({ message: "foodItems must be a non-empty array" });
    }
    if (!totalAmount || typeof totalAmount !== "number") {
      return res.status(400).json({ message: "totalAmount must be a number" });
    }
    if (!biller) {
      return res.status(400).json({ message: "biller is required" });
    }

    // Validate biller ID
    if (!mongoose.Types.ObjectId.isValid(biller)) {
      return res.status(400).json({ message: "Invalid biller ID format" });
    }
    const billerUser = await User.findById(biller);
    if (!billerUser) {
      return res.status(400).json({ message: "Biller not found in user collection" });
    }
    if (billerUser.role !== "Biller") {
      return res.status(400).json({ message: "User must have role 'Biller'" });
    }

    // Validate foodItems
    for (const item of foodItems) {
      if (!item.itemId || !mongoose.Types.ObjectId.isValid(item.itemId)) {
        return res.status(400).json({ message: `Invalid itemId in foodItems: ${item.itemId}` });
      }
      if (!item.quantity || typeof item.quantity !== "number" || item.quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity in foodItems: ${item.quantity}` });
      }
      if (!item.price || typeof item.price !== "number" || item.price < 0) {
        return res.status(400).json({ message: `Invalid price in foodItems: ${item.price}` });
      }
      const foodItem = await FoodItem.findById(item.itemId);
      if (!foodItem) {
        return res.status(400).json({ message: `FoodItem not found for itemId: ${item.itemId}` });
      }
      // Verify price matches FoodItem
      if (item.price !== foodItem.price) {
        return res.status(400).json({ message: `Price mismatch for itemId ${item.itemId}: sent ${item.price}, expected ${foodItem.price}` });
      }
    }

    // Calculate expected totalAmount
    const calculatedTotal = foodItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({ message: `totalAmount (${totalAmount}) does not match calculated total (${calculatedTotal})` });
    }

    const newSale = new Sales({ foodItems, totalAmount, biller });
    await newSale.save();

    res.status(201).json({ message: "Sale recorded successfully", sale: newSale });
  } catch (error) {
    console.error("Error recording sale:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });
    res.status(500).json({ message: "Error recording sale", error: error.message });
  }
});

// ✅ Fetch aggregated sales data (Daily, Weekly, Monthly)
salesRouter.get("/", async (req, res) => {
  try {
    const { filter } = req.query;

    let groupBy, dateFormat, sortBy, limit;
    if (filter === "daily") {
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
      dateFormat = "%Y-%m-%d";
      sortBy = { _id: -1 };
      limit = 30;
    } else if (filter === "weekly") {
      groupBy = {
        $concat: [
          { $toString: { $year: "$date" } },
          "-W",
          { $toString: { $week: "$date" } },
        ],
      };
      dateFormat = "%Y-W%U";
      sortBy = { _id: -1 };
      limit = 12;
    } else if (filter === "monthly") {
      groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } };
      dateFormat = "%Y-%m";
      sortBy = { _id: -1 };
      limit = 12;
    } else {
      return res.status(400).json({ message: "Invalid filter" });
    }

    const sales = await Sales.aggregate([
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: sortBy },
      { $limit: limit },
    ]);

    const salesData = sales.map(item => ({
      period: item._id,
      totalSales: item.totalSales,
      count: item.count,
    }));

    const totalSales = salesData.reduce((sum, item) => sum + item.totalSales, 0);

    res.json({ salesData, totalSales });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ message: "Error fetching sales data", error: error.message });
  }
});

export default salesRouter;