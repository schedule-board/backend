const sendRes = (res, status, data, count) => {
  res.status(status).json({
    status: "success",
    count,
    data,
  });
};

module.exports = sendRes;
