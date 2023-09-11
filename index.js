const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("common"));

app.use(express.static("public"));

app.get("/movies", (req, res) => {
  res.json(topTenBooks);
});

app.get("/", (req, res) => {
  let responseText = "Welcome to myFlix";
  res.send(responseText);
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
