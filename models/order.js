const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing_id: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    payable_amount: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
