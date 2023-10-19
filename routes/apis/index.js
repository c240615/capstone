const express = require("express");
const router = express.Router();
const { authenticated } = require("../../middleware/auth");

const teacherController = require('../../controllers/pages/teacher-controller')

router.get("/teachers", authenticated, teacherController.getTeachers);

module.exports = router;