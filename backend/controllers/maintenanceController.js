const db = require('../config/db');

// 1. GET all maintenance tickets with JOIN (Equipment, Lab, Reporter)
exports.getAllMaintenance = async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        m.id,
        m.equipment_id,
        e.asset_tag,
        e.name AS equipment_name,
        l.name AS laboratory_name,
        m.reported_by_user_id,
        u.name AS reported_by,
        m.issue_description,
        m.severity,
        m.status,
        m.resolution_notes,
        m.cost,
        m.reported_at,
        m.resolved_at
      FROM maintenance m
      JOIN equipment e ON m.equipment_id = e.id
      JOIN laboratories l ON e.laboratory_id = l.id
      JOIN users u ON m.reported_by_user_id = u.id
      ORDER BY m.reported_at DESC
    `;
    const rows = await db.query(sql);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// 2. POST report damage or issue
exports.reportDamage = async (req, res, next) => {
  try {
    const { equipment_id, reported_by_user_id, issue_description, severity } = req.body;

    const sql = `
      INSERT INTO maintenance 
      (equipment_id, reported_by_user_id, issue_description, severity, status)
      VALUES (?, ?, ?, ?, 'Reported')
    `;

    const result = await db.query(sql, [
      equipment_id,
      reported_by_user_id,
      issue_description.trim(),
      severity || 'Medium'
    ]);

    // Also update the equipment status accordingly
    const newEquipmentStatus = severity === 'Critical' ? 'Damaged' : 'Under Maintenance';
    await db.query(`UPDATE equipment SET status = ? WHERE id = ?`, [newEquipmentStatus, equipment_id]);

    res.status(201).json({
      success: true,
      message: 'Damage/Maintenance ticket reported successfully',
      ticket_id: result.insertId
    });
  } catch (err) {
    next(err);
  }
};

// 3. PATCH update maintenance status (Reported -> In Progress -> Resolved)
exports.updateMaintenanceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolution_notes, cost } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const resolved_at = status === 'Resolved' ? new Date().toISOString().replace('T', ' ').substring(0, 19) : null;

    const sql = `
      UPDATE maintenance SET 
        status = ?, 
        resolution_notes = COALESCE(?, resolution_notes),
        cost = COALESCE(?, cost),
        resolved_at = ?
      WHERE id = ?
    `;

    const result = await db.query(sql, [
      status,
      resolution_notes || null,
      cost !== undefined ? cost : null,
      resolved_at,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    // If resolved, mark equipment as 'Available'
    if (status === 'Resolved') {
      const ticketRows = await db.query(`SELECT equipment_id FROM maintenance WHERE id = ?`, [id]);
      if (ticketRows && ticketRows.length > 0) {
        await db.query(`UPDATE equipment SET status = 'Available' WHERE id = ?`, [ticketRows[0].equipment_id]);
      }
    }

    res.json({ success: true, message: `Maintenance status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};
