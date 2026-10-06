-- ========================================================
-- College Laboratory Equipment Management System
-- Database Schema (MySQL)
-- ========================================================

CREATE DATABASE IF NOT EXISTS college_lab_db;
USE college_lab_db;

-- 1. Laboratories Table
CREATE TABLE IF NOT EXISTS laboratories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    room_no VARCHAR(30) NOT NULL,
    incharge_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users Table (Students, Faculty, Lab Assistants, Admins)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    role ENUM('Admin', 'Faculty', 'Lab Assistant', 'Student') NOT NULL DEFAULT 'Student',
    department VARCHAR(80) NOT NULL DEFAULT 'Computer Science',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_tag VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category_id INT NOT NULL,
    laboratory_id INT NOT NULL,
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    status ENUM('Available', 'Allocated', 'Under Maintenance', 'Damaged', 'Decommissioned') NOT NULL DEFAULT 'Available',
    purchase_date DATE,
    warranty_expiry DATE,
    specifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (laboratory_id) REFERENCES laboratories(id) ON DELETE RESTRICT
);

-- 5. Allocations Table
CREATE TABLE IF NOT EXISTS allocations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    allocated_to_user_id INT NOT NULL,
    allocated_by_user_id INT NOT NULL,
    allocation_date DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date DATE NULL,
    purpose TEXT NOT NULL,
    status ENUM('Active', 'Returned') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (allocated_to_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (allocated_by_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- 6. Maintenance Table
CREATE TABLE IF NOT EXISTS maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    reported_by_user_id INT NOT NULL,
    issue_description TEXT NOT NULL,
    severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
    status ENUM('Reported', 'In Progress', 'Resolved', 'Beyond Repair') NOT NULL DEFAULT 'Reported',
    resolution_notes TEXT NULL,
    cost DECIMAL(10,2) DEFAULT 0.00,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by_user_id) REFERENCES users(id) ON DELETE RESTRICT
);
