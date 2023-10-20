const express = require("express");
const router = express.Router();
const admin =  require('../apis/modules/admin')
// controller
const teacherController = require('../../controllers/apis/teacher-controller')
router.use('/admin',admin)
router.get("/teachers", teacherController.getTeachers);

module.exports = router;