const { default: mongoose } = require("mongoose");
const School = require("../models/school-models");
const AppError = require("../utils/app-error");

const classSchema = new mongoose.Schema(
  {
    class_name: {
      type: String,
      required: [true, "A Class must have a Name"],
    },
    school: {
      type: mongoose.Schema.ObjectId,
      ref: "School",
      required: [true, "Classes must have a School"],
    },
    courses: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

classSchema.pre("save", async function (next) {
  const school = await School.findOne({ _id: this.school });
  const isDuplicate = school.classes.some(
    (cl) => cl.class_name === this.class_name
  );
  if (isDuplicate) {
    return next(new AppError("Section name already used", 400));
  }
});

classSchema.pre("findOne", function (next) {
  this.populate({ path: "courses" }).populate("school");
  next();
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
