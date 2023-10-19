const { Op } = require("sequelize");
const { Teacher, User, Course } = require("../../models");
const teacherController = {
  getTeachers: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || DEFAULT_LIMIT;
      const offset = getOffset(limit, page);
      const users = await User.findAll({ raw: true });
      const teachers = await Teacher.findAndCountAll({
        raw: true,
        nest: true,
        include: [User],
        limit,
        offset,
      });
      // 排行榜
      const topUsers = await User.findAll({
        raw: true,
        nest: true,
        order: [
          ["course_hours", "DESC"],
          ["name", "ASC"],
        ],
      });
      const top = topUsers.map((item, index) => {
        return { profile: item.profile, index: index + 1, name: item.name };
      });
      const topTen = top.slice(0, 9);

      const teacherDatas = teachers.rows;
      return res.render("teachers", {
        teacherDatas,
        users,
        pagination: getPagination(limit, page, teachers.count),
        topTen,
      });
    } catch (err) {
      next(err);
    }
  },
};
module.exports = teacherController;
