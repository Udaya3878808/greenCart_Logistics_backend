import mongoose from "mongoose";
import Order from "../Models/orders.js";
import Route from "../Models/route.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("assignedRoute");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("assignedRoute");
    if (!order) {
      return res
        .status(404)
        .json({ error: "NotFound", message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { orderId, valueRs, assignedRoute, deliveryTimestamp } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Validate assignedRoute ObjectId
    if (assignedRoute && !mongoose.Types.ObjectId.isValid(assignedRoute)) {
      return res.status(400).json({ message: "Invalid assignedRoute ID" });
    }

    const order = await Order.create({
      orderId,
      valueRs,
      assignedRoute,
      deliveryTimestamp,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    let updates = req.body;
    if (typeof req.body === "string") {
      updates = { assignedRoute: req.body };
    }

    // If routeId is given instead of assignedRoute _id, find and set it
    if (updates.routeId) {
      const route = await Route.findOne({ routeId: updates.routeId });
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
      updates.assignedRoute = route._id;
      delete updates.routeId;
    }

    // Validate assignedRoute ObjectId if provided directly
    if (
      updates.assignedRoute &&
      !mongoose.Types.ObjectId.isValid(updates.assignedRoute)
    ) {
      return res.status(400).json({ message: "Invalid assignedRoute ID" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("assignedRoute");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ error: "NotFound", message: "Order not found" });
    }

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
