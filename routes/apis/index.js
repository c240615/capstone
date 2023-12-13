const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const { apiErrorHandler } = require("../../middleware/error-handler.js");
const {
  authenticated,
  authenticatedAdmin,
} = require("../../middleware/api-auth.js");
// controller
const teacherController = require("../../controllers/apis/teacher-controller.js");
const userController = require("../../controllers/apis/user-controller.js");
const courseController = require("../../controllers/apis/course-controller.js");
const admin = require("../apis/modules/admin.js");
const teacher = require("../apis/modules/teacher.js");
const user = require("../apis/modules/user.js");

// routes
router.use("/admin", authenticated, authenticatedAdmin, admin);
router.use("/teachers", authenticated, teacher);
router.use("/users", authenticated, user);

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

// 成為老師
router.post("/beTeacher/:id", authenticated, teacherController.postBeTeacher);

// 教師未完成課程
router.get(
  "/getCoursesInTwoWeeks/:id",
  authenticated,
  courseController.getCoursesInTwoWeeks
);

// 預約課程
router.post("/reserve/:id", authenticated, courseController.postCourse);

// 評論課程
router.post("/comment/:id", courseController.postScore);

// error
router.use("/", apiErrorHandler);

module.exports = router;
