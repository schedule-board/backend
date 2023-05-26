const Course = require("../models/course-models");
exports.isTimeFormat = async function (val) {
  if (!/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/.test(val)) {
    if (!this.onUpdate) {
      await Course.deleteOne({ _id: this.course });
    }
    return false;
  }

  return true;
};

exports.isvalidDuration = async function (val) {
  let [Shour, Sminute] = this.startTime.split(":");
  let [ehour, eminute] = val.split(":");
  const duration =
    (Number.parseInt(ehour) - Number.parseInt(Shour)) * 60 +
    (Number.parseInt(eminute) - Number.parseInt(Sminute));
  if (duration <= 30) {
    console.log(this.onUpdate);
    if (!this.onUpdate) {
      await Course.deleteOne({ _id: this.course });
    }
    return false;
  }

  return true;
};
