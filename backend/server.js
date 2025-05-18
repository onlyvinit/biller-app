import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import billerRoutes from "./routes/billerRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import salesRouter from "./routes/salesRouter.js";
import tableRouter from "./routes/tableRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Allow frontend to send cookies & tokens
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Define API routes properly
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/billers", billerRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/sales", salesRouter);
app.use("/api/tables", tableRouter); 

app.get("/", (req, res) => {
    res.send("Backend is running...");
});

// ✅ Ensure PORT is defined
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
