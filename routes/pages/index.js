// 總路由
// 載入外部套件
const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
// 載入內部資料
const admin = require("../pages/modules/admin");
const teacherController = require("../../controllers/pages/teacher-controller");
const userController = require("../../controllers/pages/user-controller");
const courseController = require("../../controllers/pages/course-controller");
const auth = require("../pages/modules/auth");
// handler
const { generalErrorHandler } = require("../../middleware/error-handler");
const { authenticated, authenticatedAdmin } = require("../../middleware/auth");
const upload = require("../../middleware/multer");

router.use("/auth", auth);
// admin
router.use("/admin", authenticatedAdmin, admin);
// 註冊
router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp);
// 登入
router.get("/signin", userController.signInPage);
router.post(
  "/api/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  userController.signIn
);
// 登出
router.get("/logout", userController.logout);
// 開課資訊
router.get(
  "/teachers/reserve/:id",
  authenticated,
  courseController.getReservePage
);
// 前台首頁搜尋教師
router.get(
  "/teachers/search",
  authenticated,
  teacherController.getFilteredTeachers
);
// 編輯老師資訊頁
router.get("/teachers/edit/:id", authenticated, teacherController.getEditPage);
router.put("/teachers/edit/:id", authenticated, teacherController.putTeacher);
// 編輯個人資訊頁
router.get("/users/edit/:id", authenticated, userController.getEditPage);
router.put(
  "/users/putedit/:id",
  authenticated,
  upload.single("profile"),
  userController.putUser
);

// 取得個人資訊頁
router.get("/users/:id", authenticated, userController.getUserPage);
router.get("/teachers/:id", authenticated, teacherController.getTeacherPage);

// 預約課程
router.post("/reserve/:id", authenticated, courseController.postCourse);
// 成為老師
router.get("/beTeacher", authenticated, teacherController.beTeacherPage);
router.post("/beTeacher", authenticated, teacherController.postBeTeacher);
// 評論
router.post("/comment", authenticated, courseController.postScore);
// 進入前台首頁
router.get("/teachers", authenticated, teacherController.getTeachers);
// 使用者輸入其餘路由時自動導向
router.use("/", (req, res) => res.redirect("/teachers"));
// 錯誤訊息
router.use("/", generalErrorHandler);
// 輸出到 app.js
module.exports = router;
