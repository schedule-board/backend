const express = require("express");
const morgan = require("morgan");
const globalErrorHandler = require("./controllers/global-error-handler");
const AppError = require("./utils/app-error");

const userRouter = require("./routes/user-routes");
const schoolRouter = require("./routes/school-routes");
const classRouter = require("./routes/class-routes");
const courseRouter = require("./routes/course-routes");
const scheduleRouter = require("./routes/schedule-routes");

// new
const app = express();

const mainRoute = "api/v1";

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(`/${mainRoute}/users`, userRouter);
app.use(`/${mainRoute}/schools`, schoolRouter);
app.use(`/${mainRoute}/classes`, classRouter);
app.use(`/${mainRoute}/courses`, courseRouter);
app.use(`/${mainRoute}/schedules`, scheduleRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`route not found: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
