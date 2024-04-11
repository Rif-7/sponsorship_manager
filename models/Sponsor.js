const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SponsorSchema = new Schema({
  company: { type: String, required: true },
  contact: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  password: { type: String, minLength: 6, required: true },
});

module.exports = mongoose.model("Sponsor", SponsorSchema);
