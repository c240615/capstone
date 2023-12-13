// 套件
const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer");
// controller
const userController = require("../../../controllers/apis/user-controller");

// 未完成課程老師的使用者資料
router.get("/notDoneCourses/:id", userController.getNotDoneCourses);
// 已完成未評分課程老師的使用者資料
router.get("/notRatedCourses/:id", userController.getNotRatedCourses);
// 使用者學習時數排名
router.get("/ranking/:id", userController.getRanking);

// 個人資料頁
router.get("/users/:id", userController.getUser);
// 編輯個人頁
router.put("/putEdit/:id", upload.single("profile"), userController.putUser);
// 學習時數前十名
router.get("/topUsers", userController.getTopUsers);
module.exports = router;
