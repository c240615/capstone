module.exports = {
  generalErrorHandler(err, req, res, next) {
    // 判斷傳入的 err 是不是一個 Error 物件
    if (err instanceof Error) {
      req.flash("error_messages", `${err.name}: ${err.message}`);
    } else {
      // 如果不是，直接把字串印出來
      req.flash("error_messages", `${err}`);
    }
    res.redirect("back");
    next(err);
  },
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      res.status(500).json({
        status: "error",
        message: `${err.name}: ${err.message}`,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: `${err}`,
      });
    }
    next(err);
  },
};
