// pixelMiddleware.js

// Créer une grille vide de 40x40
const grid = Array.from({ length: 40 }, () => Array(40).fill(false));

function isPixelValid(req, res, next) {
  const { x_coordinate, y_coordinate } = req.body;

  // Vérifier si les coordonnées se trouvent dans les limites de la grille (40x40)
  if (
    x_coordinate < 0 ||
    x_coordinate >= grid.length || // Modifié pour inclure la taille maximale de la grille
    y_coordinate < 0 ||
    y_coordinate >= grid[0].length // Modifié pour inclure la taille maximale de la grille
  ) {
    return res
      .status(400)
      .json({ error: "Les coordonnées du pixel sont invalides." });
  }

  // Vérifier si l'emplacement est déjà occupé
  if (grid[x_coordinate][y_coordinate]) {
    return res
      .status(400)
      .json({ error: "L'emplacement est déjà occupé par un pixel." });
  }

  // Mettre à jour la grille pour marquer l'emplacement comme occupé
  grid[x_coordinate][y_coordinate] = true;

  next();
}

module.exports = { isPixelValid };
