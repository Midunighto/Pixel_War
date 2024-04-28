const Joi = require("joi");
const tables = require("../tables");

const userScheme = Joi.object({
  pseudo: Joi.string().alphanum().required(),
  email: Joi.string().email().max(255).required(),
  pwd: Joi.string().min(8).required(),
});

const signup = async (req, res, next) => {
  const errors = [];
  const { pseudo, email, pwd } = req.body;

  if (!pseudo || !email || !pwd) {
    return res
      .status(400)
      .json({ error: "Un ou plusieurs champs ne sont pas remplis" });
  }
  const { error } = userScheme.validate(
    { pseudo, email, pwd },
    { abortEarly: false }
  );

  if (error) {
    return res.status(422).json({ validateErrors: errors.details });
  }
  const usedEmail = await tables.user.checkEmail(email);
  if (usedEmail.length !== 0) {
    errors.push({ champ: "email", message: "adresse email déjà utilisée" });
  }

  const usedPseudo = await tables.user.checkPseudo(pseudo);
  if (usedPseudo.length !== 0) {
    errors.push({ champ: "pseudo", message: "Pseudo déjà utilisé" });
  }
  if (errors.length !== 0) {
    return res.status(409).json({ validationErrors: errors });
  }
  return next();
};

module.exports = signup;
