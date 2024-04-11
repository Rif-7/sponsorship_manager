var express = require("express");
var router = express.Router();
const sponsorship_controller = require("../controllers/sponsorshipController");
const { ensureAuth } = require("../utils/auth");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ hello: "hello" });
});

router.post("/", ensureAuth, sponsorship_controller.request_sponsorship);
router.get(
  "/sponsorships/requested",
  ensureAuth,
  sponsorship_controller.get_requested_sponsorships
);

router.post(
  "/:sponsorship_id",
  ensureAuth,
  sponsorship_controller.accept_sponsorship
);
router.get(
  "/sponsorships/all",
  ensureAuth,
  sponsorship_controller.get_all_sponsorship_requests
);
router.get(
  "/sponsorships/accepted",
  ensureAuth,
  sponsorship_controller.get_accepted_sponsorships
);

module.exports = router;
