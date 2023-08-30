const getAllUser = "SELECT * FROM users";
const getUserById = "SELECT * FROM users WHERE user_id = $1";
const getFavoriteMovie = `SELECT favorite_movie FROM users WHERE user_id = $1`;
const addNewUser = `INSERT INTO users (username, password) VALUES($1, $2);`;
const removeUser = `DELETE FROM users WHERE user_id = $1`;
const addFavoriteMovie = `
  UPDATE users
  SET favorite_movie = (
    SELECT array_agg(DISTINCT movieId)
    FROM unnest(array_cat(favorite_movie, $1::int[])) AS movieId
  )
  WHERE user_id = $2
  RETURNING *;
`;

const removeFavoriteMovie = `
UPDATE users
SET favorite_movie = array_remove(favorite_movie, $1)
WHERE user_id = $2;
`;

const getLogin = `SELECT * FROM users WHERE username = $1`;
const getCheckUserExist =
  "SELECT COUNT(*) AS count FROM users WHERE username = $1";
const getUserByIdAndUsername = `SELECT * FROM users WHERE username = $1 AND user_id = $2`;
const addRefreshToken = `UPDATE users SET refresh_token = $1 WHERE user_id = $2;`;
 
module.exports = {
  getAllUser,
  getUserById,
  getFavoriteMovie,
  addFavoriteMovie,
  removeFavoriteMovie,
  addNewUser,
  removeUser,
  getLogin,
  getCheckUserExist,
  getUserByIdAndUsername,
  addRefreshToken,
 
};
