const AppError = require("../utils/app-error");

const errSendToDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stackTrace: err.stack,
  });
};
const errSendToProd = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
const ValidationErrorHandler = (error) => {
  let errmessage = "";
  for (key in error.errors) {
    errmessage += `[${error.errors[key].message}], `;
  }
  return new AppError(errmessage, 400);
};

const CastErrorHandler = (error) => {
  return new AppError(`No user found by this ID:${error.stringValue}`, 400);
};

const DuplicateKeyErrorHandler = (error) => {
  return new AppError(
    `${
      error.keyValue.username ? error.keyValue.username : error.keyValue.email
    } is alrady used!`,
    400
  );
};

const JsonWebTokenErrorHandler = (error) => {
  return new AppError(`Invalid token! please login again.`, 401);
};

const TokenExpiredErrorHandler = (err) =>
  new AppError(`Your token has expire! please login again.`, 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    errSendToDev(res, err);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.isOperational) {
      errSendToProd(res, err);
    } else if (err.name === "CastError") {
      error = CastErrorHandler(error);
      errSendToProd(res, error);
    } else if (err.name === "ValidationError") {
      error = ValidationErrorHandler(error);
      errSendToProd(res, error);
    } else if (err.code === 11000) {
      error = DuplicateKeyErrorHandler(error);
      errSendToProd(res, error);
    } else if (err.name === "JsonWebTokenError") {
      error = JsonWebTokenErrorHandler(error);
      errSendToProd(res, error);
    } else if (err.name === "TokenExpiredError") {
      error = TokenExpiredErrorHandler(error);
      errSendToProd(res, error);
    } else {
      res.status(err.statusCode).json({
        status: err.status,
        message: "Something is very wrong!",
      });
    }
  }
};
