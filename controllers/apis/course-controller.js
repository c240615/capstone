const courseService = require("../../services/course-services");
const userController = {
  // 教師未完成課程
  getNotDoneCourses: (req, res, next) => {
    courseService.getNotDoneCourses(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data,
          });
    });
  },
  // 老師的已完成課程資料
  getDoneCourses: (req, res, next) => {
    courseService.getDoneCourses(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data,
          });
    });
  },
  // 2週內可預約課程
  getCoursesInTwoWeeks: (req, res, next) => {
    courseService.getCoursesInTwoWeeks(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data,
          });
    });
  },
  postCourse: async (req, res, next) => {
    await courseService.postCourse(req, (err, data) => {
      
      err ? next(err) : res.json({ status: "success", data });
    });
  },
  // 評分
  postScore: async (req, res, next) => {
    await courseService.postScore(req, (err, data) => {
      
      err ? next(err) : res.json({ status: "success", data });
    });
  },
};

module.exports = userController;
