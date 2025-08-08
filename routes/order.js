const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const { isLoggedIn } = require("../middleware");

router.post("/create", isLoggedIn, orderController.createOrder);
// router.get("/orders", isLoggedIn, orderController.getUserOrders);

module.exports = router;
