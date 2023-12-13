const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer.js");
const userController = require("../../../controllers/pages/user-controller.js");

// 編輯個人資訊頁
router.get("/edit/:id", userController.getEditPage);
router.put("/putEdit/:id", upload.single("profile"), userController.putUser);

// 取得個人資訊頁
router.get("/:id", userController.getUserPage);

module.exports = router;
