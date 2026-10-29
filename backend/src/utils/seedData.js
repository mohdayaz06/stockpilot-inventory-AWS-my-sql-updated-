require('dotenv').config();
const { pool, connectDB } = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB();

  console.log('[seed] Clearing existing MySQL tables...');
  await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
  await pool.execute('TRUNCATE TABLE products');
  await pool.execute('TRUNCATE TABLE categories');
  await pool.execute('TRUNCATE TABLE users');
  await pool.execute('SET FOREIGN_KEY_CHECKS = 1');

  console.log('[seed] Creating demo users...');
  const admin = await User.create({
    name: 'Asha Rao',
    email: 'admin@stockpilot.io',
    password: 'Admin@123',
    role: 'admin',
  });

  await User.create({
    name: 'Vikram Shah',
    email: 'staff@stockpilot.io',
    password: 'Staff@123',
    role: 'staff',
  });

  console.log('[seed] Creating categories...');
  const categoriesData = [
    { name: 'Electronics', description: 'Consumer electronics and accessories' },
    { name: 'Office Supplies', description: 'Stationery and office equipment' },
    { name: 'Warehouse Equipment', description: 'Tools and equipment used in the warehouse' },
    { name: 'Packaging', description: 'Boxes, tape, and shipping materials' },
  ];

  const catMap = {};
  for (const cat of categoriesData) {
    const [res] = await pool.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [cat.name, cat.description]
    );
    catMap[cat.name] = res.insertId;
  }

  console.log('[seed] Creating products...');
  const productsData = [
    {
      name: 'Wireless Barcode Scanner',
      sku: 'ELEC-BC-001',
      category_id: catMap['Electronics'],
      description: 'Bluetooth handheld barcode scanner, 2.4GHz, USB dock included',
      price: 89.99,
      quantity: 42,
      reorder_level: 15,
      supplier: 'ScanTech Industries',
      warehouse_location: 'A1-03',
      created_by: admin.id,
    },
    {
      name: 'Thermal Label Printer',
      sku: 'ELEC-PR-002',
      category_id: catMap['Electronics'],
      description: '4-inch direct thermal label printer for shipping labels',
      price: 219.5,
      quantity: 8,
      reorder_level: 10,
      supplier: 'PrintFast Corp',
      warehouse_location: 'A1-05',
      created_by: admin.id,
    },
    {
      name: 'A4 Copy Paper (Ream)',
      sku: 'OFF-PP-010',
      category_id: catMap['Office Supplies'],
      description: '500 sheets, 80gsm, bright white',
      price: 4.25,
      quantity: 320,
      reorder_level: 50,
      supplier: 'PaperCo',
      warehouse_location: 'B2-01',
      created_by: admin.id,
    },
    {
      name: 'Ballpoint Pens (Box of 50)',
      sku: 'OFF-PN-011',
      category_id: catMap['Office Supplies'],
      description: 'Medium point, black ink',
      price: 12.0,
      quantity: 60,
      reorder_level: 20,
      supplier: 'WriteWell Ltd',
      warehouse_location: 'B2-02',
      created_by: admin.id,
    },
    {
      name: 'Heavy Duty Pallet Jack',
      sku: 'WHS-PJ-020',
      category_id: catMap['Warehouse Equipment'],
      description: '5500 lb capacity, 48x27 inch forks',
      price: 385.0,
      quantity: 6,
      reorder_level: 2,
      supplier: 'LiftPro Equipment',
      warehouse_location: 'C3-01',
      created_by: admin.id,
    },
    {
      name: 'Industrial Shelving Unit',
      sku: 'WHS-SH-021',
      category_id: catMap['Warehouse Equipment'],
      description: '5-tier steel shelving, 72x36x18 inch',
      price: 149.99,
      quantity: 3,
      reorder_level: 5,
      supplier: 'LiftPro Equipment',
      warehouse_location: 'C3-02',
      created_by: admin.id,
    },
    {
      name: 'Corrugated Shipping Boxes (Medium)',
      sku: 'PKG-BX-030',
      category_id: catMap['Packaging'],
      description: '18x14x12 inch, bundle of 25',
      price: 32.5,
      quantity: 150,
      reorder_level: 40,
      supplier: 'BoxWorks',
      warehouse_location: 'D4-01',
      created_by: admin.id,
    },
    {
      name: 'Packing Tape (Case of 36)',
      sku: 'PKG-TP-031',
      category_id: catMap['Packaging'],
      description: '2 inch clear packing tape rolls',
      price: 45.0,
      quantity: 18,
      reorder_level: 20,
      supplier: 'BoxWorks',
      warehouse_location: 'D4-02',
      created_by: admin.id,
    },
  ];

  for (const p of productsData) {
    await pool.execute(
      `INSERT INTO products 
        (name, sku, category_id, description, price, quantity, reorder_level, supplier, warehouse_location, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.name, p.sku, p.category_id, p.description, p.price, p.quantity, p.reorder_level, p.supplier, p.warehouse_location, p.created_by]
    );
  }

  console.log('[seed] Done! Demo credentials:');
  console.log('        admin@stockpilot.io / Admin@123');
  console.log('        staff@stockpilot.io / Staff@123');

  process.exit(0);
};

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
