// Import access to database tables
const tables = require("../tables");

// BROWSE - Read All operation
const browse = async (req, res, next) => {
  try {
    // Fetch all grids from the database
    const grids = await tables.grid.getAll();

    // Respond with the grids in JSON format
    res.json(grids);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// READ - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific grid from the database based on the provided ID
    const grid = await tables.grid.getById(req.params.id);

    // If the grid is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the grid in JSON format
    if (!grid) {
      res.sendStatus(404);
    } else {
      res.json(grid);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// READ BY USER - Read grids by user operation
const readByUser = async (req, res, next) => {
  try {
    // Fetch grids from the database based on the provided user ID
    const grids = await tables.grid.getByUserId(req.params.user_id);

    // Respond with the grids in JSON format
    res.json(grids);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// ADD - Create operation
const add = async (req, res, next) => {
  // Extract the grid data from the request body
  const gridData = req.body;

  try {
    // Insert the grid into the database
    const insertedGrid = await tables.grid.create(gridData);

    // Respond with HTTP 201 (Created) and the inserted grid data
    res.status(201).json(insertedGrid);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// DELETE - Delete operation
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete the grid from the database based on the provided ID
    const deletedGrid = await tables.grid.delete(id);

    // If the grid is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with HTTP 200 (OK) and a success message
    if (!deletedGrid) {
      res.status(404).send("Grid not found");
    } else {
      res.status(200).send(`Grid ${id} deleted`);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

module.exports = {
  browse,
  read,
  readByUser,
  add,
  destroy,
};
