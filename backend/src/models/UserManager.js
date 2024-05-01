const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "user" as configuration
    super({ table: "user" });
  }

  // The C of CRUD - Create operation

  async create(user) {
    const [result] = await this.database.query(
      `insert into ${this.table} (pseudo, email, pwd) values (?, ?, ?)`,
      [user.pseudo, user.email, user.pwd]
    );

    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the item
    return rows[0];
  }

  async readByUser(id) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the item
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "item" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of items
    return rows;
  }

  // The U of CRUD - Update operation
  async updateMail(mail, id) {
    const [result] = await this.database.query(
      `update ${this.table} SET email = ? where id = ?`,
      [mail, id]
    );
    return result;
  }

  async updatePwd(pwd, id) {
    const [result] = await this.database.query(
      `update ${this.table} SET pwd = ? where id = ?`,
      [pwd, id]
    );
    return result;
  }
  async updateTheme(theme, id) {
    const [result] = await this.database.query(
      `update ${this.table} SET theme = ? where id = ?`,
      [theme, id]
    );
    return result;
  }

  async updateLastLog(id) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET last_log = NOW() WHERE id = ?`,
      [id]
    );
    return result;
  }

  // The D of CRUD - Delete operation
  async delete(id) {
    const [result] = await this.database.query(
      `delete from ${this.table} where id = ?`,
      [id]
    );
    return result;
  }

  async checkEmail(email) {
    const [rows] = await this.database.query(
      `select * from ${this.table} where email=?`,
      [email]
    );
    return rows;
  }

  async checkPseudo(pseudo) {
    const [rows] = await this.database.query(
      `select * from ${this.table} where pseudo=?`,
      [pseudo]
    );
    return rows;
  }
}

module.exports = UserManager;
