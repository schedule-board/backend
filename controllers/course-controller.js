const Course = require("../models/course-models");
const Factory = require("./factoryHandler");
const catchAsync = require("../utils/catch-async");
const sendRes = require("../utils/send-response");

exports.createCourse = catchAsync(async (req, res, next) => {
  if (!req.body.school) {
    req.body.school = req.params.schoolId;
  }
  const doc = await Course.create(req.body);
  sendRes(res, 201, doc);
});
exports.getAllCourse = catchAsync(async (req, res, next) => {
  const filter = req.params.schoolId ? { school: req.params.schoolId } : {};
  const doc = await Course.find(filter);
  sendRes(res, 200, doc, doc.length);
});

exports.getOneCourse = Factory.getOne(Course);
exports.updateCourse = Factory.update(Course);
exports.deleteCourse = Factory.delete(Course);
