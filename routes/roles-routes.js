const express = require("express");
const roleController = require("../controllers/roles-controllers");
const roleRouter = express.Router({ mergeParams: true });
roleRouter
  .route("/")
  .get(roleController.getAllRole)
  .post(roleController.createRole);

roleRouter
  .route("/:id")
  .get(roleController.getOneRole)
  .patch(roleController.updateRole)
  .delete(roleController.deleteRole);

module.exports = roleRouter;
