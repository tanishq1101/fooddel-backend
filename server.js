import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "../config/db.js";
import foodRouter from "../routes/foodRoute.js";
import userRouter from "../routes/userRoute.js";
import cartRouter from "../routes/cartRoute.js";
import orderRouter from "../routes/orderRoute.js";
import restaurantAdminRouter from "../routes/restaurantAdminRoute.js";
import restaurantRouter from "../routes/restaurantRoute.js";

const app = express();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS – allow your frontend
app.use(
  cors({
    origin: ["https://fooddel-frontend.vercel.app"], // change to your frontend domain
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use("/images", express.static(path.join(__dirname, "../uploads")));

// Connect to DB
connectDB();

// API Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/admin/restaurants", restaurantAdminRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Backend API is running on Vercel!");
});

// ❗ NO app.listen() on Vercel!!
// Instead we EXPORT the app for serverless use
export default app;
