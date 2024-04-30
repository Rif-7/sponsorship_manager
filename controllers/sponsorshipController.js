const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Sponsorship = require("../models/Sponsorship");
const Student = require("../models/Student");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the folder where you want to save the images
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = uuidv4() + ext; // Generate a UUID and append the file extension
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

exports.request_sponsorship = [
  body("name", "Name is required").trim().isLength({ min: 1 }),
  body("amount", "Amount is required").exists().isNumeric(),
  body("description", "Description is required").trim().isLength({ min: 1 }),
  async (req, res, next) => {
    try {
      if (req.isSponsor) {
        return res
          .status(409)
          .json({ error: "Sponsors can't request sponsorships." });
      }

      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array()[0] });
      }

      const sponsorship = new Sponsorship({
        name: req.body.name,
        amount: req.body.amount,
        description: req.body.description,
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
    if (!req.isSponsor) {
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
    if (!req.isSponsor) {
      return res.status(400).json({ error: "User is not a sponsor" });
    }
    const sponsorship_list = await Sponsorship.find({ sponsor: null }).populate(
      "student",
      "-password"
    );
    return res.status(200).json({ sponsorship_list });
  } catch (err) {
    return next(err);
  }
};

// get's all sponsorships accepted by the current sponsor
exports.get_accepted_sponsorships = async (req, res, next) => {
  try {
    if (!req.isSponsor) {
      return res.status(400).json({ error: "User is not a sponsor" });
    }
    const sponsorship_list = await Sponsorship.find({
      sponsor: req.user._id,
    }).populate("student", "-password");
    return res.status(200).json({ sponsorship_list });
  } catch (err) {
    return next(err);
  }
};

// get's all sponsorships requested by the current user
exports.get_requested_sponsorships = async (req, res, next) => {
  try {
    if (req.isSponsor) {
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

exports.remove_sponsorship = async (req, res, next) => {
  try {
    if (req.isSponsor) {
      return res
        .status(409)
        .json({ error: "Sponsors can't remove sponsorships." });
    }
    if (
      !req.params.sponsorship_id ||
      !mongoose.Types.ObjectId.isValid(req.params.sponsorship_id)
    ) {
      return res
        .status(400)
        .json({ error: "Sponsorship ID is either missing or invalid." });
    }

    await Sponsorship.findOneAndDelete({
      _id: req.params.sponsorship_id,
      student: req.user._id,
    });
    return res
      .status(200)
      .json({ success: "Sponsorship removed successfuly." });
  } catch (err) {
    return next(err);
  }
};

exports.upload_student_certificate = [
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (req.user.isSponsor) {
        return res
          .status(409)
          .json({ error: "Sponsor accounts can't upload certificates." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Certificate not found" });
      }

      const user = await Student.findById(req.user._id);
      user.certificate = req.file.filename;
      await user.save();

      const imageURL = `${
        process.env?.BACKEND_URL || "http://localhost:4000"
      }/uploads/${req.file.filename}`;
      res.json({ imageURL });
    } catch (err) {
      return next(err);
    }
  },
];
