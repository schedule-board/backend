const Schedule = require("../models/schedule-models");
const Factory = require("./factoryHandler");
const sendRes = require("../utils/send-response");
const catchAsync = require("../utils/catch-async");

exports.createSchedule = catchAsync(async (req, res, next) => {
  if (!req.body.class) {
    req.body.class = req.params.classId;
  }
  const doc = await Schedule.create(req.body);
  sendRes(res, 201, doc);
});
exports.getAllSchedule = catchAsync(async (req, res, next) => {
  const filter = req.params.classId ? { class: req.params.classId } : {};
  const doc = await Schedule.find(filter);
  sendRes(res, 200, doc, doc.length);
});

exports.getOneSchedule = Factory.getOne(Schedule);
exports.updateSchedule = Factory.update(Schedule);
exports.deleteSchedule = Factory.delete(Schedule);
