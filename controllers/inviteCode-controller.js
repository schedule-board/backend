const InviteCode = require("../models/inviteCode-models");
const factoryController = require("./factoryHandler");
const sendRes = require("../utils/send-response");
const catchAsync = require("../utils/catch-async");
const shortid = require("shortid");

exports.createCode = factoryController.create(InviteCode);

exports.getAllCode = factoryController.getAll(InviteCode);

exports.getOneCode = factoryController.getOne(InviteCode);

exports.updateCode = factoryController.update(InviteCode);

exports.deleteCode = factoryController.delete(InviteCode);

exports.inviteViaCode = (role) =>
  catchAsync(async (req, res, next) => {
    const code = shortid.generate();
    console.log(code);
    const expireDate = Date.now() + 2 * 60 * 60 * 1000;
    const school = req.params.id;

    const newCode = await InviteCode.create({
      role,
      code,
      expireDate,
      school,
    });

    res.status(200).json({
      status: "success",
      code: newCode.code,
    });
  });
