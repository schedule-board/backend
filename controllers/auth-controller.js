const User = require("../models/user-models");
const School = require("../models/school-models");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const InviteCode = require("../models/inviteCode-models");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

exports.signupOwner = catchAsync(async (req, res, next) => {
  const { school_name, school_email, user_name, user_email, password } =
    req.body;

  if (!school_name || !user_name || !user_email || !password) {
    return next(new AppError("invalid input", 400));
  }

  let newUser = await User.create({
    user_name,
    user_email,
    password,
    role: "owner",
  });
  let newSchool;
  try {
    newSchool = await School.create({
      school_name,
      school_email,
      owner: newUser._id,
    });
  } catch (err) {
    await newUser.deleteOne();
    next(err);
  }

  newUser.school = newSchool._id;

  await newUser.save();

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "sucess",
    token,
    user: newUser,
    school: newSchool,
  });
});

exports.signupStudent = catchAsync(async (req, res, next) => {
  req.body.role = "student";
  const newUser = await User.create(req.body);

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

  res.status(201).json({
    status: "sucess",
    token,
    user: newUser,
  });
});

exports.signupWithCode = catchAsync(async (req, res, next) => {
  const joinCode = await InviteCode.findOne({ code: req.body.code });

  if (!joinCode) {
    return next(new AppError("invalid code"), 400);
  }

  if (joinCode.expireDate < Date.now()) {
    return next(new AppError("The code is expire! please get new code."), 400);
  }

  const newUser = await User.create({
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    password: req.body.password,
    role: joinCode.role,
    school: joinCode.school,
  });

  joinCode.deleteOne();

  const school = await School.findById(joinCode.school);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "sucess",
    token,
    user: newUser,
    school,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ user_email: req.body.user_email }).select(
    "+password"
  );

  if (!user) {
    return next(new AppError("email or password incorrect", 400));
  }
  const correctPassword = await user.isCorrectPassword(
    req.body.password,
    user.password
  );

  if (!correctPassword) {
    return next(new AppError("username or password incorrect", 400));
  }

  let school;
  if (!(user.role === "student")) {
    school = await School.findById(
      user.school.id ? user.school.id : user.school
    );
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "sucess",
    token,
    user,
    school,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("your are not logged in, please login to access! ", 401)
    );
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  const user = await User.findOne({ _id: decode.id });

  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = user;
  next();
});

exports.restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (req.params.id && !(req.params.id === req.user.school.id)) {
      return next(new AppError("You are not an authorize.", 401));
    }

    let isAuthorize = false;
    for (let role of roles) {
      if (req.user.role === role) {
        isAuthorize = true;
        break;
      }
    }

    if (!isAuthorize) {
      return next(new AppError("You are not an authorize.", 401));
    }

    next();
  });
