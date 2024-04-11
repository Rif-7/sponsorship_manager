const jwt = require("jsonwebtoken");
const path = require("path");
const { body, validationResult } = require("express-validator");
const { createHash, comparePassword } = require("../utils/auth");
const Student = require("../models/Student");
const Sponsor = require("../models/Sponsor");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

exports.signup_student = [
  body("firstname")
    .isString()
    .withMessage("Invalid format")
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Firstname should be between 2-20 characters")
    .isAlphanumeric()
    .withMessage("Firstname should only contain alphanumeric characters"),
  body("lastname")
    .isString()
    .withMessage("Invalid format")
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Lastname should be between 2-20 characters")
    .isAlphanumeric()
    .withMessage("Lastname should only contain alphanumeric characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid Email")
    .escape()
    .custom(async (email) => {
      const user = await Student.findOne({ email });
      if (user) {
        throw new Error("Email already in use");
      }
    }),
  body("password")
    .isString()
    .withMessage("Invalid format")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should be atleast 6 characters"),
  async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array()[0] });
      }

      const hashedPassword = await createHash(req.body.password);
      let user = new Student({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
      });

      user = await user.save();

      const payload = {
        sub: user.id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.status(200).json({ token });
    } catch (err) {
      return next(err);
    }
  },
];

exports.signup_sponsor = [
  body("company")
    .isString()
    .withMessage("Company name is invalid.")
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Company name should be between 2-20 characters.")
    .isAlphanumeric()
    .withMessage("Company name should only contain alphanumeric characters."),
  body("contact")
    .isString()
    .withMessage("Contact number is invalid.")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Contact number is required.")
    .isAlphanumeric()
    .withMessage("Lastname should only contain alphanumeric characters."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid Email")
    .escape()
    .custom(async (email) => {
      const user = await Sponsor.findOne({ email });
      if (user) {
        throw new Error("Email already in use");
      }
    }),
  body("password")
    .isString()
    .withMessage("Invalid format")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should be atleast 6 characters"),
  async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array()[0] });
      }

      const hashedPassword = await createHash(req.body.password);
      let user = new Sponsor({
        company: req.body.company,
        contact: req.body.contact,
        email: req.body.email,
        password: hashedPassword,
      });

      user = await user.save();

      const payload = {
        sub: user.id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.status(200).json({ token });
    } catch (err) {
      return next(err);
    }
  },
];

exports.login_student = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid Email")
    .escape()
    .custom(async (email, { req }) => {
      const user = await Student.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      req.user = user;
    }),
  body("password")
    .isString()
    .withMessage("Invalid format")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should be atleast 6 characters")
    .custom(async (password, { req }) => {
      const isPassword = await comparePassword(password, req.user.password);
      if (!isPassword) {
        throw new Error("Incorrect Password");
      }
    }),
  async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array()[0] });
      }

      const payload = {
        sub: req.user.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.status(200).json({ token });
    } catch (err) {
      return next(err);
    }
  },
];

exports.login_sponsor = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid Email")
    .escape()
    .custom(async (email, { req }) => {
      const user = await Sponsor.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      req.user = user;
      req.isSponsor = true;
    }),
  body("password")
    .isString()
    .withMessage("Invalid format")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should be atleast 6 characters")
    .custom(async (password, { req }) => {
      const isPassword = await comparePassword(password, req.user.password);
      if (!isPassword) {
        throw new Error("Incorrect Password");
      }
    }),
  async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array()[0] });
      }

      const payload = {
        sub: req.user.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.status(200).json({ token });
    } catch (err) {
      return next(err);
    }
  },
];
