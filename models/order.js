const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
