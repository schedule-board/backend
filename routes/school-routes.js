const express = require("express");
const schoolController = require("../controllers/school-controller");
const courseRouter = require("../routes/course-routes");
const classRouter = require("../routes/class-routes");
const authController = require("../controllers/auth-controller");

const schoolRouter = express.Router();

schoolRouter.use("/:schoolId/course", authController.protect, courseRouter);
schoolRouter.use("/:schoolId/class", authController.protect, classRouter);
schoolRouter
  .route("/:schoolId/approveAdmin/:userId")
  .get(authController.protect, schoolController.approveAdminRequest);
schoolRouter
  .route("/adminrequest")
  .post(authController.protect, schoolController.adminRequest);

schoolRouter
  .route("/")
  .get(schoolController.getAllSchool)
  .post(authController.protect, schoolController.createSchool);

schoolRouter
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    schoolController.getOneSchool
  )
  .patch(schoolController.updateSchool)
  .delete(schoolController.deleteSchool);

module.exports = schoolRouter;
