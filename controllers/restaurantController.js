import restaurantModel from "../models/restaurantModel.js";
import Food from "../models/foodModel.js";

// ✅ Get Restaurants by City
export const getRestaurantsByCity = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({ city: req.params.city });
    res.json({ success: true, restaurants });
  } catch (error) {
    console.log("City filter error:", error);
    res.json({ success: false, message: "Error loading restaurants" });
  }
};

// ✅ Get Menu of Restaurant
export const getMenuByRestaurant = async (req, res) => {
  try {
    const menu = await Food.find({ restaurantId: req.params.id });
    res.json({ success: true, menu });
  } catch (error) {
    console.log("Menu load error:", error);
    res.json({ success: false, message: "Error loading menu" });
  }
};

// ✅ Optional: get restaurant details
export const getRestaurantDetails = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findById(req.params.id);
    res.json({ success: true, restaurant });
  } catch (error) {
    console.log("Details load error:", error);
    res.json({ success: false, message: "Error loading restaurant details" });
  }
};

// ✅ Admin listing
export const listRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find();
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error loading restaurants" });
  }
};

// ✅ Add restaurant
export const addRestaurant = async (req, res) => {
  try {
    const restaurant = new restaurantModel(req.body);
    await restaurant.save();
    res.json({ success: true, message: "Restaurant Added" });
  } catch (err) {
    res.json({ success: false, message: "Failed to add restaurant" });
  }
};

// ✅ Delete restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    await restaurantModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Restaurant deleted" });
  } catch (err) {
    res.json({ success: false, message: "Failed to delete restaurant" });
  }
};
