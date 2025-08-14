const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const { isLoggedIn } = require("../middleware");

router.post("/create", isLoggedIn, orderController.createOrder);

module.exports = router;
