const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Sponsorship = require("../models/Sponsorship");

exports.request_sponsorship = [
  body("name", "Name is required").trim().isLength({ min: 1 }),
  body("amount", "Amount is required").exists().isNumeric(),
  async (req, res, next) => {
    try {
      if (req.user.isSponsor) {
        return res
          .status(409)
          .json({ error: "Sponsors can't request sponsorships." });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array()[0] });
      }

      const sponsorship = new Sponsorship({
        name: req.body.name,
        amount: req.body.amount,
        student: req.user._id,
      });

      await sponsorship.save();
      return res
        .status(200)
        .json({ success: "Sponsorship created successfully" });
    } catch (err) {
      return next(err);
    }
  },
];

exports.accept_sponsorship = async (req, res, next) => {
  try {
    if (!req.user.isSponsor) {
      return res
        .status(409)
        .json({ error: "Students can't accept sponsorships." });
    }
    if (
      !req.params.sponsorship_id ||
      !mongoose.Types.ObjectId.isValid(req.params.sponsorship_id)
    ) {
      return res
        .status(400)
        .json({ error: "Sponsorship ID is either missing or invalid." });
    }

    const sponsorship = await Sponsorship.findById(req.params.sponsorship_id);
    if (!sponsorship) {
      return res.status(404).json({ error: "Sponsorship not found." });
    }

    if (sponsorship.sponsor) {
      return res
        .status(409)
        .json({ error: "The student has already been sponsored." });
    }

    sponsorship.sponsor = req.user._id;
    await sponsorship.save();

    return res.status(200).json({ success: "Successfully sponsored student" });
  } catch (err) {
    return next(err);
  }
};

// get's all sponsorship requests waiting to be accepted
exports.get_all_sponsorship_requests = async (req, res, next) => {
  try {
    if (!req.user.isSponsor) {
      return res.status(400).json({ error: "User is not a sponsor" });
    }
    const sponsorship_list = await Sponsorship.find({ sponsor: null }).populate(
      "student",
      "firstName lastName email"
    );
    return res.status(200).json({ sponsorship_list });
  } catch (err) {
    return next(err);
  }
};

// get's all sponsorships accepted by the current sponsor
exports.get_accepted_sponsorships = async (req, res, next) => {
  try {
    if (!req.user.isSponsor) {
      return res.status(400).json({ error: "User is not a sponsor" });
    }
    const sponsorship_list = await Sponsorship.find({
      sponsor: req.user._id,
    }).populate("student", "firstName lastName email");
    return res.status(200).json({ sponsorship_list });
  } catch (err) {
    return next(err);
  }
};

// get's all sponsorships requested by the current user
exports.get_requested_sponsorships = async (req, res, next) => {
  try {
    if (req.user.isSponsor) {
      return res.status(400).json({ error: "User is not a student" });
    }

    const sponsorship_list = await Sponsorship.find({
      student: req.user._id,
    }).populate("sponsor", "company contact email");
    return res.status(200).json({ sponsorship_list });
  } catch (err) {
    return next(err);
  }
};
