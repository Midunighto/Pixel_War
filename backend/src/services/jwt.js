const jwt = require("jsonwebtoken");

const checkToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send("Token non fourni");
  }

  const userToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(userToken, process.env.APP_SECRET);
    if (decoded) {
      req.decoded = { id: decoded.id };
      return next();
    }
    return res.status(403).json({ error: "Token invalide" });
  } catch (error) {
    return res.status(403).json({ error: "Token invalide" });
  }
};

module.exports = { checkToken };
