import express from "express";
import Table from "../models/tableModel.js";
import { varifyownerRole, varifyToken } from "../utils/tokenUtils.js"; 

const tableRouter = express.Router();

// ✅ Create a new table (Owner only)
tableRouter.post("/", varifyToken, varifyownerRole, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Table name is required" });
    }

    const newTable = new Table({ name: name.trim() });
    await newTable.save();

    res.status(201).json({ message: "Table created successfully", table: newTable });
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ message: "Error creating table", error: error.message });
  }
});

// ✅ Get all tables (Accessible by billers & owners)
tableRouter.get("/", varifyToken, async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ message: "Error fetching tables", error: error.message });
  }
});

// ✅ Delete a table (Owner only)
tableRouter.delete("/:id", varifyToken, varifyownerRole, async (req, res) => {
  try {
    const deletedTable = await Table.findByIdAndDelete(req.params.id);

    if (!deletedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ message: "Table deleted successfully", table: deletedTable });
  } catch (error) {
    console.error("Error deleting table:", error);
    res.status(500).json({ message: "Error deleting table", error: error.message });
  }
});

export default tableRouter;
