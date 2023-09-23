const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost127.0.0.1/cfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use("/documentation", express.static("public"));

app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res) => {
  let responseText = "Welcome to myFlix";
  res.send(responseText);
});

let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: ["Forgetting Sarah Marshall"],
  },
];

let movies = [
  {
    Title: "Pride and Prejudice",
    Description:
      "Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class. Can each overcome their own pride and prejudice?",
    Genre: {
      Name: "Historical Romance",
      Description:
        "Also known as epic romance, this is a romantic story with a historical period setting, normally with a turbulent backdrop of war, revolution, or tragedy.",
    },
    Director: {
      Name: "Joe Wright",
      Bio: "Joe Wright is an English film director. He is best known for Pride & Prejudice (2005), Atonement (2007), Anna Karenina (2012), and Darkest Hour (2017)",
      Birth: 1972.0,
    },
    ImageURL:
      "https://www.imdb.com/name/nm0942504/mediaviewer/rm2925501184/?ref_=nm_ov_ph",
    Featured: false,
  },
  {
    Title: "Forgetting Sarah Marshall",
    Description:
      "Devastated Peter takes a Hawaiian vacation in order to deal with the recent break-up with his TV star girlfriend, Sarah. Little does he know, Sarah's traveling to the same resort as her ex - and she's bringing along her new boyfriend.",
    Genre: {
      Name: "Comedy",
      Description:
        "A comedy film is a category of film which emphasizes on humor. These films are designed to make the audience laugh in amusement",
    },
    Director: {
      Name: "Nicholas Stoller",
      Bio: "Nicholas Stoller is an English-American screenwriter and director. He is known best for directing the 2008 comedy Forgetting Sarah Marshall, and writing/directing its 2010 spin-off/sequel, Get Him to the Greek.",
      Birth: 1976.0,
    },
    ImageURL:
      "https://www.imdb.com/name/nm0831557/mediaviewer/rm1263192576/?ref_=nm_ov_ph",
    Featured: false,
  },
  {
    Title: "Lost in Translation",
    Description:
      "A faded movie star and a neglected young woman form an unlikely bond after crossing paths in Tokyo.",
    Genre: {
      Name: "Drama",
      Description:
        "In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.",
    },
    Director: {
      Name: "Sofia Coppola",
      Bio: "Sofia Coppola was born on May 14, 1971 in New York City, New York, USA as Sofia Carmina Coppola. She is a director, known for Somewhere (2010), Lost in Translation (2003), and Marie Antoinette (2006).",
      Birth: 1971.0,
    },
    ImageURL:
      "https://www.imdb.com/name/nm0001068/mediaviewer/rm890690560/?ref_=nm_ov_ph",
    Featured: false,
  },
  {
    Title: "Lady Bird",
    Description:
      "In 2002, an artistically inclined 17-year-old girl comes of age in Sacramento, California.",
    Genre: {
      Name: "Comedy",
      Description:
        "A comedy film is a category of film which emphasizes on humor. These films are designed to make the audience laugh in amusement",
    },
    Director: {
      Name: "Greta Gerwig",
      Bio: "Greta Gerwig is an American actress, playwright, screenwriter, and director. She has collaborated with Noah Baumbach on several films, including Greenberg (2010), Frances Ha (2012), for which she earned a Golden Globe nomination, and Mistress America (2015)",
      Birth: 1983.0,
    },
    ImageURL: "https://www.imdb.com/name/nm1950086/?ref_=nmbio_ov_i",
    Featured: false,
  },
  {
    Title: "About Time",
    Description:
      "At the age of 21, Tim discovers he can travel in time and change what happens and has happened in his own life. His decision to make his world a better place by getting a girlfriend turns out not to be as easy as you might think.",
    Genre: {
      Name: "Drama",
      Description:
        "In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.",
    },
    Director: {
      Name: "Richard Curtis",
      Bio: "Richard Curtis was born on November 8, 1956 in Wellington, New Zealand. He is a writer and producer, known for Love Actually (2003), Four Weddings and a Funeral (1994) and About Time (2013).",
      Birth: 1956.0,
    },
    ImageURL: "https://www.imdb.com/name/nm0193485/?ref_=nmbio_ov_i",
    Featured: false,
  },
];

// Read - return a list of all movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// Read - Return data about a movie title to user
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie");
  }
});

// Read - Return data about a genre by title
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});

// Read - Return data about a director by name
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("no such director");
  }
});

//Create - Add new user
/* 
We'll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}
*/
app.post("/users", async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});
// OLD  CODE for above
// app.post("/users", (req, res) => {
//   const newUser = req.body;

//   if (newUser.name) {
//     newUser.id = uuid.v4();
//     users.push(newUser);
//     res.status(201).json(newUser);
//   } else {
//     res.status(400).send("users need names");
//   }
// });

// Update - Allow users to update info, specifically name
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("no such user");
  }
});

// Create - Allow users to add a movie to their list of favorites
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("no such user");
  }
});

// Delete - Allow users to delete a movie from their favorites
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("no such user");
  }
});

// Delete - Allow users to deregister
app.delete("/users/:id/", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send("no such user");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
