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
const { getUser } = require("./helpers/auth-helpers");
const handlebarsHelpers = require("./helpers/handlebars-helpers");

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

const a = {
  status: "success",
  keyword: "user1",
  filterData: [
    {
      id: 2,
      name: "user1",
      email: "user1@example.com",
      password: "$2a$10$cZa.zKGKxJ4zri/LZFQmW.Y4FHywHzpTYo3lKNn.CZBfNkvhvpO9.",
      profile:
        "https://www.shutterstock.com/image-vector/man-icon-vector-250nw-1040084344.jpg",
      nation: "ROC",
      intro:
        "Quaerat voluptatibus enim.\nIpsum at aut est est velit voluptatem natus sed.\nIllo sit cum voluptatem officiis.",
      isAdmin: 0,
      isTeacher: 1,
      courseHours: 5,
      createdAt: "2023-10-14T11:14:03.000Z",
      updatedAt: "2023-10-14T11:14:03.000Z",
    },
  ],
  pagination: {
    pages: [1, 2, 3, 4],
    totalPage: 4,
    currentPage: 1,
    prev: 1,
    next: 2,
  },
};