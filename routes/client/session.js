const { Router } = require("express");
const { body } = require("express-validator");

const sessionController = require("../../controllers/client/session");

const router = Router();

router.post(
  "/",
  [body("message").trim().notEmpty()],
  sessionController.addSession
);

router.get("/:roomId", sessionController.getSession);

router.put(
  "/:roomId",
  [body("message").trim().notEmpty()],
  sessionController.updateSession
);

router.delete("/:roomId", sessionController.deleteSession);

module.exports = router;
