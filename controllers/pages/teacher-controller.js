// model
const { Teacher, User } = require("../../models");
// service
const teacherService = require("../../services/teacher-services.js");
const userService = require("../../services/user-services.js");
const courseService = require("../../services/course-services.js");

const teacherController = {
  // 取得所有教師
  getTeachers: async (req, res, next) => {
    // 排行榜
    const topTen = await userService.getTopUsers(req, (err, data) => {
      if (err) {
        next(err);
      }
      return data.topTen;
    });
    // 所有教師
    await teacherService.getTeachers(req, (err, data) => {
      err
        ? next(err)
        : res.render("teachers", {
            teacherDatas: data.teacherRows,
            pagination: data.pagination,
            topTen,
          });
    });
  },
  // 成為老師頁
  beTeacherPage: (req, res) => {
    res.render("user/beTeacher");
  },
  // 成為老師
  postBeTeacher: (req, res, next) => {
    teacherService.postBeTeacher(req, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success_messages", "Teacher was successfully created");
      res.redirect("/teachers");
    });
  },
  // 教師課程資料
  getTeacherPage: async (req, res, next) => {
    const averageScore = await teacherService.getScore(req, (err, data) => {
      if (err) {
        next(err);
      }
      return data.averageScore;
    });
    const notDoneCourses = await courseService.getNotDoneCourses(
      req,
      (err, data) => {
        if (err) {
          next(err);
        }
        
        return data.notDoneCourses;
      }
    );  
    const style = await teacherService.getTeacher(req, (err, data) => {
      if (err) {
        next(err);
      }
      return data.teacher.style;
    });
    await teacherService.getScoredCourses(req, (err, data) => {
      err
        ? next(err)
        : res.render("user/teacher", {
            averageScore,
            notDoneCourses,
            style,
            scoredCourses: data.scoredCourses,
          });
    });
  },
  // 前台搜尋老師
  getSearchedTeachers: async (req, res, next) => {
    try {
      // 排行榜
      const topTen = await userService.getTopUsers(req, (err, data) => {
        if (err) {
          next(err);
        }
        return data.topTen;
      });

      await teacherService.getSearchedTeachers(req, (err, data) => {
        err
          ? next(err)
          : res.render("filteredTeachers", {
              filterDatas: data.filterDatas,
              pagination: data.pagination,
              topTen,
            });
      });
    } catch (e) {
      next(e);
    }
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
