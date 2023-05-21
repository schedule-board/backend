const express = require("express");
const CourseController = require("../controllers/course-controller");
const courseRouter = express.Router({ mergeParams: true });
courseRouter
  .route("/")
  .get(CourseController.getAllCourse)
  .post(CourseController.createCourse);

courseRouter
  .route("/:id")
  .get(CourseController.getOneCourse)
  .patch(CourseController.updateCourse)
  .delete(CourseController.deleteCourse);

module.exports = courseRouter;
