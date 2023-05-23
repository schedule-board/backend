const School = require("../models/school-models");
const Factory = require("./factoryHandler");
const sendRes = require("../utils/send-response");
const catchAsync = require("../utils/catch-async");
const User = require("../models/user-models");
const AppError = require("../utils/app-error");

exports.getAllSchool = Factory.getAll(School);
exports.getOneSchool = Factory.getOne(School);
exports.updateSchool = Factory.update(School);
exports.deleteSchool = Factory.delete(School);

exports.createSchool = catchAsync(async (req, res, next) => {
  req.body.owner = req.user._id;

  const school = await School.create(req.body);

  // const role = await Role.create(ownerRole);

  const user = await User.findById(req.user._id);

  await user.save({ validateBeforeSave: false });
  sendRes(res, 201, school);
});
