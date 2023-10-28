// service
const teacherService = require("../../services/teacher-services");
const teacherController = {
  // 取得所有教師
  getTeachers: (req, res, next) => {
    teacherService.getTeachers(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data,
          });
    });
  },
  getTeacherPage: (res) => {
    res.send("456");
  },
};
module.exports = teacherController;
