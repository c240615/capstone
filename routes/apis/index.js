const express = require("express");
const router = express.Router();
// upload
const passport = require("../../config/passport");
// error
const { apiErrorHandler } = require("../../middleware/error-handler.js");
const {
  authenticated,
  authenticatedAdmin,
} = require("../../middleware/api-auth.js");

const upload = require("../../middleware/multer.js");
const admin = require("../apis/modules/admin.js");

// controller
const teacherController = require("../../controllers/apis/teacher-controller.js");
const userController = require("../../controllers/apis/user-controller.js");

// routes
router.use("/admin", /*authenticated, authenticatedAdmin,*/ admin);

// 註冊
router.post("/signup", userController.signUp);
// 登入
router.post(
  "/signin",
  passport.authenticate("local", {
    session: false,
    failureMessage: true,
    failureRedirect: "/signin",
  }),
  userController.signIn
);
// 開課資訊
// 前台首頁搜尋教師
router.get(
  "/teachers/search",
  /*authenticated,*/
  teacherController.getSearchedTeachers
);

// 取得編輯老師資訊頁
// 編輯老師資訊
// 取得編輯個人頁
router.put(
  "/users/putEdit/:id",
  /*authenticated,*/
  upload.single("profile"),
  userController.putUser
);
// 個人資料頁
router.get("/users/:id", authenticated, userController.getUser);
// 編輯老師個人資料

// 預約課程
// 成為老師
router.post("/beTeacher/:id", /*authenticated, */teacherController.postBeTeacher);
// 新增一筆老師資料
// 留下評論

// 前台教師清單
router.get("/teachers", /*authenticated,*/ teacherController.getTeachers);
// error
router.use("/", apiErrorHandler);

module.exports = router;
