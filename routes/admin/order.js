const { Router } = require("express");

const orderController = require("../../controllers/admin/order");
const isAdmin = require("../../middleware/isAdmin");

const router = Router();

router.get("/", isAdmin, orderController.getDashboard);

router.get("/:orderId", isAdmin, orderController.getOrder);

module.exports = router;
