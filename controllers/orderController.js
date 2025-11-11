import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import "dotenv/config";
import Stripe from "stripe";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// -------------------- USER --------------------

const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",

      // ✅ SUCCESS + FAIL URLS (hardcoded for localhost)
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment-failed`,

      metadata: {
        userId,
        address: JSON.stringify(address).slice(0, 499)
      }
    });

    // ✅ Correct Response
    return res.json({ success: true, url: session.url });

  } catch (error) {
    console.log("Stripe session error:", error);
    return res.json({ success: false, message: "Payment session failed" });
  }
};

// save order:

const saveOrderAfterPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.json({ success: false });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const userId = session.metadata.userId;
    const address = JSON.parse(session.metadata.address);
    const amount = session.amount_total / 100;

    const lineItems = await stripe.checkout.sessions.listLineItems(session_id);

    const items = lineItems.data.map((item) => ({
      name: item.description,
      price: item.amount_total / item.quantity / 100,
      quantity: item.quantity,
    }));

    const newOrder = await orderModel.create({
      userId,
      items,
      amount,
      address,
      payment: true,
      status: "Order Placed",
    });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.json({ success: true, order: newOrder });

  } catch (error) {
    console.log(error);
    return res.json({ success: false });
  }
};


// Place an order (COD)
const placeOrder = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);

    const userId = req.user.id;

    const newOrder = new orderModel({
      userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
      status: "Pending",
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order placed successfully (Cash on Delivery)",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("Place order error:", error);
    res.json({ success: false, message: "Error placing order" });
  }
};

// Verify order manually (COD confirmation)
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Order Placed",
      });
      res.json({ success: true, message: "Order marked as paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: true, message: "Order cancelled / not paid" });
    }
  } catch (error) {
    console.log("Verify order error:", error);
    res.json({ success: false, message: "Error verifying order" });
  }
};

// Get orders for a specific user
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log("User orders error:", error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// -------------------- ADMIN --------------------
// List all orders
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("List orders error:", error);
    res.json({ success: false, message: "Error fetching order list" });
  }
};

// Update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.log("Update status error:", error);
    res.json({ success: false, message: "Error updating order status" });
  }
};
// -------------------- ADMIN DELETE ORDER --------------------

const adminDeleteOrder = async (req, res) => {
  try {
    console.log("🧾 ADMIN DELETE REQUEST RECEIVED");
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);
    if (!order) {
      console.log("❌ Order not found");
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await orderModel.findByIdAndDelete(orderId);
    console.log("✅ Order deleted successfully:", orderId);

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully by admin",
    });
  } catch (error) {
    console.error("❌ Error deleting order (admin):", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting order (admin)",
    });
  }
};




// -------------------- DELETE ORDER --------------------

const deleteOrder = async (req, res) => {
  try {
    console.log("🧾 DELETE REQUEST RECEIVED");
    console.log("Headers:", req.headers.authorization);
    console.log("User from token:", req.user);
    console.log("OrderId param:", req.params.orderId);

    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);
    if (!order) {
      console.log("❌ Order not found");
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // ✅ Remove restriction so users can delete any of their orders (even if status pending/placed)
    // If you ever want to restrict again, just uncomment below:
    // if (order.userId.toString() !== userId) {
    //   return res.status(403).json({ success: false, message: "Unauthorized to delete this order" });
    // }

    await orderModel.findByIdAndDelete(orderId);
    console.log("✅ Order deleted:", orderId);

    return res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    return res.status(500).json({ success: false, message: "Server error deleting order" });
  }
};

export {createCheckoutSession, saveOrderAfterPayment, placeOrder, verifyOrder, userOrders, listOrders, updateStatus, deleteOrder, adminDeleteOrder };
