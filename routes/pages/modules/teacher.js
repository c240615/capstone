const express = require("express");
const router = express.Router();
const { User, Teacher, Course } = require("../../../models");
const teacherController = require("../../../controllers/pages/teacher-controller");
const courseController = require("../../../controllers/pages/course-controller");

// 開課資訊
router.get("/reserve/:id", courseController.getReservePage);

// 編輯老師資訊
router.get("/edit/:id", teacherController.getEditPage);
router.put("/edit/:id", teacherController.putTeacher);

// 前台首頁搜尋教師
router.get("/search", teacherController.getSearchedTeachers);

// 取得教師個人資訊頁
router.get("/:id", teacherController.getTeacherPage);
// 進入前台首頁
router.get("/", teacherController.getTeachers);

module.exports = router;
