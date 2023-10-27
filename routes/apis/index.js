const express = require("express");
const router = express.Router();
// upload
const passport = require("../../config/passport");
// error
const { apiErrorHandler } = require("../../middleware/error-handler");
const {
  authenticated,
  authenticatedAdmin,
} = require("../../middleware/api-auth");

const admin = require("../apis/modules/admin");

// controller
const teacherController = require("../../controllers/apis/teacher-controller.js");
const userController = require("../../controllers/apis/user-controller.js");

// routes
router.use("/admin", authenticatedAdmin, admin);

// 註冊
router.post("/signup", userController.signUp);
// 登入
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  userController.signIn
);

// 前台教師清單
router.get("/teachers", authenticated, teacherController.getTeachers);
// error
router.use("/", apiErrorHandler);

module.exports = router;
