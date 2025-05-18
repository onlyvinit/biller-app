import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const FoodItems  = mongoose.model ("FoodItem" , foodItemSchema)

export default FoodItems;