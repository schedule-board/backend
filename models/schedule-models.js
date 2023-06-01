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
      // required: [true, "Schedule must have a course"],
    },
    school: {
      type: mongoose.Schema.ObjectId,
      ref: "School",
      required: [true, "Schedule must have a school"],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Schedule must have a teacher"],
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
          message: "invalid Duration",
        },
      ],
    },
    onUpdate: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

scheduleSchema.pre("find", function (next) {
  this.populate({ path: "teacher", select: "user_name" })
    .populate({ path: "course", select: "course_name" })
    .populate({ path: "school", select: "school_name" });
  next();
});
scheduleSchema.pre("findOne", function (next) {
  this.populate({ path: "teacher", select: "user_name" })
    .populate({
      path: "school",
      select: "school_name",
    })
    .populate({ path: "course", select: "course_name" });
  next();
});

scheduleSchema.pre("save", async function (next) {
  const course = await Course.findOne({ _id: this.course });
  let isDuplicate = false;

  if (course) {
    isDuplicate = course.schedules.some(
      (sc) =>
        sc.id !== this.id &&
        sc.dayOfTheWeek === this.dayOfTheWeek &&
        sc.startTime === this.startTime
    );
  }

  console.log(isDuplicate);
  if (isDuplicate) {
    if (!this.onUpdate) {
      await course.deleteOne();
    }
    return next(new AppError("duplicate schedule"));
  }
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
