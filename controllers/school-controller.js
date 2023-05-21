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

  const ownerRole = {
    role: "admin",
    school: school.id,
    user: req.user._id,
  };
  // const role = await Role.create(ownerRole);

  const user = await User.findById(req.user._id);

  console.log(user);

  user.schools.push(school.id);

  await user.save({ validateBeforeSave: false });
  sendRes(res, 201, school);
});

exports.adminRequest = catchAsync(async (req, res, next) => {
  const schoolCode = req.body.schoolCode;
  const schoolName = req.body.schoolName;
  const school = await School.findOne({ schoolCode, schoolName });
  console.log(school);
  if (!school) {
    return next(new AppError("school not found", 400));
  }

  school.pendingSubAdminRequests.push(req.user.id);

  await school.save();

  res.status(200).json({
    status: "success",
    message: "Request are successfully delivered",
  });
});

exports.approveAdminRequest = catchAsync(async (req, res, next) => {
  const schoolId = req.params.schoolId;
  const userId = req.params.userId;
  console.log(schoolId);
  const school = await School.findOne({ _id: schoolId });
  console.log(school);

  if (!school) {
    return next(new AppError("school not found", 400));
  }
  const index = school.pendingSubAdminRequests.indexOf(userId);
  school.pendingSubAdminRequests.splice(index, 1);

  school.subAdmins.push(userId);
  await school.save();

  const role = {
    role: "subAdmin",
    school: schoolId,
    user: userId,
  };

  // await Role.create(role);

  res.status(200).json({
    status: "success",
    message: "user successfully add to subadmin",
    school,
  });
});
