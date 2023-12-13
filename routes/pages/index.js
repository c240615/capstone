// 載入外部套件
const express = require("express");
const router = express.Router();
// 載入內部資料
const passport = require("../../config/passport.js");
const admin = require("../pages/modules/admin.js");
const auth = require("../pages/modules/auth.js");
const teachers = require("./modules/teacher.js");
const users = require("./modules/user.js");

const teacherController = require("../../controllers/pages/teacher-controller.js");
const userController = require("../../controllers/pages/user-controller.js");
const courseController = require("../../controllers/pages/course-controller.js");

// handler
const { generalErrorHandler } = require("../../middleware/error-handler.js");
const {
  authenticated,
  authenticatedAdmin,
} = require("../../middleware/auth.js");


router.use("/auth", auth);
router.use("/admin", authenticatedAdmin, admin);
router.use("/teachers", authenticated, teachers);
router.use("/users", authenticated, users);

// 註冊
router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp);
// 登入
router.get("/signin", userController.signInPage);
router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  userController.signIn
);
// 登出
router.get("/logout", userController.logout);

// 預約課程
router.post("/reserve/:id", authenticated, courseController.postCourse);
// 成為老師
router.get("/beTeacher", authenticated, teacherController.beTeacherPage);
router.post("/beTeacher/:id", authenticated, teacherController.postBeTeacher);
// 評論
router.post("/comment/:id", authenticated, courseController.postScore);

// 使用者輸入其餘路由時自動導向
router.use("/", (req, res) => res.redirect("/teachers"));
// 錯誤訊息
router.use("/", generalErrorHandler);
// 輸出到 app.js
module.exports = router;
