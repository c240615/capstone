const { User, Teacher, Course } = require("../models");
const { Op } = require("sequelize");
const { getOffset, getPagination } = require("../helpers/pagination-helper.js");

const teacherService = {
  // 取得所有教師
  getTeachers: async (req, cb) => {
    try {
      const DEFAULT_LIMIT = 9;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || DEFAULT_LIMIT;
      const offset = getOffset(limit, page);
      const teachers = await Teacher.findAndCountAll({
        raw: true,
        nest: true,
        include: [User],
        limit,
        offset,
      });
      // 去掉密碼
      const teacherRows = teachers.rows;
      return cb(null, {
        teacherRows,
        pagination: getPagination(limit, page, teachers.count),
      });
    } catch (e) {
      cb(e);
    }
  },
};
module.exports = teacherService;
