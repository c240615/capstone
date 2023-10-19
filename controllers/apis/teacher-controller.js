const { Teacher, User, Course } = require("../../models");
const { getOffset, getPagination } = require("../../helpers/pagination-helper");
const teacherController = {
  getTeachers: async (res, next) => {
    await Teacher.findAll({
      raw: true,
      nest: true,
      include: [User],
    })
      .then((teachers) => {
        return res.json({ teachers });
      })
      .catch((e) => {
        next(e);
      });
  },
};
module.exports = teacherController;
