const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use("/documentation", express.static("public"));

app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res) => {
  let responseText = "Welcome to myFlix";
  res.send(responseText);
});

app.get("/movies", (req, res) => {
  res.json(topTenBooks);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
