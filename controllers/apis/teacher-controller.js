const { Teacher, User, Course } = require("../../models");
const { getOffset, getPagination } = require("../../helpers/pagination-helper");
const teacherController = {
  // 取得所有教師
  getTeachers: async (req, res, next) => {
    try {
      const user = await User.findAll({ raw: true });
      const teachers = await Teacher.findAll({
        raw: true,
        nest: true,
        include: [User],
      });
      return res.status(200).json({
        status: "200",
        user: req.user ? req.user : undefined,
        teachers,
      });
    } catch (err) {
      next(err);
    }
  },
};
module.exports = teacherController;
