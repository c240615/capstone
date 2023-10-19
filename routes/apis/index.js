const express = require("express");
const router = express.Router();
const { authenticated } = require("../../middleware/auth");

const teacherController = require('../../controllers/apis/teacher-controller')

router.get("/teachers", teacherController.getTeachers);

module.exports = router;