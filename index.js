const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/movies", (req, res) => {
  res.json(topTenBooks);
});

app.get("/", (req, res) => {
  res.send("Welcome to myFlix");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
