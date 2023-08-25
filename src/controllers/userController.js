const pool = require("../../db");

const getUsers = async (req, res) => {
//   await pool.query("SELECT * FROM users", (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
res.send(pool)
};

const getFavoriteMovie = () => {};

module.exports = {
  getUsers,
};
