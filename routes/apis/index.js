const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const admin = require("../apis/modules/admin");
// controller
const teacherController = require("../../controllers/apis/teacher-controller");
const userController = require("../../controllers/apis/user-controller");
const { apiErrorHandler } = require("../../middleware/error-handler");
// routes
router.use("/admin", admin);
//signin
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  userController.signIn
);
router.use("/", apiErrorHandler);
// 前台教師清單
router.get("/teachers", teacherController.getTeachers);

module.exports = router;
