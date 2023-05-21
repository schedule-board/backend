const { default: mongoose } = require("mongoose");
const costomValidator = require("../utils/customValidator");
const Class = require("./class-models");
const Course = require("./course-models");

const AppError = require("../utils/app-error");

const scheduleValidation = [
  {
    validator: costomValidator.scheduleValidator,
    message: "invalid schedule",
  },
  {
    validator: costomValidator.isTimeFormat,
    message: "invalid time format",
  },
];

const scheduleSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.ObjectId,
      ref: "Class",
      required: [true, "Schedule must have a class"],
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: [true, "Schedule must have a course"],
    },
    dayOfTheWeek: {
      type: [String],
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
      type: Object,
      required: [true, "Schedule must have a start time"],
      validate: scheduleValidation,
    },
    endTime: {
      type: Object,
      required: [true, "Schedule must have an end time"],
      validate: [
        ...scheduleValidation,
        {
          validator: costomValidator.isvalidDuration,
          message: "Invalid duration",
        },
      ],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

scheduleSchema.pre("find", function (next) {
  this.populate({ path: "class", select: "section" }).populate({
    path: "course",
    select: "courseTitle courseCode",
  });
  next();
});

scheduleSchema.pre("save", async function (next) {
  const cl = await Class.findOne({ _id: this.class });
  const course = await Course.findOne({ _id: this.course });
  const isDuplicate = cl.schedules.some((sc) => {
    return sc.course.courseCode === course.courseCode;
  });
  if (isDuplicate) {
    return next(new AppError("Course already used", 400));
  }
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
