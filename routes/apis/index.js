const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const admin = require("../apis/modules/admin");
const {
  authenticated,
  authenticatedAdmin,
} = require("../../middleware/api-auth");
// controller
const teacherController = require("../../controllers/apis/teacher-controller");
const userController = require("../../controllers/apis/user-controller");
// error
const { apiErrorHandler } = require("../../middleware/error-handler");
// routes
router.use("/admin", authenticated, authenticatedAdmin, admin);
// 前台教師清單
router.get(
  "/teachers",
  authenticated,
  authenticatedAdmin,
  teacherController.getTeachers
);
//signin
router.get("/signin", userController.signInPage);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  userController.signIn
);
// error
router.use("/", apiErrorHandler);


module.exports = router;
