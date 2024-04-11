const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SponsorshipSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  sponsor: { type: Schema.Types.ObjectId, ref: "Sponsor", required: false },
});

module.exports = mongoose.model("Sponsorship", SponsorshipSchema);
