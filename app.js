const express = require("express");
const morgan = require("morgan");
const globalErrorHandler = require("./controllers/global-error-handler");
const AppError = require("./utils/app-error");

const userRouter = require("./routes/user-routes");
// const schoolRouter = require("./routes/school-routes");
// const classRouter = require("./routes/class-routes");
// const courseRouter = require("./routes/course-routes");
// const scheduleRouter = require("./routes/schedule-routes");
// const roleRouter = require("./routes/roles-routes");

// new
const app = express();

const mainRoute = "api/v1";

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(`/${mainRoute}/users`, userRouter);

// app.use(`/${mainRoute}/school`, schoolRouter);
// app.use(`/${mainRoute}/class`, classRouter);
// app.use(`/${mainRoute}/course`, courseRouter);
// app.use(`/${mainRoute}/schedule`, scheduleRouter);
// app.use(`/${mainRoute}/role`, roleRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`route not found: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
