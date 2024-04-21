const mongoose = require("mongoose");
const Sponsor = require("../models/Sponsor");
const Sponsorship = require("../models/Sponsorship");
const Student = require("../models/Student");

exports.get_all_sponsors = async (req, res, next) => {
  try {
    const sponsors = await Sponsor.find().select("-password");
    return res.status(200).json({ sponsors });
  } catch (err) {
    return next(err);
  }
};

exports.get_all_students = async (req, res, next) => {
  try {
    const students = await Student.find().select("-password");
    return res.status(200).json({ students });
  } catch (err) {
    return next(err);
  }
};

exports.get_all_sponsorships = async (req, res, next) => {
  try {
    const sponsorships = await Sponsorship.find()
      .populate("student", "firstName lastName institution email")
      .populate("sponsor", "company contact email");

    return res.status(200).json({ sponsorships });
  } catch (err) {
    return next(err);
  }
};

exports.get_sponsorships_by_sponsor = async (req, res, next) => {
  try {
    if (
      !req.params.sponsor_id ||
      !mongoose.Types.ObjectId.isValid(req.params.sponsor_id)
    ) {
      return res
        .status(400)
        .json({ error: "Sponsor ID is either missing or invalid." });
    }

    const sponsorships = await Sponsorship.find({
      sponsor: req.params.sponsor_id,
    })
      .populate("sponsor", "company contact email")
      .populate("student", "firstName lastName email institution");

    return res.status(200).json({ sponsorships });
  } catch (err) {
    return next(err);
  }
};

exports.get_sponsorships_by_student = async (req, res, next) => {
  try {
    if (
      !req.params.student_id ||
      !mongoose.Types.ObjectId.isValid(req.params.student_id)
    ) {
      return res
        .status(400)
        .json({ error: "Student ID is either missing or invalid." });
    }

    const sponsorships = await Sponsorship.find({
      student: req.params.student_id,
    })
      .populate("sponsor", "company contact email")
      .populate("student", "firstName lastName email institution");

    return res.status(200).json({ sponsorships });
  } catch (err) {
    return next(err);
  }
};
