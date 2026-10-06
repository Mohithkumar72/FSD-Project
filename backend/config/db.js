const mysql = require('mysql2/promise');
require('dotenv').config();

let dbPool = null;
let isUsingFallback = false;

// Initial rich sample memory store for seamless fallback
const mockStore = {
  laboratories: [
    { id: 1, name: 'Advanced Computing & AI Lab', code: 'LAB-CS-101', room_no: 'Room 301', incharge_name: 'Dr. Arvind Sharma' },
    { id: 2, name: 'Network Engineering Lab', code: 'LAB-NT-202', room_no: 'Room 305', incharge_name: 'Prof. Priya Menon' },
    { id: 3, name: 'Electronics & IoT Systems Lab', code: 'LAB-EC-303', room_no: 'Room 214', incharge_name: 'Dr. Ramesh Kulkarni' },
    { id: 4, name: 'Software Development & Testing Lab', code: 'LAB-SD-404', room_no: 'Room 402', incharge_name: 'Prof. Neha Gupta' }
  ],
  categories: [
    { id: 1, name: 'Computers & Workstations', description: 'Desktop towers, iMacs, and HPC rigs' },
    { id: 2, name: 'Networking Devices', description: 'Cisco routers, switches, patch panels, and APs' },
    { id: 3, name: 'Electronic Equipment', description: 'DSOs, Function Generators, Multimeters' },
    { id: 4, name: 'Software Licenses', description: 'MatLab, AutoCAD, IntelliJ Ultimate' },
    { id: 5, name: 'Peripherals & Displays', description: '4K monitors, graphic tablets, printers' }
  ],
  users: [
    { id: 1, name: 'System Administrator', email: 'admin@college.edu', role: 'Admin', department: 'Information Technology' },
    { id: 2, name: 'Dr. Arvind Sharma', email: 'arvind.sharma@college.edu', role: 'Faculty', department: 'Computer Science' },
    { id: 3, name: 'Suresh Verma', email: 'suresh.lab@college.edu', role: 'Lab Assistant', department: 'Computer Science' },
    { id: 4, name: 'Ananya Roy', email: 'ananya.roy@student.edu', role: 'Student', department: 'Computer Science' },
    { id: 5, name: 'Rohan Mehta', email: 'rohan.mehta@student.edu', role: 'Student', department: 'Information Technology' }
  ],
  equipment: [
    {
      id: 1,
      asset_tag: 'EQ-CS-001',
      name: 'Dell Precision 3660 Workstation',
      category_id: 1,
      laboratory_id: 1,
      model_number: 'Precision-3660',
      serial_number: 'SN-DELL-9981',
      status: 'Available',
      purchase_date: '2024-01-15',
      warranty_expiry: '2027-01-15',
      specifications: 'Intel Core i9 13th Gen, 64GB DDR5 RAM, RTX 4080 16GB, 2TB NVMe SSD'
    },
    {
      id: 2,
      asset_tag: 'EQ-CS-002',
      name: 'Apple iMac 24" M3',
      category_id: 1,
      laboratory_id: 1,
      model_number: 'A2686-M3',
      serial_number: 'SN-APPL-7741',
      status: 'Allocated',
      purchase_date: '2024-03-10',
      warranty_expiry: '2026-03-10',
      specifications: 'Apple M3 8-core CPU, 16GB Unified RAM, 512GB SSD, Retina 4.5K'
    },
    {
      id: 3,
      asset_tag: 'EQ-NT-001',
      name: 'Cisco Catalyst 9300 48-Port Switch',
      category_id: 2,
      laboratory_id: 2,
      model_number: 'C9300-48P',
      serial_number: 'SN-CSCO-4412',
      status: 'Available',
      purchase_date: '2023-08-20',
      warranty_expiry: '2026-08-20',
      specifications: '48x Gigabit PoE+ ports, 4x 10G SFP+ Uplinks, Layer 3 Enterprise'
    },
    {
      id: 4,
      asset_tag: 'EQ-NT-002',
      name: 'Fortinet FortiGate 60F Firewall',
      category_id: 2,
      laboratory_id: 2,
      model_number: 'FG-60F',
      serial_number: 'SN-FORT-1102',
      status: 'Under Maintenance',
      purchase_date: '2023-11-05',
      warranty_expiry: '2025-11-05',
      specifications: '10x GE RJ45 ports, 1Gbps Threat Protection, SSL-VPN enabled'
    },
    {
      id: 5,
      asset_tag: 'EQ-EC-001',
      name: 'Keysight InfiniiVision 100MHz Oscilloscope',
      category_id: 3,
      laboratory_id: 3,
      model_number: 'EDX1102G',
      serial_number: 'SN-KEYS-5521',
      status: 'Available',
      purchase_date: '2023-06-12',
      warranty_expiry: '2026-06-12',
      specifications: '2 Channels, 100MHz Bandwidth, 1 GSa/s, Built-in Waveform Generator'
    },
    {
      id: 6,
      asset_tag: 'EQ-EC-002',
      name: 'Rigol DG1022Z Function Generator',
      category_id: 3,
      laboratory_id: 3,
      model_number: 'DG1022Z',
      serial_number: 'SN-RIGO-3319',
      status: 'Damaged',
      purchase_date: '2023-04-18',
      warranty_expiry: '2025-04-18',
      specifications: '2 Channels, 25 MHz, Sine/Square/Ramp/Pulse, 200 MSa/s sample rate'
    },
    {
      id: 7,
      asset_tag: 'EQ-SW-001',
      name: 'MATLAB Campus-Wide Enterprise License',
      category_id: 4,
      laboratory_id: 1,
      model_number: 'ML-CAMP-2024',
      serial_number: 'LIC-MAT-8849',
      status: 'Available',
      purchase_date: '2024-01-01',
      warranty_expiry: '2025-12-31',
      specifications: 'Unlimited Campus Concurrent Seat License including Simulink'
    },
    {
      id: 8,
      asset_tag: 'EQ-PD-001',
      name: 'Wacom Cintiq Pro 16 Drawing Tablet',
      category_id: 5,
      laboratory_id: 4,
      model_number: 'DTH-1620',
      serial_number: 'SN-WACO-6610',
      status: 'Allocated',
      purchase_date: '2024-02-14',
      warranty_expiry: '2026-02-14',
      specifications: '15.6 Inch 4K UHD, 8192 Pressure Levels, Pro Pen 2 included'
    }
  ],
  allocations: [
    {
      id: 1,
      equipment_id: 2,
      allocated_to_user_id: 4,
      allocated_by_user_id: 3,
      allocation_date: '2026-10-01',
      expected_return_date: '2026-10-15',
      actual_return_date: null,
      purpose: 'B.Tech Capstone Project: Computer Vision on iOS simulator',
      status: 'Active'
    },
    {
      id: 2,
      equipment_id: 8,
      allocated_to_user_id: 5,
      allocated_by_user_id: 3,
      allocation_date: '2026-09-25',
      expected_return_date: '2026-10-10',
      actual_return_date: null,
      purpose: 'UI/UX Design competition submission for college tech fest',
      status: 'Active'
    },
    {
      id: 3,
      equipment_id: 1,
      allocated_to_user_id: 4,
      allocated_by_user_id: 2,
      allocation_date: '2026-08-10',
      expected_return_date: '2026-08-24',
      actual_return_date: '2026-08-23',
      purpose: 'Deep Learning Model training benchmark test',
      status: 'Returned'
    }
  ],
  maintenance: [
    {
      id: 1,
      equipment_id: 4,
      reported_by_user_id: 3,
      issue_description: 'Power supply intermittent failure, router rebooting during packet transmission test',
      severity: 'High',
      status: 'In Progress',
      resolution_notes: 'Diagnosis in progress with Fortinet authorized service center',
      cost: 250.00,
      reported_at: '2026-10-02 10:30:00',
      resolved_at: null
    },
    {
      id: 2,
      equipment_id: 6,
      reported_by_user_id: 2,
      issue_description: 'Ch 1 BNC connector loose, smoke odor noticed during signal modulation experiment',
      severity: 'Critical',
      status: 'Reported',
      resolution_notes: null,
      cost: 0.00,
      reported_at: '2026-10-05 14:15:00',
      resolved_at: null
    },
    {
      id: 3,
      equipment_id: 1,
      reported_by_user_id: 3,
      issue_description: 'Cooling fan making loud noise during GPU stress test',
      severity: 'Low',
      status: 'Resolved',
      resolution_notes: 'Internal heatsink cleaned and thermal paste reapplied with fan replacement',
      cost: 45.00,
      reported_at: '2026-09-15 09:00:00',
      resolved_at: '2026-09-17 16:30:00'
    }
  ]
};

