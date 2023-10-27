const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const admin = require("../apis/modules/admin");
const {
  authenticated,
  authenticatedAdmin,
} = require("../../middleware/api-auth.js");
// controller
const teacherController = require("../../controllers/apis/teacher-controller.js");
const userController = require("../../controllers/apis/user-controller.js");
// error
const { apiErrorHandler } = require("../../middleware/error-handler");
// routes
router.use("/admin", /*authenticated, authenticatedAdmin,*/ admin);
// 前台教師清單
router.get(
  "/teachers",
  //authenticated,
  //authenticatedAdmin,
  teacherController.getTeachers
);
// 註冊
router.post(
  "/signup",  
  userController.signUp
);
// 登入
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  userController.signIn
);
// error
router.use("/", apiErrorHandler);

module.exports = router;
