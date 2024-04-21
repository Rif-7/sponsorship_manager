const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/adminController");
const { adminAuth } = require("../utils/auth");

router.get("/sponsors", adminAuth, admin_controller.get_all_sponsors);
router.get("/students", adminAuth, admin_controller.get_all_students);
router.get("/sponsorships", adminAuth, admin_controller.get_all_sponsorships);

router.get(
  "/sponsors/:sponsor_id",
  adminAuth,
  admin_controller.get_sponsorships_by_sponsor
);
router.get(
  "/students/:student_id",
  adminAuth,
  admin_controller.get_sponsorships_by_student
);

module.exports = router;
