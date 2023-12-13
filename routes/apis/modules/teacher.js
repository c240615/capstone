// 套件
const express = require("express");
const router = express.Router();
// Controller
const courseController = require("../../../controllers/apis/course-controller");
const teacherController = require("../../../controllers/apis/teacher-controller");

// 教師課程風格
router.get("/style/:id", teacherController.getTeacher);
//教師評分
router.get("/score/:id", teacherController.getScore);
// 教師已完成課程
router.get("/doneCourses/:id", courseController.getDoneCourses);
// getCoursesInTwoWeeks
router.get("/notDoneCourses/:id", courseController.getNotDoneCourses);
// 前台首頁搜尋教師
router.get("/search", teacherController.getSearchedTeachers);
// 前台教師清單
router.get("/", teacherController.getTeachers);

module.exports = router;
