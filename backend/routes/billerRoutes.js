import express from "express";
import User from "../models/User.js";
import { varifyToken } from "../utils/tokenUtils.js";

const billRouter = express.Router();

// Get all Billers
billRouter.get("/", varifyToken, async (req, res) => {
  try {
    if (req.user.role !== "Owner") {
      return res.status(403).json({ message: "Access denied. Owners only." });
    }
    const billers = await User.find({ role: "Biller" }).select("name email role");

    res.json(billers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching billers", error });
  }
});

// Delete a Biller
billRouter.delete("/:id", varifyToken, async (req, res) => {
  try {
    if (req.user.role !== "Owner") {
      return res.status(403).json({ message: "Access denied. Owners only." });
    }

    const deletedBiller = await User.findByIdAndDelete(req.params.id);

    if (!deletedBiller) {
      return res.status(404).json({ message: "Biller not found" });
    }

    res.json({ message: "Biller deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting biller", error });
  }
});


billRouter.put("/:id", varifyToken, async (req, res) => {
  try {
    if (req.user.role !== "Owner") {
      return res.status(403).json({ message: "Access denied. Owners only." });
    }

    const { name, email } = req.body;

    const updatedBiller = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedBiller) {
      return res.status(404).json({ message: "Biller not found." });
    }

    res.json(updatedBiller);
  } catch (error) {
    res.status(500).json({ message: "Error updating biller", error });
  }
});


export default billRouter;