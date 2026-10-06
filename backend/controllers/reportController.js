const db = require('../config/db');

// Reports using GROUP BY, COUNT, and aggregate queries
exports.getDashboardSummary = async (req, res, next) => {
  try {
    // 1. Status distribution
    const statusSql = `SELECT status, COUNT(*) AS count FROM equipment GROUP BY status`;
    const statusDistribution = await db.query(statusSql);

    // 2. Equipment by Laboratory
    const labSql = `
      SELECT 
        l.id AS laboratory_id, 
        l.name AS laboratory_name, 
        l.code AS laboratory_code, 
        COUNT(e.id) AS total_equipment 
      FROM laboratories l 
      LEFT JOIN equipment e ON l.id = e.laboratory_id 
      GROUP BY l.id, l.name, l.code
    `;
    const labDistribution = await db.query(labSql);

    // 3. Equipment by Category
    const catSql = `
      SELECT 
        c.id AS category_id, 
        c.name AS category_name, 
        COUNT(e.id) AS equipment_count 
      FROM categories c 
      LEFT JOIN equipment e ON c.id = e.category_id 
      GROUP BY c.id, c.name
    `;
    const categoryDistribution = await db.query(catSql);

    // 4. Maintenance breakdown
    const maintSql = `
      SELECT 
        severity, 
        status, 
        COUNT(*) AS total_tickets, 
        COALESCE(SUM(cost), 0) AS total_cost 
      FROM maintenance 
      GROUP BY severity, status
    `;
    const maintenanceSummary = await db.query(maintSql);

    // Compute key totals
    let totalEquipment = 0;
    let availableCount = 0;
    let allocatedCount = 0;
    let underMaintenanceCount = 0;
    let damagedCount = 0;

    statusDistribution.forEach(item => {
      const c = Number(item.count);
      totalEquipment += c;
      if (item.status === 'Available') availableCount = c;
      if (item.status === 'Allocated') allocatedCount = c;
      if (item.status === 'Under Maintenance') underMaintenanceCount = c;
      if (item.status === 'Damaged') damagedCount = c;
    });

    res.json({
      success: true,
      summary: {
        totalEquipment,
        availableCount,
        allocatedCount,
        underMaintenanceCount,
        damagedCount
      },
      statusDistribution,
      labDistribution,
      categoryDistribution,
      maintenanceSummary,
      databaseStatus: db.getDatabaseStatus()
    });
  } catch (err) {
    next(err);
  }
};
