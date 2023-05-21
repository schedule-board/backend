const Class = require("../models/class-models");
const Factory = require("./factoryHandler");
const sendRes = require("../utils/send-response");
const catchAsync = require("../utils/catch-async");

// exports.createClass = Factory.create(Class);

exports.createClass = catchAsync(async (req, res, next) => {
  if (!req.body.school) {
    req.body.school = req.params.schoolId;
  }
  const doc = await Class.create(req.body);
  sendRes(res, 201, doc);
});
exports.getAllClass = catchAsync(async (req, res, next) => {
  const filter = req.params.schoolId ? { school: req.params.schoolId } : {};
  const doc = await Class.find(filter);
  sendRes(res, 200, doc, doc.length);
});

exports.getOneClass = Factory.getOne(Class);
exports.updateClass = Factory.update(Class);
exports.deleteClass = Factory.delete(Class);
