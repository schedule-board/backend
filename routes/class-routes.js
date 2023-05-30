const express = require("express");
const ClassController = require("../controllers/class-controller");
const classRouter = express.Router({ mergeParams: true });
const authController = require("../controllers/auth-controller");

classRouter
  .route("/")
  .get(authController.protect, ClassController.getAllClass)
  .post(ClassController.createClass);

classRouter
  .route("/:id2")
  .get(ClassController.getOneClass)
  .patch(ClassController.updateClass)
  .delete(ClassController.deleteClass);

module.exports = classRouter;
