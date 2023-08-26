const getUser = "SELECT * FROM users";
const getUserById = "SELECT * FROM users WHERE userid = $1";
const getFavoriteMovie = `SELECT favorite_movie FROM users WHERE userId = $1`;
const addNewUser = `INSERT INTO users (username, password) VALUES($1, $2);`;
const removeUser = `DELETE FROM users WHERE userId = $1`;
const addFavoriteMovie = `
  UPDATE users
  SET favorite_movie = (
    SELECT array_agg(DISTINCT movieId)
    FROM unnest(array_cat(favorite_movie, $1::int[])) AS movieId
  )
  WHERE userId = $2
  RETURNING *;
`;

const removeFavoriteMovie = `
UPDATE users
SET favorite_movie = array_remove(favorite_movie, $1)
WHERE userId = $2;
`;


module.exports = {
  getUser,
  getUserById,
  getFavoriteMovie,
  addFavoriteMovie,
  removeFavoriteMovie,
  addNewUser,
  removeUser,
};
