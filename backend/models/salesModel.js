import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    foodItems: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
            quantity: Number,
            price: Number,
        },
    ],
    totalAmount: { type: Number, required: true },
    biller: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    date: { type: Date, default: Date.now },
});

export default mongoose.model("Sales", salesSchema);