async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'college_lab_db';
  const port = Number(process.env.DB_PORT) || 3306;

  try {
    const pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000
    });

    // Test connectivity
    const connection = await pool.getConnection();
    connection.release();
    dbPool = pool;
    isUsingFallback = false;
    console.log(`[Database] Connected successfully to MySQL (${host}:${port}/${database})`);
  } catch (err) {
    console.warn(`[Database] MySQL unavailable (${err.message}). Using high-performance Memory/Mock Database Engine.`);
    isUsingFallback = true;
  }
}

// Unified query executor supporting both real MySQL and Memory Engine
async function query(sql, params = []) {
  if (!isUsingFallback && dbPool) {
    try {
      const [results] = await dbPool.execute(sql, params);
      return results;
    } catch (err) {
      console.error('[MySQL Execution Error]:', err.message);
      throw err;
    }
  }

  // Fallback simulator providing full JOIN, COUNT, GROUP BY, UPDATE, DELETE logic
  return executeMockQuery(sql, params);
}

function executeMockQuery(sql, params) {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');
  const upper = cleanSql.toUpperCase();

  // 1. SELECT equipment with JOIN categories, laboratories
  if (upper.includes('FROM EQUIPMENT E') && upper.includes('JOIN CATEGORIES') && upper.includes('JOIN LABORATORIES')) {
    let rows = mockStore.equipment.map(eq => {
      const cat = mockStore.categories.find(c => c.id === eq.category_id) || {};
      const lab = mockStore.laboratories.find(l => l.id === eq.laboratory_id) || {};
      return {
        ...eq,
        category_name: cat.name || 'Unknown',
        laboratory_name: lab.name || 'Unknown',
        room_no: lab.room_no || '',
        incharge_name: lab.incharge_name || ''
      };
    });

    // Handle WHERE e.id = ?
    if (upper.includes('WHERE E.ID = ?')) {
      const targetId = Number(params[0]);
      return rows.filter(r => r.id === targetId);
    }
    return rows.reverse();
  }

  // 2. SELECT single equipment without joins or with
  if (upper.startsWith('SELECT * FROM EQUIPMENT WHERE ID = ?')) {
    const id = Number(params[0]);
    return mockStore.equipment.filter(e => e.id === id);
  }

  // 3. SELECT ALL LABORATORIES
  if (upper.startsWith('SELECT * FROM LABORATORIES')) {
    return mockStore.laboratories;
  }

  // 4. SELECT ALL CATEGORIES
  if (upper.startsWith('SELECT * FROM CATEGORIES')) {
    return mockStore.categories;
  }

  // 5. SELECT ALL USERS
  if (upper.startsWith('SELECT * FROM USERS')) {
    return mockStore.users;
  }

  // 6. SELECT ALLOCATIONS with JOIN
  if (upper.includes('FROM ALLOCATIONS A') && upper.includes('JOIN EQUIPMENT')) {
    let rows = mockStore.allocations.map(a => {
      const eq = mockStore.equipment.find(e => e.id === a.equipment_id) || {};
      const borrower = mockStore.users.find(u => u.id === a.allocated_to_user_id) || {};
      const issuer = mockStore.users.find(u => u.id === a.allocated_by_user_id) || {};
      return {
        id: a.id,
        equipment_id: a.equipment_id,
        asset_tag: eq.asset_tag || 'N/A',
        equipment_name: eq.name || 'Unknown',
        allocated_to_user_id: a.allocated_to_user_id,
        borrower_name: borrower.name || 'Unknown',
        borrower_email: borrower.email || '',
        borrower_role: borrower.role || '',
        allocated_by_user_id: a.allocated_by_user_id,
        issued_by_name: issuer.name || 'Unknown',
        allocation_date: a.allocation_date,
        expected_return_date: a.expected_return_date,
        actual_return_date: a.actual_return_date,
        purpose: a.purpose,
        status: a.status
      };
    });
    return rows.reverse();
  }

  // 7. SELECT MAINTENANCE with JOIN
  if (upper.includes('FROM MAINTENANCE M') && upper.includes('JOIN EQUIPMENT')) {
    let rows = mockStore.maintenance.map(m => {
      const eq = mockStore.equipment.find(e => e.id === m.equipment_id) || {};
      const lab = mockStore.laboratories.find(l => l.id === eq.laboratory_id) || {};
      const reporter = mockStore.users.find(u => u.id === m.reported_by_user_id) || {};
      return {
        id: m.id,
        equipment_id: m.equipment_id,
        asset_tag: eq.asset_tag || 'N/A',
        equipment_name: eq.name || 'Unknown',
        laboratory_name: lab.name || 'Unknown',
        reported_by_user_id: m.reported_by_user_id,
        reported_by: reporter.name || 'Unknown',
        issue_description: m.issue_description,
        severity: m.severity,
        status: m.status,
        resolution_notes: m.resolution_notes,
        cost: m.cost,
        reported_at: m.reported_at,
        resolved_at: m.resolved_at
      };
    });
    return rows.reverse();
  }

  // 8. INSERT INTO EQUIPMENT
  if (upper.startsWith('INSERT INTO EQUIPMENT')) {
    const newId = (mockStore.equipment.length ? Math.max(...mockStore.equipment.map(e => e.id)) : 0) + 1;
    const [asset_tag, name, category_id, laboratory_id, model_number, serial_number, status, purchase_date, warranty_expiry, specifications] = params;
    const newItem = {
      id: newId,
      asset_tag,
      name,
      category_id: Number(category_id),
      laboratory_id: Number(laboratory_id),
      model_number: model_number || '',
      serial_number: serial_number || '',
      status: status || 'Available',
      purchase_date: purchase_date || new Date().toISOString().split('T')[0],
      warranty_expiry: warranty_expiry || null,
      specifications: specifications || ''
    };
    mockStore.equipment.push(newItem);
    return { insertId: newId, affectedRows: 1 };
  }

  // 9. UPDATE EQUIPMENT
  if (upper.startsWith('UPDATE EQUIPMENT SET')) {
    // Check if it's full update or status update
    if (upper.includes('STATUS = ? WHERE ID = ?')) {
      const [newStatus, id] = params;
      const item = mockStore.equipment.find(e => e.id === Number(id));
      if (item) {
        item.status = newStatus;
        return { affectedRows: 1 };
      }
      return { affectedRows: 0 };
    } else {
      const [name, category_id, laboratory_id, model_number, serial_number, status, purchase_date, warranty_expiry, specifications, id] = params;
      const item = mockStore.equipment.find(e => e.id === Number(id));
      if (item) {
        item.name = name;
        item.category_id = Number(category_id);
        item.laboratory_id = Number(laboratory_id);
        item.model_number = model_number;
        item.serial_number = serial_number;
        item.status = status;
        item.purchase_date = purchase_date;
        item.warranty_expiry = warranty_expiry;
        item.specifications = specifications;
        return { affectedRows: 1 };
      }
      return { affectedRows: 0 };
    }
  }

  // 10. DELETE FROM EQUIPMENT
  if (upper.startsWith('DELETE FROM EQUIPMENT WHERE ID = ?')) {
    const id = Number(params[0]);
    const idx = mockStore.equipment.findIndex(e => e.id === id);
    if (idx !== -1) {
      mockStore.equipment.splice(idx, 1);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 11. INSERT INTO ALLOCATIONS
  if (upper.startsWith('INSERT INTO ALLOCATIONS')) {
    const newId = (mockStore.allocations.length ? Math.max(...mockStore.allocations.map(a => a.id)) : 0) + 1;
    const [equipment_id, allocated_to_user_id, allocated_by_user_id, allocation_date, expected_return_date, purpose] = params;
    mockStore.allocations.push({
      id: newId,
      equipment_id: Number(equipment_id),
      allocated_to_user_id: Number(allocated_to_user_id),
      allocated_by_user_id: Number(allocated_by_user_id),
      allocation_date,
      expected_return_date,
      actual_return_date: null,
      purpose,
      status: 'Active'
    });
    // Mark equipment as Allocated
    const eq = mockStore.equipment.find(e => e.id === Number(equipment_id));
    if (eq) eq.status = 'Allocated';
    return { insertId: newId, affectedRows: 1 };
  }

  // 12. UPDATE ALLOCATIONS (Return Equipment)
  if (upper.startsWith('UPDATE ALLOCATIONS SET STATUS = ?')) {
    const [status, actual_return_date, id] = params;
    const alloc = mockStore.allocations.find(a => a.id === Number(id));
    if (alloc) {
      alloc.status = status;
      alloc.actual_return_date = actual_return_date;
      const eq = mockStore.equipment.find(e => e.id === alloc.equipment_id);
      if (eq) eq.status = 'Available';
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 13. INSERT INTO MAINTENANCE (Report Damage / Issue)
  if (upper.startsWith('INSERT INTO MAINTENANCE')) {
    const newId = (mockStore.maintenance.length ? Math.max(...mockStore.maintenance.map(m => m.id)) : 0) + 1;
    const [equipment_id, reported_by_user_id, issue_description, severity, status] = params;
    mockStore.maintenance.push({
      id: newId,
      equipment_id: Number(equipment_id),
      reported_by_user_id: Number(reported_by_user_id),
      issue_description,
      severity: severity || 'Medium',
      status: status || 'Reported',
      resolution_notes: null,
      cost: 0.00,
      reported_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      resolved_at: null
    });
    // Update equipment status
    const eq = mockStore.equipment.find(e => e.id === Number(equipment_id));
    if (eq) {
      eq.status = severity === 'Critical' ? 'Damaged' : 'Under Maintenance';
    }
    return { insertId: newId, affectedRows: 1 };
  }

  // 14. UPDATE MAINTENANCE (Status / Resolution)
  if (upper.startsWith('UPDATE MAINTENANCE SET STATUS = ?')) {
    const [status, resolution_notes, cost, resolved_at, id] = params;
    const m = mockStore.maintenance.find(item => item.id === Number(id));
    if (m) {
      m.status = status;
      m.resolution_notes = resolution_notes || m.resolution_notes;
      m.cost = cost !== undefined ? Number(cost) : m.cost;
      m.resolved_at = resolved_at;
      // If resolved, set equipment back to Available
      if (status === 'Resolved') {
        const eq = mockStore.equipment.find(e => e.id === m.equipment_id);
        if (eq) eq.status = 'Available';
      }
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 15. REPORTS: GROUP BY Laboratory
  if (upper.includes('GROUP BY L.ID') && upper.includes('COUNT(E.ID) AS TOTAL_EQUIPMENT')) {
    return mockStore.laboratories.map(lab => {
      const count = mockStore.equipment.filter(e => e.laboratory_id === lab.id).length;
      return {
        laboratory_id: lab.id,
        laboratory_name: lab.name,
        laboratory_code: lab.code,
        total_equipment: count
      };
    });
  }

  // 16. REPORTS: GROUP BY Category
  if (upper.includes('GROUP BY C.ID') && upper.includes('COUNT(E.ID) AS EQUIPMENT_COUNT')) {
    return mockStore.categories.map(cat => {
      const count = mockStore.equipment.filter(e => e.category_id === cat.id).length;
      return {
        category_id: cat.id,
        category_name: cat.name,
        equipment_count: count
      };
    });
  }

  // 17. REPORTS: GROUP BY Status
  if (upper.includes('STATUS, COUNT(*) AS COUNT FROM EQUIPMENT GROUP BY STATUS')) {
    const counts = {};
    mockStore.equipment.forEach(e => {
      counts[e.status] = (counts[e.status] || 0) + 1;
    });
    return Object.keys(counts).map(status => ({
      status,
      count: counts[status]
    }));
  }

  // 18. REPORTS: GROUP BY Severity & Status in Maintenance
  if (upper.includes('GROUP BY SEVERITY, STATUS')) {
    const groups = {};
    mockStore.maintenance.forEach(m => {
      const key = `${m.severity}_${m.status}`;
      if (!groups[key]) {
        groups[key] = { severity: m.severity, status: m.status, total_tickets: 0, total_cost: 0 };
      }
      groups[key].total_tickets += 1;
      groups[key].total_cost += Number(m.cost || 0);
    });
    return Object.values(groups);
  }

  console.warn('[Mock DB] Unmatched query executed:', sql);
  return [];
}

function getDatabaseStatus() {
  return {
    engine: isUsingFallback ? 'In-Memory SQL Store (Development/Demo Mode)' : 'Live MySQL Server',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'college_lab_db',
    isFallback: isUsingFallback
  };
}

module.exports = {
  initDB,
  query,
  getDatabaseStatus
};
