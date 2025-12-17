const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorizations token required!" });
    }
    const token = header.split(" ")[1];
    const decodeuser = jwt.verify(token, process.env.JWT);
    req.user = decodeuser;
    next();
  } catch (error) {
    return res.json({
      message: "Invalid or expired token",
      error,
    });
  }
};
module.exports = auth;
