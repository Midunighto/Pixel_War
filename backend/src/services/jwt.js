const jwt = require("jsonwebtoken");

const checkToken = async (req, res, next) => {
  const { userToken } = req.cookies;
  if (!userToken) {
    return res.status(403).send("Token non fourni");
  }
  try {
    const decoded = jwt.verify(userToken, process.env.APP_SECRET);
    req.decoded = { id: decoded.id };
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      /* on passe à refreshtoken */
      return next();
    }
    res.clearCookie("userToken");
    return res.status(403).json({ error: "Token invalide" });
  }
};

module.exports = { checkToken };
