const User = require("../models/user-models");
const factoryController = require("../controllers/factoryHandler");
const sendRes = require("../utils/send-response");
const catchAsync = require("../utils/catch-async");
// const Role = require("../models/roles-models");

exports.createUser = factoryController.create(User);

exports.getAllUser = factoryController.getAll(User);

exports.getOneUser = factoryController.getOne(User);

exports.updateUser = factoryController.update(User);

exports.deleteUser = factoryController.delete(User);
