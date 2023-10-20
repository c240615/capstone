const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const admin =  require('../apis/modules/admin')
// controller
const teacherController = require('../../controllers/apis/teacher-controller')
const userController = require("../../controllers/apis/user-controller");
// routes
router.use('/admin',admin)
// 前台教師清單
router.get("/teachers", teacherController.getTeachers);

module.exports = router;