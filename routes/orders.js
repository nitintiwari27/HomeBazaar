// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/order"); // make sure Order model is correct
const Listing = require("../models/listing");

// Create order route
router.post("/create", async (req, res) => {
  try {
    const { listingId, price } = req.body;

    const newOrder = new Order({
      product: listingId,
      price: price,
      buyer: req.user._id, // Assuming user is logged in
    });

    await newOrder.save();
    res.redirect("/orders/myorders"); // redirect to orders page after buying
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).send("Something went wrong!");
  }
});

router.get("/myorders", async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate(
      "product"
    );
    res.render("orders/myorders", { orders });
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).send("Something went wrong!");
  }
});

module.exports = router;
