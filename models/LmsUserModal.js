const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const lmsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, required: true },
    college: { type: String, required: true },
    degree: { type: String, required: true },
    degreeProgram: { type: String, required: true },
    transactionId: { type: String, required: true },
    password: { type: String, required: true },
});

lmsSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("Lms", lmsSchema);
