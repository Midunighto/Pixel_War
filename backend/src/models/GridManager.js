/* eslint-disable camelcase */
const AbstractManager = require("./AbstractManager");

class GridManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "grid" as configuration
    super({ table: "grid" });
  }

  // The C of CRUD - Create operation
  async create(grid) {
    // Execute the SQL INSERT query to add a new grid to the "grid" table
    let query = `INSERT INTO ${this.table} (name, user_id) VALUES (?, ?)`;
    let values = [grid.name, grid.user_id];

    // If dimensions are provided, include them in the query
    if (grid.dimensions) {
      query = `INSERT INTO ${this.table} (name, dimensions, user_id) VALUES (?, ?, ?)`;
      values = [grid.name, grid.dimensions, grid.user_id];
    }

    const [result] = await this.database.query(query, values);
    return result.insertId;
  }

  // The Rs of CRUD - Read operations
  async getAll() {
    // Execute the SQL SELECT query to retrieve all grids from the "grid" table
    const [result] = await this.database.query(`SELECT * FROM ${this.table}`);

    // Return the array of grids
    return result;
  }

  async getById(id) {
    // Execute the SQL SELECT query to retrieve a specific grid by its ID
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the grid
    return rows[0];
  }

  async getByUserId(user_id) {
    // Execute the SQL SELECT query to retrieve grids by user_id
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE user_id = ?`,
      [user_id]
    );

    // Return the rows of the result, which represents the grids
    return rows;
  }

  // The D of CRUD - Delete operation
  async delete(id) {
    // Execute the SQL DELETE query to delete a specific grid by its ID
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = GridManager;
