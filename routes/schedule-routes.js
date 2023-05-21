const express = require("express");
const ScheduleController = require("../controllers/schedule-controllers");
const scheduleRouter = express.Router({ mergeParams: true });

scheduleRouter
  .route("/")
  .get(ScheduleController.getAllSchedule)
  .post(ScheduleController.createSchedule);

scheduleRouter
  .route("/:id")
  .get(ScheduleController.getOneSchedule)
  .patch(ScheduleController.updateSchedule)
  .delete(ScheduleController.deleteSchedule);

module.exports = scheduleRouter;
