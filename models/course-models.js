const { default: mongoose } = require("mongoose");
const School = require("../models/school-models");
const AppError = require("../utils/app-error");

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: [true, "A course must have a title"],
    },
    courseCode: {
      type: String,
      required: [true, "A course must have a code"],
    },
    creditHour: {
      type: Number,
      min: [1, "A credit hour must be greater than 0, you got {VALUE}"],
      max: [5, "A credit hour must be less than 6, you got {VALUE}"],
      required: [true, "A course must have a credit hour"],
    },
    ECTS: {
      type: Number,
      min: [1, "A Ects must be greater than 0, you got {VALUE}"],
      max: [9, "A Ects must be less than 6, you got {VALUE}"],
      required: [true, "A course must have a ECTs"],
    },
    school: {
      type: mongoose.Schema.ObjectId,
      ref: "School",
      required: [true, "a Course must have a school"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

courseSchema.pre("findOne", function (next) {
  this.populate("school");
  next();
});

courseSchema.pre("save", async function (next) {
  const school = await School.findOne({ _id: this.school });
  const isDuplicate = school.courses.some(
    (cr) => cr.courseCode === this.courseCode
  );
  if (isDuplicate) {
    return next(new AppError("course code already used", 400));
  }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
