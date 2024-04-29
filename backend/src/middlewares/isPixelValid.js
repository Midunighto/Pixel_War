const PixelManager = require("../models/PixelManager");

// Créer une instance du gestionnaire de pixels
const pixelManager = new PixelManager();

async function isPixelValid(req, res, next) {
  const { x_coordinate, y_coordinate, grid_id } = req.body;

  try {
    // Vérifier si un pixel existe déjà pour les coordonnées fournies dans la grille spécifiée
    const existingPixel = await pixelManager.getByCoordinates(
      x_coordinate,
      y_coordinate,
      grid_id
    );

    if (existingPixel) {
      return res.status(400).json({
        error: "L'emplacement est déjà occupé par un pixel.",
      });
    }

    next();
  } catch (error) {
    // En cas d'erreur, renvoyer une erreur 500 (Erreur interne du serveur)
    console.error(error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

module.exports = { isPixelValid };
