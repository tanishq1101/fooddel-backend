import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import restaurantAdminRouter from "./routes/restaurantAdminRoute.js";
import restaurantRouter from "./routes/restaurantRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS for:
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://fooddel-frontend-xv4i.vercel.app",
      "https://foodel-admin-9n9z.vercel.app"
    ],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for image uploads
app.use("/images", express.static(path.join(__dirname, "./uploads")));

// Connect DB
connectDB();

// API routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/admin/restaurants", restaurantAdminRouter);

// Health route
app.get("/", (req, res) => {
  res.send("Local Backend Server Running on http://localhost:4000");
});

// Enable local server (NOT for Vercel)
app.listen(port, () => {
  console.log(`🚀 Local backend running at http://localhost:${port}`);
});
