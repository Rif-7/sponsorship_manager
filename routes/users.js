var express = require("express");
var router = express.Router();
const auth_controller = require("../controllers/authController");
const { ensureAuth } = require("../utils/auth");

/* GET users listing. */

router.get("/student", ensureAuth, auth_controller.get_student_info);
router.post("/sign_up_student", auth_controller.signup_student);
router.post("/login_student", auth_controller.login_student);

router.get("/sponsor", ensureAuth, auth_controller.get_sponsor_info);
router.post("/sign_up_sponsor", auth_controller.signup_sponsor);
router.post("/login_sponsor", auth_controller.login_sponsor);

module.exports = router;
