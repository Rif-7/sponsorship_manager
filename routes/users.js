var express = require("express");
var router = express.Router();
const auth_controller = require("../controllers/authController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/sign_up_student", auth_controller.signup_student);
router.post("/sign_up_sponsor", auth_controller.signup_sponsor);
router.post("/login_student", auth_controller.login_student);
router.post("/login_sponsor", auth_controller.login_sponsor);

module.exports = router;
