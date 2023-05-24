const Class = require("../models/class-models");
const sendRes = require("../utils/send-response");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const { findById } = require("../models/school-models");
const Schedule = require("../models/schedule-models");

exports.createClass = catchAsync(async (req, res, next) => {
  if (!req.body.school) {
    req.body.school = req.params.id;
  }

  const doc = await Class.create(req.body);

  try {
    doc.courses.forEach(async function (id) {
      const schedules = await Schedule.find({ course: id });
      schedules.forEach(async function (schedule) {
        schedule.class = doc.id;
        await schedule.save();
      });
    });
  } catch (err) {
    await doc.deleteOne();
    next(err);
  }

  sendRes(res, 201, doc);
});

exports.getAllClass = catchAsync(async (req, res, next) => {
  const filter = req.params.id ? { school: req.params.id } : {};
  const doc = await Class.find(filter);
  sendRes(res, 200, doc, doc.length);
});

exports.getOneClass = catchAsync(async (req, res, next) => {
  const id = req.params.id2;
  const doc = await Class.findOne({ _id: id });
  if (!doc) {
    return next(new AppError("document not found!", 404));
  }
  sendRes(res, 200, doc);
});

exports.updateClass = catchAsync(async (req, res, next) => {
  const docId = req.params.id2;
  const doc = await Class.findById(docId);

  for (let key in doc) {
    if (req.body[key]) {
      doc[key] = req.body[key];
    }
  }

  await doc.save();

  if (!doc) {
    return next(new AppError("Document not found!", 404));
  }
  sendRes(res, 200, doc);
});

exports.deleteClass = catchAsync(async (req, res, next) => {
  const docId = req.params.id2;
  const doc = await Class.findByIdAndDelete(docId);
  if (!doc) {
    return next(new AppError("document not found!", 404));
  }
  sendRes(res, 204);
});
