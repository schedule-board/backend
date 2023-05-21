const { default: mongoose } = require("mongoose");
const School = require("../models/school-models");
const AppError = require("../utils/app-error");

const classSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: [true, "A Class must have a section"],
    },
    school: {
      type: mongoose.Schema.ObjectId,
      ref: "School",
      required: [true, "Classes must have a School"],
    },
    teachers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    students: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

classSchema.virtual("schedules", {
  ref: "Schedule",
  foreignField: "class",
  localField: "_id",
});

classSchema.pre("save", async function (next) {
  const school = await School.findOne({ _id: this.school });
  const isDuplicate = school.classes.some((cl) => cl.section === this.section);
  if (isDuplicate) {
    return next(new AppError("Section name already used", 400));
  }
});

classSchema.pre("findOne", function (next) {
  this.populate({ path: "schedules" }).populate("school");
  next();
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
