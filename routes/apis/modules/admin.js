// 套件
const express = require("express");
const router = express.Router();
// controller
const adminController = require("../../../controllers/apis/admin-controller.js");
// 後台搜尋使用者
router.get("/users/search", adminController.getSearchedUsers);
// 進入後臺首頁
router.get("/users", adminController.getUsers);

router.use("", (req, res) => res.redirect("/admin/users"));

module.exports = router;
