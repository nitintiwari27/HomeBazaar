const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String, // ✅ Capital 'S', not from Joi
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
