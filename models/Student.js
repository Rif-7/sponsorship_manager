const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  firstName: { type: String, required: true, minLength: 2, maxLength: 20 },
  lastName: { type: String, required: true, minLength: 2, maxLength: 20 },
  institution: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  certificate: { type: String },
  password: { type: String, minLength: 6, required: true },
});

StudentSchema.virtual("fullname").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

StudentSchema.virtual("certificate_url").get(function () {
  if (this.certificate) {
    return `${process.env.BACKEND_URL || "http://localhost:4000"}/uploads/${
      this.certificate
    }`;
  }
  return "";
});

StudentSchema.set("toJSON", { getters: true });

module.exports = mongoose.model("Student", StudentSchema);
