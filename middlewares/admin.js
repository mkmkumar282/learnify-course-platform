const jwt = require("jsonwebtoken");
const { JWT_admin } = require("../config");
function adminMiddleware(req, res, next) {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_admin);

    req.adminId = decoded.id;

    next();

  } catch (err) {
    return res.status(403).json({
      error: "You are not signed in",
    });
  }
}

module.exports = {
  adminMiddleware,
};