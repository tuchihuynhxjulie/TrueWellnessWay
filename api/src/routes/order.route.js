const express = require(`express`);

const { placeOrder, 
        getAllOrders,
        getOrderFromUser,
        getOrderDetails,
} = require("../controllers/order.controller");
const { verifyToken, verifyAdmin } = require("../utils/verifyToken");

const router = express.Router();

router.post("/placeOrder", verifyToken ,placeOrder);

router.get("/getOrderList", verifyToken, getOrderFromUser);

router.get("/getOrderDetails", verifyToken, getOrderDetails);

router.get("/getAllOrders", verifyAdmin, getAllOrders);

module.exports = router;

// get All Users Order verify admin