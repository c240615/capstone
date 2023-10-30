if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// 載入外部套件
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const handlebars = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const SESSION_SECRET = "secret";
const passport = require("./config/passport");

// 載入內部資料
const { pages, apis } = require("./routes");
// helpers
const { getUser } = require("./helpers/auth-helpers.js");
const handlebarsHelpers = require("./helpers/handlebars-helpers.js");

// handlebars
app.engine(
  "hbs",
  handlebars.engine({ extname: ".hbs", helpers: handlebarsHelpers })
);
app.set("view engine", "hbs");
// body-parser
app.use(express.urlencoded({ extended: true }));
// It parses incoming JSON requests and puts the parsed data in req.body.
app.use(express.json());

// session
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
// passport
app.use(passport.initialize());
app.use(passport.session());
// flash
app.use(flash());
// methodOverride
app.use(methodOverride("_method"));
// upload
app.use("/upload", express.static(path.join(__dirname, "upload")));
// 把變數設放到 res.locals 裡，讓所有的 view 都能存取
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = getUser(req);
  next();
});

// 進入分類路由
app.use("/api", apis);
app.use(pages);

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
module.exports = app;
const a = {
  status: "success",
  data: {
    user: {
      id: 1,
      name: "root",
      email: "root@example.com",
      password: "$2a$10$XAyJzmKDU1jEPOOFjlWvo.lvmh3/wYHbrW.SJNe5r6QL4P7p5psRy",
      profile: "/upload/SeaMoon.jpg",
      nation: "ROC",
      intro: "Voluptatem suscipit nostrumm qui.",
      isAdmin: true,
      isTeacher: true,
      courseHours: 5,
      createdAt: "2023-10-14T11:14:03.000Z",
      updatedAt: "2023-10-30T08:02:06.947Z",
    },
  },
};