import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },      // ✅ use `city`
  address: { type: String, required: true },   // ✅ use `address`
  cuisine: { type: String, required: true },   // ✅ use `cuisine`
  rating: { type: Number, required: true },
  image: { type: String }                      // URL string
}, { timestamps: true });

const restaurantModel = mongoose.model("restaurants", restaurantSchema);
export default restaurantModel;
