exports.scheduleValidator = function (val) {
  if (Object.keys(val).length !== this.dayOfTheWeek.length) {
    return false;
  }
  for (let key in val) {
    if (!this.dayOfTheWeek.includes(key)) {
      return false;
    }
  }
  return true;
};

exports.isTimeFormat = function (val) {
  for (let key in val) {
    if (!/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/.test(val[key])) {
      return false;
    }
  }
  return true;
};

exports.isvalidDuration = function (val) {
  for (let key in val) {
    let [Shour, Sminute] = this.startTime[key].split(":");
    let [ehour, eminute] = val[key].split(":");
    const duration =
      (Number.parseInt(ehour) - Number.parseInt(Shour)) * 60 +
      (Number.parseInt(eminute) - Number.parseInt(Sminute));
    if (duration <= 30) {
      return false;
    }
  }
  return true;
};
