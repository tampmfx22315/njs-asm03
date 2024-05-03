const { Router } = require("express");

const authRoutes = require("./auth");
const productRoutes = require("./product");
const sessionRoutes = require("./session");
const orderRoutes = require("./order");

const router = Router();

router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/session", sessionRoutes);
router.use("/order", orderRoutes);

module.exports = router;
