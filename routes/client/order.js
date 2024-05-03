const { Router } = require("express");
const { body } = require("express-validator");

const orderController = require("../../controllers/client/order");
const isClient = require("../../middleware/isClient");

const router = Router();

router.post(
  "/",
  [
    body("fullName", "Please enter full name.").trim().notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("phoneNumber", "Please enter a valid phone number.")
      .isNumeric()
      .isLength({ min: 10 }),
    body("address", "Please enter address.").trim().notEmpty(),
  ],
  isClient,
  orderController.addOrder
);

router.get("/", isClient, orderController.getOrders);

router.get("/:orderId", isClient, orderController.getOrder);

module.exports = router;
