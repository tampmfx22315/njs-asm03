const { Router } = require("express");

const productController = require("../../controllers/admin/product");
const isAdmin = require("../../middleware/isAdmin");

const router = Router();

router.get("/", isAdmin, productController.getProducts);

router.get("/:productId", isAdmin, productController.getProduct);

router.post("/", isAdmin, productController.addProduct);

router.put("/:productId", isAdmin, productController.editProduct);

router.delete("/:productId", isAdmin, productController.deleteProduct);

module.exports = router;
