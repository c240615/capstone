if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  console.log('hey it’s not prod')
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
// const db = require("./models"); // 檢查 db

// 載入內部資料
const { pages ,apis} = require("./routes");
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
  // console.log(res)
  next();
});

// 進入分類路由
app.use('/api', apis);
app.use(pages);

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
