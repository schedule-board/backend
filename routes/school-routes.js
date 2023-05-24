const express = require("express");
const schoolController = require("../controllers/school-controller");
const courseRouter = require("../routes/course-routes");
const classRouter = require("../routes/class-routes");
const authController = require("../controllers/auth-controller");
const inviteCode = require("../controllers/inviteCode-controller");

const schoolRouter = express.Router();

schoolRouter.use("/:id/courses", courseRouter);

schoolRouter.use(
  "/:id/classes",
  authController.protect,
  authController.restrictTo("owner", "coordinator"),
  classRouter
);

schoolRouter
  .route("/:id/inviteTeacher")
  .get(
    authController.protect,
    authController.restrictTo("owner"),
    inviteCode.inviteViaCode("teacher")
  );

schoolRouter
  .route("/:id/inviteCoordinator")
  .get(
    authController.protect,
    authController.restrictTo("owner"),
    inviteCode.inviteViaCode("coordinator")
  );

schoolRouter
  .route("/")
  .get(schoolController.getAllSchool)
  .post(authController.protect, schoolController.createSchool);

schoolRouter
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("owner", "coordinator"),
    schoolController.getOneSchool
  )
  .patch(
    authController.protect,
    authController.restrictTo("owner"),
    schoolController.updateSchool
  )
  .delete(
    authController.protect,
    authController.restrictTo("owner"),
    schoolController.deleteSchool
  );

module.exports = schoolRouter;
