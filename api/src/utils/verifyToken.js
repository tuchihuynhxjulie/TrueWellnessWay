const jwt = require("jsonwebtoken");
const errorHandler = require("./error");
const { User, Product } = require("../models");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token || req.headers["authorization"];

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token || req.headers["authorization"];

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    // get user role from user.id
    User.findByPk(user.id).then((user) => {
      if (user.role === "admin") {
        req.user = user;
        return next();
      }
      return next(errorHandler(403, "Forbidden"));
    });
  });
}

const getUserId = (jwtToken) => {
  return jwt.verify(jwtToken, process.env.JWT_SECRET).id;
};

module.exports = {verifyToken , verifyAdmin, 
                  getUserId,
                };
