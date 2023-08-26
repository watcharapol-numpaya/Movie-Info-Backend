const pool = require("../../db");
const queries = require("../queries/queries");

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
  const userId = req.params.userId;
  //   res.send(userId);
  await pool.query(queries.getUserById, [userId], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(results.rows);
    }
  });
};

const getFavoriteMovie = async (req, res) => {
  const userId = req.params.userId;
  await pool.query(queries.getFavoriteMovie, [userId], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(results.rows);
    }
  });
};

const addNewUser = async (req, res) => {
 
  const username = req.body.username;
  const password = req.body.password;
  await pool.query(queries.addNewUser, [username, password], (err, results) => {
    if (err) {
      console.log(err);
      console.log(req);
    } else {
      res.send("Value insert");
    }
  });
};

const removeUser = async (req, res) => {
  const userId = req.params.userId;
  await pool.query(queries.removeUser, [userId], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send("remove complete");
    }
  });
};

const addFavoriteMovie = async (req, res) => {
  const userId = req.body.userId;
  const favorite_movie = req.body.favorite_movie;
  await pool.query(queries.addFavoriteMovie, [favorite_movie, userId], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send("insert complete");
    }
  });
};

const removeFavoriteMovie = async (req, res) => {
  const userId = req.body.userId;
  const favoriteMovie = req.body.favoriteMovie;
  await pool.query(queries.removeFavoriteMovie, [favoriteMovie, userId], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send("remove complete");
    }
  });
};

const getLogin = async (req, res) => {
 
  const username = req.body.username;
  const password = req.body.password;
  await pool.query(queries.addNewUser, [username, password], (err, results) => {
    if (err) {
      console.log(err);
      console.log(req);
    } else {
      res.send("Value insert");
    }
  });
};


module.exports = {
  getUser,
  getUserById,
  getFavoriteMovie,
  addNewUser,
  removeUser,
  addFavoriteMovie,
  removeFavoriteMovie,
};
