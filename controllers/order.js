const Order = require("../models/order");
const Listing = require("../models/listing");
const axios = require("axios");

module.exports.createOrder = async (req, res) => {
  try {
    const { listing_id } = req.body;
    if (!listing_id) {
      return res.status(400).json({
        success: false,
        message: "Listing id is required",
      });
    }

    const listing = await Listing.findById(listing_id);
    if (!listing) {
      // req.flash("error", "Something went wrong");
      return res.status(404).json({
        success: true,
        message: "Listing no found",
      });
    }
    const total_amount = listing.price;
    const gst = parseFloat((0.18 * total_amount).toFixed(2));
    const payable_amount = total_amount + gst;

    const newOrder = new Order({
      user_id: req.user._id,
      listing_id,
      total_amount,
      gst,
      payable_amount,
    });

    const order = await newOrder.save();

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      order_details: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
