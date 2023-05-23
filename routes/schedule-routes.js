const express = require("express");
const ScheduleController = require("../controllers/schedule-controllers");
const authController = require("../controllers/auth-controller");
const scheduleRouter = express.Router();

scheduleRouter
  .route("/")
  .get(authController.protect, ScheduleController.getAllSchedule)
  .post(authController.protect, ScheduleController.createSchedule);

scheduleRouter
  .route("/:id3")
  .get(authController.protect, ScheduleController.getOneSchedule)
  .patch(
    authController.protect,
    authController.restrictTo("owner", "teacher", "coordinator"),
    ScheduleController.updateSchedule
  )
  .delete(
    authController.protect,
    authController.restrictTo("owner", "coordinator"),
    ScheduleController.deleteSchedule
  );

module.exports = scheduleRouter;
