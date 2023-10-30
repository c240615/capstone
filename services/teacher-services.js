// import
const { Op } = require("sequelize");
// model
const { Teacher, User, Course } = require("../models");

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
      const teacherRows = teachers.rows.map((item) => {
        delete item.User.password;
        return item;
      });

      return cb(null, {
        teacherRows,
        pagination: getPagination(limit, page, teachers.count),
      });
    } catch (e) {
      cb(e);
    }
  },
  // 成為老師
  postBeTeacher: async (req, cb) => {
    try {
      const id = req.params.id;
      // 取得使用者輸入資料
      const {
        intro,
        style,
        link,
        courseDuration,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      } = req.body;
      // 不可空白的資料
      if (!intro || !style || !link || !courseDuration)
        throw new Error("All datas are required!");
      // 新增老師資料
      const teacher = await Teacher.create({
        intro: intro.trim(),
        style: style.trim(),
        link: link.trim(),
        courseDuration: Number(courseDuration),
        monday: monday || false,
        tuesday: tuesday || false,
        wednesday: wednesday || false,
        thursday: thursday || false,
        friday: friday || false,
        saturday: saturday || false,
        sunday: sunday || false,
        userId: id,
      });
      // 改變 user is_teacher
      const userData = await User.findOne({
        where: { id },
      }).then((user) => {
        return user.update({ isTeacher: true });
      });
      const user = userData.toJSON();
      return cb(null, { teacher, user });
    } catch (e) {
      cb(e);
    }
  },
};
module.exports = teacherService;
