const { User, Course, Teacher } = require("../../models");
const {
  getHours,
  futureDate,
  removeDuplicates,
} = require("../../helpers/date-helpers.js");

const courseController = {
  getReservePage: async (req, res, next) => {
    try {
      const teacherId = req.params.id;
      // 老師基本資料 {}
      const teacher = await Teacher.findOne({
        raw: true,
        nest: true,
        where: { id: teacherId },
        include: [User],
      });
      // 老師的課程資料 []
      const courses = await Teacher.findAll({
        raw: true,
        nest: true,
        where: { id: teacherId },
        include: [Course],
      });
      const scoredCourses = courses.filter((item) => {
        return item.Courses.score !== null;
      });
      if (!courses) {
        throw new Error("This teacher did not have a course.");
      }
      // 課程分數
      const scores = scoredCourses.map((item) => {
        return item.Courses.score;
      });
      // 老師評分
      let averageScore = 0;
      for (let i = 0; i < scores.length; i++) {
        averageScore += scores[i];
      }
      averageScore = averageScore / scores.length;
      // 課程評分
      let courseScore = scoredCourses.map((item) => {
        return { score: item.Courses.score, intro: item.intro };
      });
      // 課程持續時間
      const courseDuration = courses[0].courseDuration;
      // 取得課程間隔時間陣列
      const startHour = 18;
      const endHour = 21;
      const hourList = getHours(startHour, endHour, courseDuration);
      // 老師可預約星期 [{monday:0}]
      const weekdays = await Teacher.findAll({
        raw: true,
        nest: true,
        where: {
          id: teacherId,
        },
        attributes: [
          "monday",
          "tuesday",
          "wednesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      });
      //[1,0,1,0,1,1,0] true 1 false 0
      const available = [
        weekdays[0].sunday,
        weekdays[0].monday,
        weekdays[0].tuesday,
        weekdays[0].wednesday,
        weekdays[0].thursday,
        weekdays[0].friday,
        weekdays[0].saturday,
      ];
      console.log(weekdays);
      
      const today = Date.now();

      // 已預約時間 []
      const filteredCourses = courses
        .map((item) => {
          return item.Courses.date.getTime();
        })
        .filter((i) => i > today);

      // 未來兩週可預約時間
      const todayList = futureDate(today, courseDuration, hourList, 0);
      const week1List = futureDate(today, courseDuration, hourList, 7);
      const week2List = futureDate(today, courseDuration, hourList, 14);

      // 排序並扣除已預約
      const allDays = todayList
        .concat(week1List)
        .concat(week2List)
        .concat(filteredCourses);
      const sortDays = allDays.sort((a, b) => a - b);
      removeDuplicates(sortDays);

      // 整理格式
      const final = sortDays.map((item) => {
        return { date: new Date(item) };
      });
      return res.render("reserve", {
        teacher,
        averageScore,
        courseScore,
        final,
      });
    } catch (e) {
      next(e);
    }
  },
  postCourse: async (req, res, next) => {
    const userId = req.user.id;
    const teacherId = req.params.id;
    const { date } = req.body;

    const teacher = await Teacher.findAll({
      raw: true,
      nest: true,
      where: { id: teacherId },
    });

    const user = await User.findAll({ where: { id: userId } });

    const hours = (await user[0].courseHours) + teacher[0].courseDuration;
    await user[0].update({ courseHours: hours });
    await Course.create({
      date,
      isDone: false,
      score: null,
      comment: null,
      teacherId,
      userId,
    })
      .then(() => {
        req.flash("success_messages", `預約成功`);
        res.redirect(`/users/profile`);
      })
      .catch((e) => {
        next(e);
      });
  },
  postScore: async (req, res, next) => {
    const userId = req.user.id;
    const { courseId, score, comment } = req.body;
    if (!score || !comment) {
      throw new Error("All datas are required!");
    }
    await Course.findAll({
      where: { id: courseId, userId },
    })
      .then((course) => {
        if (course?.length > 0) {
          return course[0].update({
            score,
            comment: comment || "no comment",
          });
        }
      })
      .then(() => {
        req.flash("success_messages", "Score was successfully update");
        res.redirect(`/users/profile`);
      })
      .catch((e) => {
        next(e);
      });
  },
};

module.exports = courseController;
