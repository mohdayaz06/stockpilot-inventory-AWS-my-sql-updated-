const { pool } = require('../config/db');

const Product = {
  formatProduct(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      name: row.name,
      sku: row.sku,
      category: row.category_id ? { _id: row.category_id, id: row.category_id, name: row.category_name } : null,
      description: row.description,
      price: parseFloat(row.price),
      quantity: row.quantity,
      reorderLevel: row.reorder_level,
      supplier: row.supplier,
      warehouseLocation: row.warehouse_location,
      lowStock: row.quantity <= row.reorder_level,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  },

  async countDocuments(filter = {}) {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (filter.$or) {
      const search = filter.$or[0].name.$regex;
      whereClause += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (filter.category) {
      whereClause += ' AND p.category_id = ?';
      params.push(filter.category);
    }
    if (filter.$expr || filter.lowStock === 'true') {
      whereClause += ' AND p.quantity <= p.reorder_level';
    }

    const query = `SELECT COUNT(*) as total FROM products p ${whereClause}`;
    const [rows] = await pool.query(query, params);
    return rows[0].total;
  },

  find(filter = {}) {
    return {
      populate: function (field, select) {
        return {
          sort: function (sortObj) {
            return {
              skip: function (skipVal) {
                return {
                  limit: async function (limitVal) {
                    let whereClause = 'WHERE 1=1';
                    const params = [];

                    if (filter.$or) {
                      const search = filter.$or[0].name.$regex;
                      whereClause += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
                      params.push(`%${search}%`, `%${search}%`);
                    }
                    if (filter.category) {
                      whereClause += ' AND p.category_id = ?';
                      params.push(filter.category);
                    }
                    if (filter.$expr || filter.lowStock === 'true') {
                      whereClause += ' AND p.quantity <= p.reorder_level';
                    }

                    const query = `
                      SELECT p.*, c.name AS category_name 
                      FROM products p
                      LEFT JOIN categories c ON p.category_id = c.id
                      ${whereClause}
                      ORDER BY p.created_at DESC
                      LIMIT ? OFFSET ?
                    `;

                    const [rows] = await pool.query(query, [...params, parseInt(limitVal, 10), parseInt(skipVal, 10)]);
                    return rows.map(Product.formatProduct);
                  }
                };
              }
            };
          }
        };
      }
    };
  },

  findById(id) {
    return {
      populate: async function (field, select) {
        const query = `
          SELECT p.*, c.name AS category_name 
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        if (!rows[0]) return null;
        const product = Product.formatProduct(rows[0]);
        product.save = async function () {
          await pool.execute(
            `UPDATE products SET 
              name = ?, sku = ?, category_id = ?, description = ?, price = ?, 
              quantity = ?, reorder_level = ?, supplier = ?, warehouse_location = ?
             WHERE id = ?`,
            [
              product.name, product.sku, product.category?._id || product.category,
              product.description || '', product.price, product.quantity,
              product.reorderLevel, product.supplier, product.warehouseLocation,
              product._id
            ]
          );
          return Product.findById(product._id).populate('category', 'name');
        };
        product.deleteOne = async function () {
          await pool.execute('DELETE FROM products WHERE id = ?', [product._id]);
        };
        return product;
      }
    };
  },

  async create(data) {
    const categoryId = typeof data.category === 'object' ? data.category._id || data.category.id : data.category;
    const createdBy = typeof data.createdBy === 'object' ? data.createdBy._id || data.createdBy.id : data.createdBy;

    const [result] = await pool.execute(
      `INSERT INTO products 
        (name, sku, category_id, description, price, quantity, reorder_level, supplier, warehouse_location, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.sku,
        categoryId,
        data.description || '',
        data.price,
        data.quantity || 0,
        data.reorderLevel || 10,
        data.supplier || 'Unknown',
        data.warehouseLocation || 'A1-01',
        createdBy || null
      ]
    );
    const newProduct = await this.findById(result.insertId).populate('category', 'name');
    newProduct.populate = async function () { return newProduct; };
    return newProduct;
  },

  async aggregate(pipeline) {
    const [rows] = await pool.execute(
      'SELECT SUM(quantity) as totalUnits, SUM(quantity * price) as totalValue FROM products'
    );
    return [{
      totalUnits: parseInt(rows[0].totalUnits || 0, 10),
      totalValue: parseFloat(rows[0].totalValue || 0)
    }];
  }
};

module.exports = Product;
