import dotenv from "dotenv";
dotenv.config(); // <---- FIRST THING

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

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- THIS LINE HAS BEEN CORRECTED ---
// Static serving of uploaded images
app.use("/images", express.static(path.join(__dirname, "uploads")));
// ------------------------------------

// DB connection
connectDB();

// API routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
// ✅ Frontend restaurant browsing
app.use("/api/restaurant", restaurantRouter);

// ✅ Admin management routes
app.use("/api/admin/restaurants", restaurantAdminRouter);

// Health endpoint
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
