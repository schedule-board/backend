const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  user_name: {
    unique: true,
    type: String,
    required: [true, "A user must have a username"],
  },
  user_email: {
    unique: true,
    type: String,
    unique: true,
    lowerCase: true,
    required: [true, "A user must have an email"],
    validate: [validator.isEmail, "Invalid Email"],
  },
  role: {
    type: String,
    enum: {
      values: ["student", "coordinator", "owner", "teacher"],
      message: "unknown role",
    },
    required: [true, "User must have a role"],
  },
  password: {
    type: String,
    select: false,
    minLength: [8, "password should contain at least 8 characters"],
    required: [true, "A user must have password"],
  },
  school: {
    type: mongoose.Schema.ObjectId,
    ref: "School",
  },
});

userSchema.methods.isCorrectPassword = async function (
  cadidatePassword,
  userPassword
) {
  return await bcrypt.compare(cadidatePassword, userPassword);
};

userSchema.pre("findOne", function (next) {
  this.populate("school");
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
