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
            teacherDatas: data.teacherRows ,
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
      return data.averageScore ;
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
      return data.teacher.style ;
    });
    await courseService.getScoredCourses(req, (err, data) => {
      err
        ? next(err)
        : res.render("user/teacher", {
            averageScore,
            notDoneCourses,
            style,
            scoredCourses: data.scoredCourses ,
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
        return data.topTen ;
      });
      await teacherService.getSearchedTeachers(req, (err, data) => {
        err
          ? next(err)
          : res.render("filteredTeachers", {
              keyword: data.keyword ,
              filterDatas: data.filterDatas ,
              pagination: data.pagination,
              topTen,
            });
      });
    } catch (e) {
      next(e);
    }
  },
  getEditPage: async (req, res, next) => {
    return await teacherService.getTeacher(req, (err, data) => {
      if (err) {
        next(err);
      }
      res.render("user/editTeacher", {
        teacher: data.teacher,
      });
    });
  },
  putTeacher: (req, res, next) => {
    return teacherService.putTeacher(req, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success_messages", "修改成功！");
      res.redirect(`/teachers/${req.params.id}`);
    });
  },
};
module.exports = teacherController;
