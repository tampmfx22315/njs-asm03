const { Router } = require("express");

const authController = require("../../controllers/admin/auth");
const isConsultant = require("../../middleware/isConsultant");

const router = Router();

router.post("/", authController.login);

router.get("/", isConsultant, authController.getUser);

module.exports = router;
