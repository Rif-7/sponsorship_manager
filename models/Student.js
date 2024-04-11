const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  firstName: { type: String, required: true, minLength: 2, maxLength: 20 },
  lastName: { type: String, required: true, minLength: 2, maxLength: 20 },
  email: {
    type: String,
    required: true,
  },
  password: { type: String, minLength: 6, required: true },
});

StudentSchema.virtual("fullname").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("Student", StudentSchema);
