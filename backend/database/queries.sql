-- ========================================================
-- College Laboratory Equipment Management System
-- Essential SQL Queries: JOIN, UPDATE, DELETE, COUNT, GROUP BY
-- ========================================================

USE college_lab_db;

-- 1. JOIN QUERY: Complete Equipment Catalog with Category & Laboratory Details
SELECT 
    e.id,
    e.asset_tag,
    e.name AS equipment_name,
    c.name AS category_name,
    l.name AS laboratory_name,
    l.room_no,
    l.incharge_name,
    e.status,
    e.model_number,
    e.serial_number,
    e.purchase_date,
    e.warranty_expiry,
    e.specifications
FROM equipment e
JOIN categories c ON e.category_id = c.id
JOIN laboratories l ON e.laboratory_id = l.id
ORDER BY e.id DESC;

-- 2. JOIN QUERY: Active Allocations with Borrower, Issuer, and Equipment details
SELECT 
    a.id AS allocation_id,
    e.asset_tag,
    e.name AS equipment_name,
    borrower.name AS borrower_name,
    borrower.email AS borrower_email,
    borrower.role AS borrower_role,
    issuer.name AS issued_by_name,
    a.allocation_date,
    a.expected_return_date,
    a.purpose,
    a.status AS allocation_status
FROM allocations a
JOIN equipment e ON a.equipment_id = e.id
JOIN users borrower ON a.allocated_to_user_id = borrower.id
JOIN users issuer ON a.allocated_by_user_id = issuer.id
WHERE a.status = 'Active';

-- 3. JOIN QUERY: Maintenance Tickets with Equipment & Reporter info
SELECT 
    m.id AS ticket_id,
    e.asset_tag,
    e.name AS equipment_name,
    l.name AS lab_name,
    u.name AS reported_by,
    m.issue_description,
    m.severity,
    m.status AS maintenance_status,
    m.cost,
    m.reported_at,
    m.resolved_at
FROM maintenance m
JOIN equipment e ON m.equipment_id = e.id
JOIN laboratories l ON e.laboratory_id = l.id
JOIN users u ON m.reported_by_user_id = u.id
ORDER BY m.reported_at DESC;

-- 4. COUNT & GROUP BY: Equipment count grouped by Laboratory
SELECT 
    l.id AS laboratory_id,
    l.name AS laboratory_name,
    l.code AS laboratory_code,
    COUNT(e.id) AS total_equipment
FROM laboratories l
LEFT JOIN equipment e ON l.id = e.laboratory_id
GROUP BY l.id, l.name, l.code
ORDER BY total_equipment DESC;

-- 5. COUNT & GROUP BY: Equipment count grouped by Category
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    COUNT(e.id) AS equipment_count
FROM categories c
LEFT JOIN equipment e ON c.id = e.category_id
GROUP BY c.id, c.name
ORDER BY equipment_count DESC;

-- 6. COUNT & GROUP BY: Equipment distribution by operational status
SELECT 
    status,
    COUNT(*) AS count
FROM equipment
GROUP BY status;

-- 7. COUNT & GROUP BY: Maintenance tickets grouped by Severity
SELECT 
    severity,
    status,
    COUNT(*) AS total_tickets,
    COALESCE(SUM(cost), 0) AS total_cost
FROM maintenance
GROUP BY severity, status;

-- 8. UPDATE QUERY: Mark equipment as Damaged and record resolution
UPDATE equipment
SET status = 'Under Maintenance'
WHERE id = 4;

-- 9. UPDATE QUERY: Complete an Allocation (Return equipment)
UPDATE allocations
SET status = 'Returned', actual_return_date = CURDATE()
WHERE id = 1;

-- 10. DELETE QUERY: Remove decommissioned equipment safely
DELETE FROM equipment
WHERE id = 99 AND status = 'Decommissioned';
