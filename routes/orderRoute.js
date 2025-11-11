
import express from "express";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  deleteOrder,
  adminDeleteOrder,
  createCheckoutSession,
  saveOrderAfterPayment,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// USER ROUTES
router.post("/place", authMiddleware, placeOrder);
router.post("/verify", authMiddleware, verifyOrder);
router.get("/userorders", authMiddleware, userOrders);
router.delete("/:orderId", authMiddleware, deleteOrder);
router.post("/create-checkout-session", authMiddleware, createCheckoutSession);
router.get("/payment-success", saveOrderAfterPayment);


// ADMIN ROUTES
router.get("/list", listOrders);
router.post("/status", updateStatus);
router.delete("/admin/:orderId", adminDeleteOrder);  

export default router;
