const { Teacher, User } = require("../../models");
const teacherService = require("../../services/teachers-services");
const teacherController = {
  // 取得所有教師
  getTeachers: (req, res, next) => {
    teacherService.getTeachers(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
            status: "200",
            user: req.user ? req.user : "no data",
            data: data,
          });
    });
  },
};
module.exports = teacherController;
