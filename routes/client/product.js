const { Router } = require("express");

const productController = require("../../controllers/client/product");

const router = Router();

router.get("/", productController.getProducts);

router.get("/:productId", productController.getProduct);

module.exports = router;
