const { Router } = require("express");
const { body } = require("express-validator");

const sessionController = require("../../controllers/admin/session");
const isConsultant = require("../../middleware/isConsultant");

const router = Router();

router.get("/:roomId", isConsultant, sessionController.getSession);

router.get("/", isConsultant, sessionController.getContacts);

router.put(
  "/:roomId",
  [body("message").trim().notEmpty()],
  isConsultant,
  sessionController.updateSession
);

router.delete("/:roomId", isConsultant, sessionController.deleteSession);

module.exports = router;
