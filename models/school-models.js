const { default: mongoose } = require("mongoose");
const validator = require("validator");
const schoolSchema = new mongoose.Schema(
  {
    school_name: {
      type: String,
      required: [true, "A school must have a name"],
    },
    school_email: {
      type: String,
      unique: true,
      lowercase: [true, "A school must be in lowercase"],
      required: [true, "A school must have a name"],
      validate: [validator.isEmail, "Invalid email"],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schoolSchema.virtual("classes", {
  ref: "Class",
  foreignField: "school",
  localField: "_id",
});

schoolSchema.virtual("courses", {
  ref: "Course",
  foreignField: "school",
  localField: "_id",
});

schoolSchema.pre("findOne", function (next) {
  this.populate({ path: "courses" }).populate({ path: "classes" });
  next();
});

const School = mongoose.model("School", schoolSchema);

module.exports = School;
