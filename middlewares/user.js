const jwt = require("jsonwebtoken");
const { JWT_USER } = require("../config");

function userMiddleware(req, res, next) {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_USER);

    req.userId = decoded.id;

    next();

  } catch (err) {
    return res.status(403).json({
      error: "You are not signed in",
    });
  }
}

module.exports = {
  userMiddleware,
};