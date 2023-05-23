const User = require("../models/user-models");
const factoryController = require("../controllers/factoryHandler");
const sendRes = require("../utils/send-response");
const catchAsync = require("../utils/catch-async");

exports.createUser = factoryController.create(User);

exports.getAllUser = catchAsync(async (req, res, next) => {
  let filter = {};
  console.log(req.query);
  if (req.query) {
    filter = req.query;
  }
  const doc = await User.find(filter);
  sendRes(res, 200, doc, doc.length);
});

exports.getOneUser = factoryController.getOne(User);

exports.updateUser = factoryController.update(User);

exports.deleteUser = factoryController.delete(User);
