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
const courseController = require("../../controllers/apis/course-controller.js");

// routes
router.use("/admin", authenticated, authenticatedAdmin, admin);

// 註冊
router.post("/signup", userController.signUp);
// 登入
router.post(
  "/signin",
  passport.authenticate("local", {
    session: false,
    //failureMessage: true,
    //failureRedirect: "/signin",
  }),
  userController.signIn
);
// 編輯個人頁
router.put(
  "/users/putEdit/:id",
  authenticated,
  upload.single("profile"),
  userController.putUser
);
// 未完成課程老師的使用者資料
router.get(
  "/users/notDoneCourses/:id",
  authenticated,
  userController.getNotDoneCourses
);
// 已完成未評分課程老師的使用者資料
router.get(
  "/users/notRatedCourses/:id",
  authenticated,
  userController.getNotRatedCourses
);
// 使用者學習時數排名
router.get("/users/ranking/:id", authenticated, userController.getRanking);
// 學習時數前十名
router.get("/users/topUsers", authenticated, userController.getTopUsers);

// 前台首頁搜尋教師
router.get(
  "/teachers/search",
  authenticated,
  teacherController.getSearchedTeachers
);

// 個人資料頁
router.get("/users/:id", authenticated, userController.getUser);

// 成為老師
router.post("/beTeacher/:id", authenticated, teacherController.postBeTeacher);

//教師評分
router.get("/teachers/score/:id", authenticated, teacherController.getScore);
// getCoursesInTwoWeeks
router.get(
  "/teachers/notDoneCourses/:id",
  authenticated,
  courseController.getNotDoneCourses
);

// 教師已完成課程
router.get(
  "/teachers/doneCourses/:id",
  authenticated,
  courseController.getDoneCourses
);
// 教師課程風格
router.get("/teachers/style/:id", authenticated, teacherController.getTeacher);

// 教師未完成課程
router.get(
  "/getCoursesInTwoWeeks/:id",
  authenticated,
  courseController.getCoursesInTwoWeeks
);

// 預約課程
router.post("/reserve/:id", authenticated, courseController.postCourse);

// 評論課程
router.post("/comment/:id", authenticated, courseController.postScore);

// 前台教師清單
router.get("/teachers", authenticated, teacherController.getTeachers);

// error
router.use("/", apiErrorHandler);

module.exports = router;
