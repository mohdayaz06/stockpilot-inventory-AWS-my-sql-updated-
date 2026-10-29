const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async findOne({ email }) {
    if (!email) return null;
    const [rows] = await pool.execute(
      'SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = ?',
      [email]
    );
    if (!rows[0]) return null;
    const user = rows[0];
    user._id = user.id;
    user.matchPassword = async function (enteredPassword) {
      return bcrypt.compare(enteredPassword, user.password);
    };
    user.select = function (field) {
      return user;
    };
    return user;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    if (!rows[0]) return null;
    const user = rows[0];
    user._id = user.id;
    user.select = function (field) {
      return user;
    };
    return user;
  },

  async create({ name, email, password, role = 'staff' }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    return this.findById(result.insertId);
  }
};

module.exports = User;
