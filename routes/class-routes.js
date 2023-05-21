const express = require("express");
const ClassController = require("../controllers/class-controller");
const classRouter = express.Router({ mergeParams: true });
const scheduleRouter = require("../routes/schedule-routes");
const authController = require("../controllers/auth-controller");

classRouter.use("/:classId/schedule", authController.protect, scheduleRouter);

classRouter
  .route("/")
  .get(ClassController.getAllClass)
  .post(ClassController.createClass);

classRouter
  .route("/:id")
  .get(ClassController.getOneClass)
  .patch(ClassController.updateClass)
  .delete(ClassController.deleteClass);

module.exports = classRouter;
