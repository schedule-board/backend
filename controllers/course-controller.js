const Course = require("../models/course-models");
const Schedule = require("../models/schedule-models");
const Factory = require("./factoryHandler");
const catchAsync = require("../utils/catch-async");
const sendRes = require("../utils/send-response");
const AppError = require("../utils/app-error");

exports.createCourse = catchAsync(async (req, res, next) => {
  if (!req.body.school) {
    req.body.school = req.params.id;
  }

  const doc = await Course.create(req.body);

  sendRes(res, 201, doc);
});
exports.getAllCourse = catchAsync(async (req, res, next) => {
  const filter = req.params.id ? { school: req.params.id } : {};
  const doc = await Course.find(filter);
  sendRes(res, 200, doc, doc.length);
});

exports.getOneCourse = Factory.getOne(Course);

exports.updateCourse = Factory.update(Course);

exports.deleteCourse = Factory.delete(Course);

exports.createCourseAndSchedules = catchAsync(async (req, res, next) => {
  const newCourse = await Course.create({
    course_name: req.body.course_name,
    school: req.params.id,
    teacher: req.body.teacher,
  });

  // const schedules = req.body.schedules.map(
  //   async (schedule) =>
  //     await Schedule.create({
  //       course: newCourse.id,
  //       school: req.params.id,
  //       teacher: req.body.teacher,
  //       ...schedule,
  //     })
  // );
  newCourse.schedules = [];
  for (let se of req.body.schedules) {
    console.log(se);
    const sce = await Schedule.create({
      course: newCourse.id,
      school: req.params.id,
      teacher: req.body.teacher,
      ...se,
    });
    newCourse.schedules.push(sce._id);
    await newCourse.save();
  }

  newCourse.schedules = undefined;
  res.status(201).json({
    status: "success",
    course: newCourse,
  });
});

exports.getACourseAndSchedules = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({ _id: req.params.id1 });

  if (!course) {
    return next(new AppError("course not found", 404));
  }
  res.status(200).json({
    status: "success",
    course,
  });
});

exports.updateCourseAndSchedules = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({ _id: req.params.id1 });

  if (!course) {
    return next(new AppError("course not found", 404));
  }

  if (req.body.course_name) {
    course.course_name = req.body.course_name;
  }
  if (req.body.teacher) {
    course.teacher = req.body.teacher;
  }

  for (let schedule of course.schedules) {
    await Schedule.findByIdAndDelete(schedule._id);
  }

  const schedules = req.body.schedules.map(
    async (schedule) =>
      await Schedule.create({
        course: course.id,
        school: course.school._id || course.school,
        teacher: course.teacher._id || course.teacher,
        onUpdate: true,
        ...schedule,
      })
  );

  course.schedules = await Promise.all(schedules);

  const updatedCourse = await course.save();

  res.status(200).json({
    status: "success",
    updatedCourse,
  });
});

exports.deleteCourseAndSchedules = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({ _id: req.params.id1 });

  if (!course) {
    return next(new AppError("course not found", 404));
  }

  for (let schedule of course.schedules) {
    await Schedule.findByIdAndDelete(schedule._id);
  }

  await course.deleteOne();

  res.status(204).json({
    status: "success",
    course,
  });
});
