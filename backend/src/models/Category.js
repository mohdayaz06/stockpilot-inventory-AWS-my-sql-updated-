const { pool } = require('../config/db');

const Category = {
  formatCategory(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  },

  find() {
    return {
      sort: async () => {
        const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name ASC');
        return rows.map(Category.formatCategory);
      }
    };
  },

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
    return this.formatCategory(rows[0]);
  },

  async create({ name, description = '' }) {
    const [result] = await pool.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    return this.findById(result.insertId);
  },

  async countDocuments({ category }) {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [category]);
    return rows[0].count;
  },

  async deleteOne(id) {
    const targetId = typeof id === 'object' ? id._id || id.id : id;
    const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [targetId]);
    return result.affectedRows > 0;
  }
};

module.exports = Category;
