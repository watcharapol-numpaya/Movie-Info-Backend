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

const getAllUser = async (req, res) => {
  try {
    const results = await pool.query(queries.getAllUser);
    res.status(200).json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'An error occurred while fetching users.' });
  }
};


const getUserById = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const results = await pool.query(queries.getUserById, [user_id]);
    if (results.rows.length === 0) {
      res.status(404).json({ msg: 'User not found' });
    } else {
      res.status(200).json(results.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'An error occurred while fetching the user.' });
  }
};


const getFavoriteMovie = async (req, res) => {
  try {
    const { user_id } = req.body;
    const results = await pool.query(queries.getFavoriteMovie, [user_id]);
    
    if (results.rows.length === 0) {
      res.status(404).json({ msg: 'Favorite movie not found for this user' });
    } else {
      res.status(200).json(results.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'An error occurred while fetching the favorite movie.' });
  }
};


const addNewUser = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Check if the user already exists in the database
    const userExistsResult = await pool.query(queries.getCheckUserExist, [
      username,
    ]);

    const existingUserCount = userExistsResult.rows[0].count;
    if (existingUserCount > 0) {
      return res.status(400).json({ msg: "Username already exists", isRegisterPass: false });
    }

    const encryptPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    await pool.query(queries.addNewUser, [username, encryptPassword]);

    res.status(201).json({ msg: "Registration successful", isRegisterPass: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "An error occurred while registering the user" });
  }
};




const removeUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    await pool.query(queries.removeUser, [user_id]);
    res.send("Remove complete");
  } catch (error) {
    console.error(error);
    res.status(500).send({msg:"An error occurred while removing the user"});
  }
};

const addFavoriteMovie = async (req, res) => {
  const { user_id, favorite_movie } = req.body;
  try {
    // Insert the favorite movie into the database
    await pool.query(queries.addFavoriteMovie, [favorite_movie, user_id]);
    res.status(201).json({ msg: "Favorite movie added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "An error occurred while adding the favorite movie" });
  }
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
    res.status(500).send({msg:"Error removing favorite movies"});
  } else {
    res.send({msg:"Favorite movies removed successfully"});
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
        await pool.query(queries.addRefreshToken, [
          refresh_token,
          user.user_id,
        ]);

        res.status(200).send({
          access_token: access_token,
          refresh_token: refresh_token,
          is_sign_in_pass: true,
          msg: "Sign In Complete",
        });
      } else {
        res
          .status(401)
          .send({ is_sign_in_pass: false, msg: "Invalid credentials" });
      }
    } else {
      res.status(401).send({ is_sign_in_pass: false, msg: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing your request.");
  }
};

const getAuthentication = async (req, res) => {
  res.status(200).send({ msg: "Authentication Complete", is_auth: true });

  // try {
  //   const token = await req.headers.authorization.split(" ")[1];
  //   console.log(token);
  //   if (!token) {
  //     return res.status(401).send("Access denied");
  //   }
  //   const decoded = await jwt.verify(token, process.env.TOKEN_KEY);
  //   res.status(200).send({ decoded: decoded, msg: "Authentication Complete", is_auth: true });

  // } catch (error) {
  //   if (error.name === "TokenExpiredError") {
  //     return res.status(401).send({ msg: "Token expired", is_auth: false });
  //   }
  //   return res.status(403).send({ msg: "Invalid token", is_auth: false });
  // }
};

const getRefreshToken = async (req, res) => {
  const user_id = req.user_id;
  const username = req.username;
  const old_refresh_token = req.token;

  try {
    const results = await pool.query(queries.getUserByIdAndUsername, [
      username,
      user_id,
    ]);

    if (results.rows.length === 1) {
      const user = results.rows[0];

      //Check is old refresh token if yes will reject.
      if (old_refresh_token !== user.refresh_token) {
        return res.sendStatus(401);
      }

      const access_token = jwtAccessTokenGenerate(user);
      const refresh_token = jwtRefreshTokenGenerate(user);

      await pool.query(queries.addRefreshToken, [refresh_token, user.user_id]);

      res.status(200).send({
        access_token: access_token,
        refresh_token: refresh_token,
        msg: "token refresh complete Complete",
      });
    } else {
      res.status(401).send({ msg: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).send({msg:"An error occurred while processing your request."});
  }
};

module.exports = {
  getAllUser,
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
