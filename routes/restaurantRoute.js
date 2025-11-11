import express from "express";
import { getRestaurantsByCity, getMenuByRestaurant, getRestaurantDetails} from "../controllers/restaurantController.js";
import restaurantModel from "../models/restaurantModel.js";

const router = express.Router();

// /api/restaurant/city/Delhi
router.get("/city/:city", getRestaurantsByCity);

// /api/restaurant/64f2ab.../menu
router.get("/:id/menu", getMenuByRestaurant);

router.get("/details/:id", getRestaurantDetails);

router.get("/all", async (req, res) => {
  try {
    const restaurants = await restaurantModel.find();
    res.json({ success: true, restaurants });
  } catch {
    res.json({ success: false });
  }
});


export default router;
