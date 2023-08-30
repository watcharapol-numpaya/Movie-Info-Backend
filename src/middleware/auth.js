const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send("Access denied");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({ msg: "Token expired", isAuth: false });
        }
        return res.status(403).send({ msg: "Invalid token", isAuth: false });
      }
      req.user_id = decoded.user_id;
      next();
    });
  } catch (err) {
    return res.status(403).send({ msg: "Invalid token", isAuth: false });
  }
};

const verifyRefreshToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send("Access denied");
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({ msg: "Token expired", isAuth: false });
        }
        return res.status(403).send({ msg: "Invalid token", isAuth: false });
      }
      // console.log(decoded);
      req.user_id = decoded.user_id;
      req.username = decoded.username;
      req.token = token
   
      // console.log(req)
      next();
    });
  } catch (err) {
    return res.status(403).send({ msg: "Invalid token", isAuth: false });
  }
};

module.exports = { verifyAccessToken, verifyRefreshToken };
