import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const Table = mongoose.model("Table", tableSchema);

export default Table;