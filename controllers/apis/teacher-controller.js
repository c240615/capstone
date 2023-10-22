// service
const teacherService = require("../../services/teacher-services");
const teacherController = {
  // 取得所有教師
  getTeachers: (req, res, next) => {
    teacherService.getTeachers(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
            status:  "200" ,
            user: req.user ? req.user : "User did not login.",
            data
          });
    });
  },
};
module.exports = teacherController;
