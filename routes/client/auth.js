const { Router } = require("express");
const { body } = require("express-validator");

const authController = require("../../controllers/client/auth");
const User = require("../../models/User");
const isClient = require("../../middleware/isClient");

const router = Router();

router.post(
  "/signup",
  [
    body("fullName", "Please enter full name.").trim().notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with at least 8 characters."
    ).isLength({ min: 8 }),
    body("phoneNumber", "Please enter a valid phone number.")
      .isNumeric()
      .isLength({ min: 10 }),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.get("/", isClient, authController.getUser);

module.exports = router;
