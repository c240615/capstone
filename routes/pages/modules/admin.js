// 套件
const express = require("express");
const router = express.Router();
// controller
const adminController = require("../../../controllers/pages/admin-controller");
// 搜尋
router.get("/users/search", adminController.getSearchedUsers);
// 進入後臺首頁
router.get("/users",  adminController.getUsers);

router.use("", (req, res) => res.redirect("/admin/users"));

module.exports = router;
