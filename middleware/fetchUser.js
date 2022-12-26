const jwt = require("jsonwebtoken");
const JWT_SECRET = "passwordledu";

const fetchuser = (req, res, next) => {
  const token = req.header("authtoken");
  if (!token) {
    res.status(410).json({ errors: "invalid auth token" });
  }
  const data = jwt.verify(token, JWT_SECRET);
  req.user = data.user;
  next();
};

module.exports = fetchuser;
