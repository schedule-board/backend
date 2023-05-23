const { default: mongoose } = require("mongoose");
const School = require("./school-models");
const AppError = require("../utils/app-error");

const inviteCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "A joinCode must have an code String"],
    },
    school: {
      type: mongoose.Schema.ObjectId,
      ref: "School",
      required: [true, "joinCode must have a school"],
    },
    role: {
      type: String,
      enum: {
        values: ["student", "coordinator", "owner", "teacher"],
        message: "unknown role",
      },
      required: [true, "joinCode must have a role"],
    },
    expireDate: Date,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("InviteCode", inviteCodeSchema);
