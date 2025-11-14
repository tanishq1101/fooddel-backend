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

// Resolve __dirname for serverless
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS (frontend URL)
app.use(
  cors({
      origin: [
      "https://fooddel-frontend-xv4i.vercel.app",
      "https://foodel-admin-9n9z.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static for images
app.use("/images", express.static(path.join(__dirname, "../uploads")));

// Connect DB
connectDB();

// API routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/admin/restaurants", restaurantAdminRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Backend running on Vercel Serverless!");
});

// ⚠️ Do NOT use app.listen(). Export instead
export default app;
