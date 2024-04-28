// Import access to database tables
const tables = require("../tables");
const jwt = require("jsonwebtoken");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all items from the database
    const users = await tables.user.readAll();

    // Respond with the items in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific item from the database based on the provided ID
    const user = await tables.user.read(req.params.id);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
// This operation is not yet implemented
const editTheme = async (req, res) => {
  try {
    const result = await tables.user.updateTheme(req.body.theme, req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Un erreur est survenue" });
    }
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the user data from the request body
  const user = req.body;

  try {
    // Insert the user into the database
    const insertId = await tables.user.create(user);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted user
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await tables.user.delete(id);
    if (result.affectedRows === 0) {
      res.status(404).send("id introuvable");
    } else {
      res.status(200).send(`Utilisateur ${id} supprimé`);
    }
  } catch (err) {
    next(err);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const { user } = req;
    // Assurez-vous que la fonction updateLastLog existe dans votre gestionnaire utilisateur (tables.user)
    await tables.user.updateLastLog(user.id);

    // Générez un token JWT pour l'utilisateur
    const userToken = jwt.sign({ id: user.id }, process.env.APP_SECRET);

    // Configurez le cookie pour stocker le token JWT
    res.cookie("userToken", userToken, { httpOnly: true });

    // Répondez avec les informations de l'utilisateur et le token JWT
    res.json({ user, userToken });
  } catch (err) {
    // Gérez les erreurs
    next(err);
  }
};

const refreshToken = async (req, res) => {
  const { id } = req.decoded;
  try {
    const result = await tables.user.read(id);
    if (!result) {
      res.status(404).send("No user found");
    }
    delete result.password;
    const userToken = jwt.sign({ id }, process.env.APP_SECRET, {
      expiresIn: "10d",
    });
    res.cookie("token", userToken, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("userToken");
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  editTheme,
  add,
  destroy,
  login,
  logout,
  refreshToken,
};
