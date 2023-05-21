const School = require("../models/school-models");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const sendRes = require("../utils/send-response");

exports.create = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);
    sendRes(res, 201, doc);
  });

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.find({});
    sendRes(res, 200, doc, doc.length);
  });

exports.getOne = (model) =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;
    const doc = await model.findOne({ _id: docId });
    if (!doc) {
      return next(new AppError("document not found!", 404));
    }
    sendRes(res, 200, doc);
  });

exports.update = (model) =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;
    const doc = await model.findByIdAndUpdate(docId, req.body, {
      runValidators: true,
      new: true,
    });
    if (!doc) {
      return next(new AppError("Document not found!", 404));
    }
    sendRes(res, 200, doc);
  });

exports.delete = (model) =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;
    const doc = await model.findByIdAndDelete(docId);
    if (!doc) {
      return next(new AppError("document not found!", 404));
    }
    sendRes(res, 204);
  });
