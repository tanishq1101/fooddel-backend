import express from "express";
import restaurantModel from "../models/restaurantModel.js";

const router = express.Router();

// Add restaurant
router.post("/add", async (req, res) => {
  try {
    console.log("Received restaurant:", req.body); // ✅ add this
    const restaurant = new restaurantModel(req.body);
    await restaurant.save();
    res.json({ success: true, message: "Restaurant Added" });
  } catch (err) {
    console.log("Add Restaurant Error:", err);
    res.json({ success: false, message: "Failed to add restaurant" });
  }
});


// Get all restaurants (admin)
router.get("/list", async (req, res) => {
  try {
    const restaurants = await restaurantModel.find();
    res.json({ success: true, data: restaurants });
  } catch (err) {
    res.json({ success: false, message: "Failed to load restaurants" });
  }
});

// Delete restaurant
router.delete("/delete/:id", async (req, res) => {
  try {
    await restaurantModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Restaurant deleted" });
  } catch (err) {
    res.json({ success: false, message: "Failed to delete restaurant" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const updated = await restaurantModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, message: "Restaurant Updated", restaurant: updated });
  } catch (err) {
    console.log("Update Error:", err);
    res.json({ success: false, message: "Failed to update restaurant" });
  }
});


export default router;

