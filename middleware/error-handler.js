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
    console.log(0, err);
    if (err instanceof Error) {
      console.log(1,err)
      res.status(500).json({
        status: "error",
        message: `${err.name}: ${err.message}`,
      });
    } else {
      console.log(2, err);
      res.status(500).json({
        status: "error",
        message: `${err}`,
      });      
    }
    console.log(3, err);
    next(err);
  },
};
