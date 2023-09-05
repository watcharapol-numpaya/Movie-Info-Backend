require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtAccessTokenGenerate = (user) => {
  const accessToken = jwt.sign(
    { user_id: user.user_id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "20m", algorithm: "HS256" }
  );

  return accessToken;
};

const jwtRefreshTokenGenerate = (user) => {
  const refreshToken = jwt.sign(
    { user_id: user.user_id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d", algorithm: "HS256" }
  );

  return refreshToken;
};

module.exports = { jwtAccessTokenGenerate, jwtRefreshTokenGenerate };
