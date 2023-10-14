const { getOffset, getPagination } = require("../../helpers/pagination-helper");
const { Op } = require("sequelize");
const { Teacher, User, Course } = require("../../models");

const teacherController = {
  // 取得所有教師
  getTeachers: async (req, res, next) => {
    try {
      const userId = req.user.id;
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
  beTeacherPage: (req, res) => {
    res.render("user/beTeacher");
  },
  postBeTeacher: async (req, res, next) => {
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
      throw new Error("All data are required!");
    // 新增老師資料
    await Teacher.create({
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
      userId: req.user.id,
    })
      .then(() => {
        req.flash("success_messages", "Teacher was successfully created");
        res.redirect("/teachers");
      })
      .catch((err) => next(err));
    // 改變 user is_teacher
    await User.findByPk(req.user.id)
      .then((user) => {
        user.update({ isTeacher: true });
      })
      .then(() => {
        req.flash("success_messages", "User is teacher now!");
      })
      .catch((err) => {
        next(err);
      });
  },
  getTeacherPage: async (req, res) => {
    const userId = req.user.id;
    // 老師的課程平均分數
    const courses = await Course.findAll({
      raw: true,
      nest: true,
      where: { teacherId: userId, isDone: true },
      include: [Teacher],
    });
    const scoreArray = courses.map((item) => {
      return item.score;
    });
    let total = 0;
    for (let i = 0; i < scoreArray.length; i++) {
      total += scoreArray[i];
    }
    const averageScore = total / scoreArray.length;

    // isDone = false 的課程
    const notDoneCourses = await Course.findAll({
      raw: true,
      nest: true,
      where: { teacherId: userId, isDone: false },
      include: [Teacher, User],
    });
    // 課程風格
    const teacher = await Teacher.findAll({
      raw: true,
      nest: true,
      where: { id: userId },
    });
    const style = teacher[0];
    // 已評分的課程
    const scoredCourses = await Course.findAll({
      raw: true,
      nest: true,
      where: {
        [Op.and]: [{ teacherId: userId }, { score: { [Op.not]: null } }],
      },
      include: [Teacher],
    });
    res.render("user/teacher", {
      averageScore,
      notDoneCourses,
      style,
      scoredCourses,
    });
  },
  // 前台搜尋老師
  getFilteredTeachers: async (req, res, next) => {
    const keyword = req.query.keyword.toLowerCase().trim();
    const DEFAULT_LIMIT = 9;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || DEFAULT_LIMIT;
    const offset = getOffset(limit, page);
    await Teacher.findAndCountAll({
      raw: true,
      nest: true,
      include: [User],
      limit,
      offset,
    })
      .then((teachers) => {
        const filteredTeachers = teachers.rows.filter((data) => {
          return data.User.name.toLowerCase().includes(keyword);
        });
        const count =
          filteredTeachers.length / DEFAULT_LIMIT < 9
            ? 1
            : Math.floor(filteredTeachers.length / DEFAULT_LIMIT);
        if (!filteredTeachers.length) {
          res.render("filteredTeachers", {
            filteredTeachers,
            keyword,
            pagination: getPagination(limit, page, count),
          });
        } else {
          res.render("filteredTeachers", {
            filteredTeachers,
            keyword,
            pagination: getPagination(limit, page, count),
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  },
  getEditPage: async (req, res, next) => {
    return await Teacher.findByPk(req.params.id, {
      raw: true,
      nest: true,
    })
      .then((teacher) => {
        if (!teacher) throw new Error("Teacher didn't exist!");
        res.render("user/editTeacher", { teacher });
      })
      .catch((err) => next(err));
  },
  putTeacher: (req, res, next) => {
    const {
      name,
      intro,
      style,
      courseDuration,
      link,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = req.body;
    if (!name || !intro || !style || !courseDuration || !link)
      throw new Error("Data are required!");
    console.log(req.body);
    return Promise.all([
      User.findByPk(req.user.id),
      Teacher.findByPk(req.params.id),
    ])
      .then(async ([user, teacher]) => {
        if (!user) throw new Error("User didn't exist!");
        if (!teacher) throw new Error("Teacher didn't exist!");
        await user.update({
          name,
        });
        await teacher.update({
          intro,
          style,
          courseDuration,
          link,
          monday: monday || 0,
          tuesday: tuesday || 0,
          wednesday: wednesday || 0,
          thursday: thursday || 0,
          friday: friday || 0,
          saturday: saturday || 0,
        });
      })
      .then(() => {
        req.flash("success_messages", "Data was successfully to update");
        res.redirect(`/teachers/${req.params.id}`);
      })
      .catch((e) => {
        next(e);
      });
  },
};
module.exports = teacherController;
/*   
    Promise.all([User.findByPk(req.params.id), localFileHandler(file)]).then(
      ([user, filePath]) => {
        if (!user) throw new Error("user didn't exist!");
        return user
          .update({
            name,
            nation,
            intro,
            profile: filePath || user.profile,
          })
          .then(() => {
            req.flash("success_messages", "user was successfully to update");
            res.redirect(`/users/${req.params.id}`);
          })
          .catch((err) => {
            req.flash("error_messages", "user was not successfully to update");
            next(err);
          });
      }
    );
    
    */
