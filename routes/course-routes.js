const express = require("express");
const CourseController = require("../controllers/course-controller");
const courseRouter = express.Router({ mergeParams: true });

courseRouter
  .route("/")
  .get(CourseController.getAllCourse)
  .post(CourseController.createCourseAndSchedules);

courseRouter
  .route("/:id1")
  .get(CourseController.getACourseAndSchedules)
  .patch(CourseController.updateCourseAndSchedules)
  .delete(CourseController.deleteCourseAndSchedules);

module.exports = courseRouter;
