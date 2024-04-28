const bcrypt = require("bcryptjs");
const tables = require("../tables");

const hashPassword = async (req, res, next) => {
  try {
    const { pwd } = req.body;
    if (pwd) {
      const hash = await bcrypt.hash(pwd, 13);
      req.body.pwd = hash;
      next();
    } else {
      res.status(400).send("Mot de passe requis");
    }
  } catch (error) {
    next(error);
  }
};

const verifyPassword = async (req, res, next) => {
  try {
    const [user] = await tables.user.checkPseudo(req.body.pseudo);
    if (!user) {
      res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
    }

    if (await bcrypt.compare(req.body.pwd, user.pwd)) {
      delete user.pwd;
      req.user = user;
      next();
    } else {
      res.status(422).json({
        error: "Oups, une erreur est survenue",
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { hashPassword, verifyPassword };
