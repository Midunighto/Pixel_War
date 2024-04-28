/* eslint-disable camelcase */
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
// Import access to database tables
const tables = require("../tables");

// Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all pixels from the database
    const pixels = await tables.pixel.getAll();

    // Respond with the pixels in JSON format
    res.json(pixels);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific pixel from the database based on the provided ID
    const pixel = await tables.pixel.getById(req.params.id);

    // If the pixel is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the pixel in JSON format
    if (!pixel) {
      res.sendStatus(404);
    } else {
      res.json(pixel);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Read pixels by grid operation
const readByGrid = async (req, res, next) => {
  try {
    // Fetch pixels from the database based on the provided grid ID
    const pixels = await tables.pixel.getByGridId(req.params.grid_id);

    // Respond with the pixels in JSON format
    res.json(pixels);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Add (Create) operation
const add = (req, res, next) => {
  const { user_id, color, x_coordinate, y_coordinate, grid_id } = req.body;

  // Insérer le pixel dans la base de données
  tables.pixel
    .create(req.body)
    .then((insertId) => {
      // Répondre avec HTTP 201 (Created) et l'ID du pixel nouvellement inséré
      res.status(201).json({ insertId });
    })
    .catch((err) => {
      next(err);
    });
};

// Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete the pixel from the database based on the provided ID
    const deletedPixel = await tables.pixel.delete(id);

    // If the pixel is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with HTTP 200 (OK) and a success message
    if (!deletedPixel) {
      res.status(404).send("Pixel not found");
    } else {
      res.status(200).send(`Pixel ${id} deleted`);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

module.exports = {
  browse,
  read,
  readByGrid,
  add,
  destroy,
};
