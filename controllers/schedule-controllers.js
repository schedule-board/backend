const Schedule = require("../models/schedule-models");
const Factory = require("./factoryHandler");
const sendRes = require("../utils/send-response");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");

exports.createSchedule = Factory.create(Schedule);
exports.getAllSchedule = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.query) {
    filter = req.query;
  }
  const doc = await Schedule.find(filter);
  sendRes(res, 200, doc, doc.length);
});

exports.getOneSchedule = catchAsync(async (req, res, next) => {
  const docId = req.params.id3;
  const doc = await Schedule.findOne({ _id: docId });
  if (!doc) {
    return next(new AppError("document not found!", 404));
  }
  sendRes(res, 200, doc);
});

exports.updateSchedule = catchAsync(async (req, res, next) => {
  const scheduleId = req.params.id3;
  const schedule = await Schedule.findOne({ _id: scheduleId });

  if (!schedule) {
    return next(new AppError("document not found!", 404));
  }

  if (req.user.school && req.user.school.id !== schedule.school.id) {
    return next(new AppError("You are not an authorize.", 401));
  }

  if (req.user.role === "teacher" && req.user.id !== schedule.teacher.id) {
    return next(new AppError("You are not an authorize.", 401));
  }

  for (let key in schedule) {
    if (key === "course") continue;
    if (req.body[key]) {
      schedule[key] = req.body[key];
    }
  }

  const updatedSchedule = await schedule.save();

  if (!schedule) {
    return next(new AppError("Document not found!", 404));
  }
  sendRes(res, 200, updatedSchedule);
});

exports.deleteSchedule = catchAsync(async (req, res, next) => {
  const scheduleId = req.params.id3;
  const schedule = await Schedule.findOne({ _id: scheduleId });

  if (!schedule) {
    return next(new AppError("document not found!", 404));
  }

  if (req.user.school && req.user.school.id !== schedule.school.id) {
    return next(new AppError("You are not an authorize.", 401));
  }

  await schedule.deleteOne();

  sendRes(res, 204);
});
