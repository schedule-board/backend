exports.isTimeFormat = function (val) {
  if (!/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/.test(val)) {
    return false;
  }

  return true;
};

exports.isvalidDuration = function (val) {
  let [Shour, Sminute] = this.startTime.split(":");
  let [ehour, eminute] = val.split(":");
  const duration =
    (Number.parseInt(ehour) - Number.parseInt(Shour)) * 60 +
    (Number.parseInt(eminute) - Number.parseInt(Sminute));
  if (duration <= 30) {
    return false;
  }

  return true;
};
