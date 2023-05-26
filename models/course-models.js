const { default: mongoose } = require("mongoose");
const School = require("../models/school-models");
const AppError = require("../utils/app-error");

const courseSchema = new mongoose.Schema(
  {
    course_name: {
      type: String,
      required: [true, "A course must have a name"],
    },
    school: {
      type: mongoose.Schema.ObjectId,
      ref: "School",
      required: [true, "a Course must have a school"],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "a Course must have a teacher"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

courseSchema.virtual("schedules", {
  ref: "Schedule",
  foreignField: "course",
  localField: "_id",
});

courseSchema.pre("find", function (next) {
  this.populate("school");
  next();
});

courseSchema.pre("findOne", function (next) {
  this.populate("school").populate("teacher").populate("schedules");
  next();
});

courseSchema.pre("save", async function (next) {
  const school = await School.findOne({ _id: this.school });
  const isDuplicate = school.courses.some((cr) => {
    return cr.course_name === this.course_name && cr.id !== this.id;
  });
  if (isDuplicate) {
    return next(new AppError("course name already used", 400));
  }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
