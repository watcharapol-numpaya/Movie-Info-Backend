require("dotenv").config();
const pool = require("../../db");
const queries = require("../queries/queries");
const {
  jwtAccessTokenGenerate,
  jwtRefreshTokenGenerate,
} = require("../services/jwtUtils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const getUser = async (req, res) => {
  await pool.query(queries.getUser, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      //   res.send(results);
      res.status(200).send(results.rows);
    }
  });
};

const getUserById = async (req, res) => {
  const user_id = req.params.user_id;
  //   res.send(user_id);
  await pool.query(queries.getUserById, [user_id], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(results.rows);
    }
  });
};

const getFavoriteMovie = async (req, res) => {
  const user_id = req.params.user_id;
  await pool.query(queries.getFavoriteMovie, [user_id], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(results.rows);
    }
  });
};

const addNewUser = async (req, res) => {
  const { username, password } = req.body;
  const encryptPassword = await bcrypt.hash(password, saltRounds);

  // Check if the user already exists in the database
  const userExistsResult = await pool.query(queries.getCheckUserExist, [
    username,
  ]);

  const existingUserCount = userExistsResult.rows[0].count;
  if (existingUserCount > 0) {
    return res
      .status(400)
      .send({ msg: "Username already exists", isRegisterPass: false });
  }

  // If user doesn't exist, insert the new user
  const insertUserQuery =
    "INSERT INTO users (username, password) VALUES($1, $2)";
  await pool.query(
    insertUserQuery,
    [username, encryptPassword],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error registering user");
      } else {
        res
          .status(201)
          .send({ msg: "Register Complete", isRegisterPass: true });
      }
    }
  );
};

const removeUser = async (req, res) => {
  const user_id = req.params.user_id;
  await pool.query(queries.removeUser, [user_id], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send("remove complete");
    }
  });
};

const addFavoriteMovie = async (req, res) => {
  const user_id = req.body.user_id;
  const favorite_movie = req.body.favorite_movie;
  await pool.query(
    queries.addFavoriteMovie,
    [favorite_movie, user_id],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send("insert complete");
      }
    }
  );
};

const removeFavoriteMovie = async (req, res) => {
  const user_id = req.body.user_id;
  const favorite_movie = req.body.favorite_movie;
  const errors = [];

  for (const movieId of favorite_movie) {
    try {
      await pool.query(queries.removeFavoriteMovie, [movieId, user_id]);
    } catch (err) {
      errors.push(err);
    }
  }

  if (errors.length > 0) {
    console.log(errors);
    res.status(500).send("Error removing favorite movies");
  } else {
    res.send("Favorite movies removed successfully");
  }
};

const getLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const results = await pool.query(queries.getLogin, [username]);

    if (results.rows.length === 1) {
      const user = results.rows[0];

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Generate a JWT token
        const access_token = jwtAccessTokenGenerate(user);
        const refresh_token = jwtRefreshTokenGenerate(user);

        // const token = jwt.sign(
        //   {
        //     user_id: user.user_id,
        //     username: user.username,
        //     favorite_movie: user.favorite_movie,
        //   },
        //   process.env.access_token,
        //   {
        //     expiresIn: "1h",
        //   }
        // );

        res.status(200).send({
          access_token: access_token,
          refresh_token: refresh_token,
          isSignInPass: true,
          msg: "Sign In Complete",
        });
      } else {
        res
          .status(401)
          .send({ isSignInPass: false, msg: "Invalid credentials" });
      }
    } else {
      res.status(401).send({ isSignInPass: false, msg: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing your request.");
  }
};

const getAuthentication = async (req, res) => {
  res.status(200).send({ msg: "Authentication Complete", isAuth: true });
 
  // try {
  //   const token = await req.headers.authorization.split(" ")[1];
  //   console.log(token);
  //   if (!token) {
  //     return res.status(401).send("Access denied");
  //   }
  //   const decoded = await jwt.verify(token, process.env.TOKEN_KEY);
  //   res.status(200).send({ decoded: decoded, msg: "Authentication Complete", isAuth: true });

  // } catch (error) {
  //   if (error.name === "TokenExpiredError") {
  //     return res.status(401).send({ msg: "Token expired", isAuth: false });
  //   }
  //   return res.status(403).send({ msg: "Invalid token", isAuth: false });
  // }
};

const getRefreshToken = async (req, res) => {
  const user_id = req.user_id;
  const username = req.username;

  try {
    const results = await pool.query(queries.getRefresh, [username, user_id]);

    if (results.rows.length === 1) {
      const user = results.rows[0];
      const access_token = jwtAccessTokenGenerate(user);
      const refresh_token = jwtRefreshTokenGenerate(user);

      res.status(200).send({
        access_token: access_token,
        refresh_token: refresh_token,
        isSignInPass: true,
        msg: "token refresh complete Complete",
      });

    } else {
      res.status(401).send({ isSignInPass: false, msg: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).send("An error occurred while processing your request.");
  }
};

module.exports = {
  getUser,
  getUserById,
  getFavoriteMovie,
  addNewUser,
  removeUser,
  addFavoriteMovie,
  removeFavoriteMovie,
  getLogin,
  getAuthentication,
  getRefreshToken,
};
