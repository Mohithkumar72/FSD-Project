const db = require('../config/db');

// 1. GET all equipment with JOIN (Categories, Laboratories)
exports.getAllEquipment = async (req, res, next) => {
  try {
    const { search, category_id, laboratory_id, status } = req.query;

    const sql = `
      SELECT 
        e.id,
        e.asset_tag,
        e.name,
        e.category_id,
        c.name AS category_name,
        e.laboratory_id,
        l.name AS laboratory_name,
        l.room_no,
        l.incharge_name,
        e.model_number,
        e.serial_number,
        e.status,
        e.purchase_date,
        e.warranty_expiry,
        e.specifications
      FROM equipment e
      JOIN categories c ON e.category_id = c.id
      JOIN laboratories l ON e.laboratory_id = l.id
      ORDER BY e.id DESC
    `;

    let rows = await db.query(sql);

    // Apply filtering logic
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.asset_tag.toLowerCase().includes(q) ||
        (item.model_number && item.model_number.toLowerCase().includes(q))
      );
    }

    if (category_id && category_id !== 'all') {
      rows = rows.filter(item => String(item.category_id) === String(category_id));
    }

    if (laboratory_id && laboratory_id !== 'all') {
      rows = rows.filter(item => String(item.laboratory_id) === String(laboratory_id));
    }

    if (status && status !== 'all') {
      rows = rows.filter(item => item.status.toLowerCase() === status.toLowerCase());
    }

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// 2. GET single equipment by ID
exports.getEquipmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        e.id,
        e.asset_tag,
        e.name,
        e.category_id,
        c.name AS category_name,
        e.laboratory_id,
        l.name AS laboratory_name,
        l.room_no,
        l.incharge_name,
        e.model_number,
        e.serial_number,
        e.status,
        e.purchase_date,
        e.warranty_expiry,
        e.specifications
      FROM equipment e
      JOIN categories c ON e.category_id = c.id
      JOIN laboratories l ON e.laboratory_id = l.id
      WHERE e.id = ?
    `;
    const rows = await db.query(sql, [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// 3. POST create new equipment
exports.createEquipment = async (req, res, next) => {
  try {
    const {
      asset_tag,
      name,
      category_id,
      laboratory_id,
      model_number,
      serial_number,
      status,
      purchase_date,
      warranty_expiry,
      specifications
    } = req.body;

    const sql = `
      INSERT INTO equipment 
      (asset_tag, name, category_id, laboratory_id, model_number, serial_number, status, purchase_date, warranty_expiry, specifications)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(sql, [
      asset_tag.trim(),
      name.trim(),
      category_id,
      laboratory_id,
      model_number || null,
      serial_number || null,
      status || 'Available',
      purchase_date || null,
      warranty_expiry || null,
      specifications || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Equipment registered successfully',
      id: result.insertId
    });
  } catch (err) {
    next(err);
  }
};

// 4. PUT update existing equipment
exports.updateEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      category_id,
      laboratory_id,
      model_number,
      serial_number,
      status,
      purchase_date,
      warranty_expiry,
      specifications
    } = req.body;

    const sql = `
      UPDATE equipment SET
        name = ?,
        category_id = ?,
        laboratory_id = ?,
        model_number = ?,
        serial_number = ?,
        status = ?,
        purchase_date = ?,
        warranty_expiry = ?,
        specifications = ?
      WHERE id = ?
    `;

    const result = await db.query(sql, [
      name.trim(),
      category_id,
      laboratory_id,
      model_number || null,
      serial_number || null,
      status || 'Available',
      purchase_date || null,
      warranty_expiry || null,
      specifications || null,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    res.json({ success: true, message: 'Equipment updated successfully' });
  } catch (err) {
    next(err);
  }
};

// 5. PATCH quick status update
exports.updateEquipmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const sql = `UPDATE equipment SET status = ? WHERE id = ?`;
    const result = await db.query(sql, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    res.json({ success: true, message: `Status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};

// 6. DELETE equipment
exports.deleteEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM equipment WHERE id = ?`;
    const result = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    res.json({ success: true, message: 'Equipment deleted successfully' });
  } catch (err) {
    next(err);
  }
};
