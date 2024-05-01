const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/adminController");
const { adminAuth } = require("../utils/auth");

router.post("/sponsors", adminAuth, admin_controller.get_all_sponsors);
router.post("/students", adminAuth, admin_controller.get_all_students);
router.post("/sponsorships", adminAuth, admin_controller.get_all_sponsorships);

router.post(
  "/sponsors/:sponsor_id",
  adminAuth,
  admin_controller.get_sponsorships_by_sponsor
);
router.post(
  "/students/:student_id",
  adminAuth,
  admin_controller.get_sponsorships_by_student
);

module.exports = router;
