const { default: mongoose } = require("mongoose");
const School = require("../models/school-models");
const AppError = require("../utils/app-error");

const codeSchema = new mongoose.Schema(
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
