// sequelize
const { Op } = require("sequelize");
// model
const { Teacher, User, Course } = require("../models");
// pagination
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
  // 搜尋教師
  getSearchedTeachers: async (req, cb) => {
    try {
      const keyword = req.query.keyword.toLowerCase().trim();
      if (!keyword) throw new Error("Keyword i s required!");
      const DEFAULT_LIMIT = 6;
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
      // 刪除密碼
      const teacherRows = teachers.rows.map((item) => {
        delete item.User.password;
        return item;
      });
      // 比對關鍵字
      const filterDatas = teacherRows.filter((data) => {
        return data.User.name.toLowerCase().includes(keyword);
      });

      return cb(null, {
        filterDatas,
        pagination: getPagination(limit, page, filterDatas.length),
      });
    } catch (e) {
      cb(e);
    }
  },
  // 成為老師
  postBeTeacher: async (req, cb) => {
    try {
      const id = req.params.id;
      const idExist = await Teacher.findAll({
        raw: true,
        nest: true,
        where: { userId: id },
      });
      if (idExist) throw new Error("You are already teacher!");
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
      //  update 前不要用 raw:true
      const userData = await User.findOne({
        where: { id },
      }).then((user) => {
        return user.update({ isTeacher: true });
      });
      const user = userData.toJSON();
      delete user.password;
      return cb(null, { teacher, user });
    } catch (e) {
      cb(e);
    }
  },
  // 老師的課程平均分數
  getScore: async (req, cb) => {
    try {
      const userId = req.params.id;
      let total = 0;
      const courses = await Course.findAll({
        raw: true,
        nest: true,
        where: { teacherId: userId, isDone: true },
        include: [Teacher],
      });
      const scoreArray = courses.map((item) => {
        return item.score;
      });
      scoreArray.forEach((item) => {
        total += item;
      });
      const averageScore = Math.ceil((total / scoreArray.length) * 10) / 10;
      if (!averageScore) throw new Error("Id is not valiable!");
      return cb(null, { averageScore });
    } catch (e) {
      cb(e);
    }
  },
  
  // 老師的資料(課程風格)
  getTeacher: async (req, cb) => {
    try {
      const userId = Number(req.params.id);
      const teacher = await Teacher.findOne({
        raw: true,
        nest: true,
        where: { id: userId },
        include: [User],
      });
      return cb(null, { teacher });
    } catch (e) {
      cb(e);
    }
  },
  // 已評分的課程
  getScoredCourses: async (req, cb) => {
    try {
      const userId = req.params.id;
      const scoredCourses = await Course.findAll({
        raw: true,
        nest: true,
        where: {
          [Op.and]: [{ teacherId: userId }, { score: { [Op.not]: null } }],
        },
        include: [Teacher],
      });
      return cb(null, { scoredCourses });
    } catch (e) {
      cb(e);
    }
  },
};
module.exports = teacherService;
