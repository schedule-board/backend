const User = require("../models/user-models");
const catchAsync = require("../utils/catch-async");
const sendRes = require("../utils/send-response");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/app-error");
const { promisify } = require("util");
// const Role = require("../models/roles-models");

const signToken = (id, secretKey, expiresIn) => {
  return jwt.sign({ id }, secretKey, { expiresIn });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(
    newUser.id,
    process.env.JWT_SECRET_KEY,
    process.env.JWT_EXPIRE_IN
  );

  res.status(201).json({
    status: "sucess",
    token,
    user: newUser,
  });
});
