const db = require('../config/db');

// 1. GET all allocations with JOIN (Equipment, Borrower, Issuer)
exports.getAllAllocations = async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        a.id,
        a.equipment_id,
        e.asset_tag,
        e.name AS equipment_name,
        a.allocated_to_user_id,
        borrower.name AS borrower_name,
        borrower.email AS borrower_email,
        borrower.role AS borrower_role,
        a.allocated_by_user_id,
        issuer.name AS issued_by_name,
        a.allocation_date,
        a.expected_return_date,
        a.actual_return_date,
        a.purpose,
        a.status
      FROM allocations a
      JOIN equipment e ON a.equipment_id = e.id
      JOIN users borrower ON a.allocated_to_user_id = borrower.id
      JOIN users issuer ON a.allocated_by_user_id = issuer.id
      ORDER BY a.id DESC
    `;
    const rows = await db.query(sql);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// 2. POST create equipment allocation
exports.createAllocation = async (req, res, next) => {
  try {
    const {
      equipment_id,
      allocated_to_user_id,
      allocated_by_user_id,
      allocation_date,
      expected_return_date,
      purpose
    } = req.body;

    // Check equipment current availability
    const eq = await db.query(`SELECT * FROM equipment WHERE id = ?`, [equipment_id]);
    if (!eq || eq.length === 0) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    if (eq[0].status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `Equipment cannot be allocated. Current status is: ${eq[0].status}`
      });
    }

    const allocDate = allocation_date || new Date().toISOString().split('T')[0];

    const sql = `
      INSERT INTO allocations 
      (equipment_id, allocated_to_user_id, allocated_by_user_id, allocation_date, expected_return_date, purpose)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(sql, [
      equipment_id,
      allocated_to_user_id,
      allocated_by_user_id,
      allocDate,
      expected_return_date,
      purpose.trim()
    ]);

    // Mark equipment as Allocated
    await db.query(`UPDATE equipment SET status = 'Allocated' WHERE id = ?`, [equipment_id]);

    res.status(201).json({
      success: true,
      message: 'Equipment allocated successfully',
      allocation_id: result.insertId
    });
  } catch (err) {
    next(err);
  }
};

// 3. PATCH return allocated equipment
exports.returnAllocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actualReturnDate = new Date().toISOString().split('T')[0];

    const sql = `
      UPDATE allocations 
      SET status = 'Returned', actual_return_date = ? 
      WHERE id = ?
    `;

    const result = await db.query(sql, [actualReturnDate, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Allocation record not found' });
    }

    // Retrieve equipment_id to reset equipment status to Available
    const alloc = await db.query(`SELECT equipment_id FROM allocations WHERE id = ?`, [id]);
    if (alloc && alloc.length > 0) {
      await db.query(`UPDATE equipment SET status = 'Available' WHERE id = ?`, [alloc[0].equipment_id]);
    }

    res.json({ success: true, message: 'Equipment returned successfully' });
  } catch (err) {
    next(err);
  }
};
