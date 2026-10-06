-- ========================================================
-- Seed Data for College Laboratory Equipment Management System
-- ========================================================

USE college_lab_db;

-- Insert Laboratories
INSERT INTO laboratories (id, name, code, room_no, incharge_name) VALUES
(1, 'Advanced Computing & AI Lab', 'LAB-CS-101', 'Room 301', 'Dr. Arvind Sharma'),
(2, 'Network Engineering Lab', 'LAB-NT-202', 'Room 305', 'Prof. Priya Menon'),
(3, 'Electronics & IoT Systems Lab', 'LAB-EC-303', 'Room 214', 'Dr. Ramesh Kulkarni'),
(4, 'Software Development & Testing Lab', 'LAB-SD-404', 'Room 402', 'Prof. Neha Gupta')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Computers & Workstations', 'Desktop towers, iMacs, and High Performance Computing rigs'),
(2, 'Networking Devices', 'Cisco routers, switches, patch panels, and access points'),
(3, 'Electronic Equipment', 'Digital Storage Oscilloscopes, Signal Generators, Multimeters'),
(4, 'Software Licenses', 'MatLab, AutoCAD, IntelliJ Ultimate, and VMware ESXi keys'),
(5, 'Peripherals & Displays', '4K monitors, graphic tablets, and laser printers')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Users
INSERT INTO users (id, name, email, role, department) VALUES
(1, 'System Administrator', 'admin@college.edu', 'Admin', 'Information Technology'),
(2, 'Dr. Arvind Sharma', 'arvind.sharma@college.edu', 'Faculty', 'Computer Science'),
(3, 'Suresh Verma', 'suresh.lab@college.edu', 'Lab Assistant', 'Computer Science'),
(4, 'Ananya Roy', 'ananya.roy@student.edu', 'Student', 'Computer Science'),
(5, 'Rohan Mehta', 'rohan.mehta@student.edu', 'Student', 'Information Technology')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Equipment
INSERT INTO equipment (id, asset_tag, name, category_id, laboratory_id, model_number, serial_number, status, purchase_date, warranty_expiry, specifications) VALUES
(1, 'EQ-CS-001', 'Dell Precision 3660 Workstation', 1, 1, 'Precision-3660', 'SN-DELL-9981', 'Available', '2024-01-15', '2027-01-15', 'Intel Core i9 13th Gen, 64GB DDR5 RAM, RTX 4080 16GB, 2TB NVMe SSD'),
(2, 'EQ-CS-002', 'Apple iMac 24" M3', 1, 1, 'A2686-M3', 'SN-APPL-7741', 'Allocated', '2024-03-10', '2026-03-10', 'Apple M3 8-core CPU, 16GB Unified RAM, 512GB SSD, Retina 4.5K'),
(3, 'EQ-NT-001', 'Cisco Catalyst 9300 48-Port Switch', 2, 2, 'C9300-48P', 'SN-CSCO-4412', 'Available', '2023-08-20', '2026-08-20', '48x Gigabit PoE+ ports, 4x 10G SFP+ Uplinks, Layer 3 Enterprise'),
(4, 'EQ-NT-002', 'Fortinet FortiGate 60F Firewall', 2, 2, 'FG-60F', 'SN-FORT-1102', 'Under Maintenance', '2023-11-05', '2025-11-05', '10x GE RJ45 ports, 1Gbps Threat Protection, SSL-VPN enabled'),
(5, 'EQ-EC-001', 'Keysight InfiniiVision 100MHz Oscilloscope', 3, 3, 'EDX1102G', 'SN-KEYS-5521', 'Available', '2023-06-12', '2026-06-12', '2 Channels, 100MHz Bandwidth, 1 GSa/s, Built-in Waveform Generator'),
(6, 'EQ-EC-002', 'Rigol DG1022Z Function Generator', 3, 3, 'DG1022Z', 'SN-RIGO-3319', 'Damaged', '2023-04-18', '2025-04-18', '2 Channels, 25 MHz, Sine/Square/Ramp/Pulse, 200 MSa/s sample rate'),
(7, 'EQ-SW-001', 'MATLAB Campus-Wide Enterprise License', 4, 1, 'ML-CAMP-2024', 'LIC-MAT-8849', 'Available', '2024-01-01', '2025-12-31', 'Unlimited Campus Concurrent Seat License including Simulink & Toolboxes'),
(8, 'EQ-PD-001', 'Wacom Cintiq Pro 16 Drawing Tablet', 5, 4, 'DTH-1620', 'SN-WACO-6610', 'Allocated', '2024-02-14', '2026-02-14', '15.6 Inch 4K UHD, 8192 Pressure Levels, Pro Pen 2 included')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Allocations
INSERT INTO allocations (id, equipment_id, allocated_to_user_id, allocated_by_user_id, allocation_date, expected_return_date, actual_return_date, purpose, status) VALUES
(1, 2, 4, 3, '2026-10-01', '2026-10-15', NULL, 'B.Tech Capstone Project: Computer Vision on iOS simulator', 'Active'),
(2, 8, 5, 3, '2026-09-25', '2026-10-10', NULL, 'UI/UX Design competition submission for college tech fest', 'Active'),
(3, 1, 4, 2, '2026-08-10', '2026-08-24', '2026-08-23', 'Deep Learning Model training benchmark test', 'Returned');

-- Insert Maintenance Records
INSERT INTO maintenance (id, equipment_id, reported_by_user_id, issue_description, severity, status, resolution_notes, cost, reported_at, resolved_at) VALUES
(1, 4, 3, 'Power supply intermittent failure, router rebooting during packet transmission test', 'High', 'In Progress', 'Diagnosis in progress with Fortinet authorized hardware service center', 250.00, '2026-10-02 10:30:00', NULL),
(2, 6, 2, 'Ch 1 BNC connector loose, smoke odor noticed during signal modulation experiment', 'Critical', 'Reported', NULL, 0.00, '2026-10-05 14:15:00', NULL),
(3, 1, 3, 'Cooling fan making loud noise during GPU stress test', 'Low', 'Resolved', 'Internal heatsink cleaned and thermal paste reapplied with fan replacement', 45.00, '2026-09-15 09:00:00', '2026-09-17 16:30:00');
