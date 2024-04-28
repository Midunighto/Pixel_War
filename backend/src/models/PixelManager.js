/* eslint-disable camelcase */
const AbstractManager = require("./AbstractManager");

class PixelManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "pixel" as configuration
    super({ table: "pixel" });
  }

  // The C of CRUD - Create operation
  async create(pixel) {
    const { user_id, color, x_coordinate, y_coordinate, grid_id } = pixel;
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (user_id, color, x_coordinate, y_coordinate, grid_id) VALUES (?, ?, ?, ?, ?)`,
      [user_id, color, x_coordinate, y_coordinate, grid_id]
    );
    return result.insertId;
  }

  // The R of CRUD - Read operations
  async getById(id) {
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async getByGridId(grid_id) {
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE grid_id = ?`,
      [grid_id]
    );
    return rows;
  }

  // The D of CRUD - Delete operation
  async delete(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = PixelManager;
