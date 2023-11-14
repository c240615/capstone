const courseService = require("../../services/course-services");
const teacherService = require("../../services/teacher-services.js");

const courseController = {
  getReservePage: async (req, res, next) => {
    try {
      // 教師基本資料
      const teacher = await teacherService.getTeacher(req, (err, data) => {
        if (err) {
          next(err);
        }
        return data.teacher;
      });
      // 老師的已完成課程資料
      const courseScore = await courseService.getDoneCourses(
        req,
        (err, data) => {
          if (err) {
            next(err);
          }
          return data;
        }
      );
      // 2週內可預約課程
      const final = await courseService.getCoursesInTwoWeeks(
        req,
        (err, data) => {
          if (err) {
            next(err);
          }
          return data.final;
        }
      );
      return res.render("reserve", {
        teacher,
        courseScore: courseScore.courseScore,
        averageScore: courseScore.averageScore,
        final,
      });
    } catch (e) {
      next(e);
    }
  },
  // 預約新課程
  postCourse: async (req, res, next) => {
    const userId = req.user.id;
    await courseService.postCourse(req, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success_messages", `預約成功`);
      res.redirect(`/users/${userId}`);
    });
  },
  // 評分
  postScore: async (req, res, next) => {
    const userId = req.params.id;
    await courseService.postScore(req, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success_messages", "Score was successfully update");
      res.redirect(`/users/${userId}`);
    });
  },
};
module.exports = courseController;
