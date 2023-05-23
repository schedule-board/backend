const { default: mongoose } = require("mongoose");
const costomValidator = require("../utils/customValidator");
const Class = require("./class-models");
const Course = require("./course-models");

const AppError = require("../utils/app-error");

const scheduleSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: [true, "Schedule must have a course"],
    },
    school: {
      type: mongoose.Schema.ObjectId,
      ref: "School",
      required: [true, "Schedule must have a course"],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Schedule must have a course"],
    },
    dayOfTheWeek: {
      type: String,
      lowercase: true,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: [true, "Schedule must have a dayOfTheWeek"],
    },
    startTime: {
      type: String,
      required: [true, "Schedule must have a start time"],
      validate: [costomValidator.isTimeFormat, "invalid time format"],
    },
    endTime: {
      type: String,
      required: [true, "Schedule must have an end time"],
      validate: [
        {
          validator: costomValidator.isTimeFormat,
          message: "invalid time format",
        },
        {
          validator: costomValidator.isvalidDuration,
          message: "Invalid duration",
        },
      ],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

scheduleSchema.pre("findOne", function (next) {
  this.populate({ path: "course" })
    .populate({ path: "school" })
    .populate({ path: "teacher" });
  next();
});

scheduleSchema.pre("save", async function (next) {
  const course = await Course.findOne({ _id: this.course });
  const isDuplicate = course.schedules.some(
    (sc) =>
      sc.id !== this.id &&
      sc.day === this.day &&
      sc.startTime === this.startTime
  );

  if (isDuplicate) {
    return next(new AppError("duplicate schedule"));
  }
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
