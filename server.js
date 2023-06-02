const mongoose = require("mongoose");
const dotENV = require("dotenv");

// process.on("uncaughtException", (err) => {
//   console.log("----uncaughtException-----");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

dotENV.config({
  path: "./config.env",
});

const app = require("./app");

// const dbUrl = process.env.MONGODB.replace(
//   "<password>",
//   process.env.MONGODB_PASSWORD
// );

const dbLocalUrl = process.env.MONGODB_LOCAL;

const db = mongoose.connect(dbLocalUrl);

db.then(() => console.log("db connects Successfully"));

const port = process.env["PORT"];

const server = app.listen(port, () => {
  console.log("server is running");
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("----unhandledRejection-----");
  server.close(() => {
    process.exit(1);
  });
});
