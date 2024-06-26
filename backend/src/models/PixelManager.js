/* eslint-disable camelcase */
const AbstractManager = require("./AbstractManager");

class PixelManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "pixel" as configuration
    super({ table: "pixel" });
  }

  async create(pixel) {
    const { user_id, user_pseudo, color, x_coordinate, y_coordinate, grid_id } =
      pixel;
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (user_id, user_pseudo, color, x_coordinate, y_coordinate, grid_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, user_pseudo, color, x_coordinate, y_coordinate, grid_id]
    );
    return result.insertId;
  }

  async getByCoordinates(x_coordinate, y_coordinate, grid_id) {
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE x_coordinate = ? AND y_coordinate = ? AND grid_id = ?`,
      [x_coordinate, y_coordinate, grid_id]
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
    if (id === undefined) {
      throw new Error("Invalid pixel ID");
    }

    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = PixelManager;
