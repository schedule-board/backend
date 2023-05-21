const express = require("express");
const userController = require("../controllers/user-controllers");
const authController = require("../controllers/authNew-controller");
const userRouter = express.Router();

userRouter.route("/signupAsOwner").post(authController.signupOwner);
userRouter.route("/signupAsStudent").post(authController.signupStudent);
userRouter.route("/signupWithCode").post(authController.signupWithCode);
userRouter.route("/login").post(authController.login);

userRouter
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser);

userRouter
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
