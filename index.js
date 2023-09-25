const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const Movies = Models.Movie;
const Users = Models.User;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

const cors = require("cors");
app.use(cors());

let auth = require("./auth")(app);

const passport = require("passport");
require("./passport");

mongoose.connect("mongodb://127.0.0.1/cfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

/*
// Return list of all users
app.get("/users", async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
*/

// Read - return a list of all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Read - Return data about one movie by title to user
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Read - Return data about a genre by title
app.get(
  "/movies/genres/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.genreName })
      .then((movie) => {
        res.status(200).json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Read - Return data about a director by name

app.get(
  "/movies/director/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.directorName })
      .then((movie) => {
        res.status(200).json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Create - Add new user
/* 
We'll expect JSON in this format
{
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}
*/
app.post("/users", async (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        // If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
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

// Update a user's info by username
/* We'll expect JSON in this format
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}
*/

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Condition to check added here
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    // Condition ends
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    ) // this line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Create - add a movie to list of favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Delete - Allow users to delete a movie from their favorites
app.delete(
  "/users/:Username/movies/:MovieId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieId } },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User not found.");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Delete - Delete user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found.");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
