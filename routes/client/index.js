const { Router } = require("express");

const authRoutes = require("./auth");
const productRoutes = require("./product");
const orderRoutes = require("./order");
const sessionRoutes = require("./session");

const router = Router();

router.use("/auth", authRoutes);

router.use("/product", productRoutes);

router.use("/order", orderRoutes);

router.use("/session", sessionRoutes);

module.exports = router;
