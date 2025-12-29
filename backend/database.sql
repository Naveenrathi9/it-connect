-- Create the database
CREATE DATABASE IF NOT EXISTS it_store_db;

-- Use the database
USE it_store_db;

-- Create IT Asset Returns table
CREATE TABLE IF NOT EXISTS it_asset_returns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    emp_code VARCHAR(50) NOT NULL,
    emp_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    make_of_old_asset VARCHAR(100) NOT NULL,
    model_of_asset VARCHAR(100) NOT NULL,
    asset_no_to_return VARCHAR(50) NOT NULL,
    sap_item_code VARCHAR(50) NOT NULL,
    cost_center VARCHAR(50) NOT NULL,
    remarks TEXT,
    status ENUM('Pending', 'In Progress', 'Accepted') DEFAULT 'Pending',
    store_comment TEXT,
    received_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_asset_return (asset_no_to_return)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add sample data (optional)
INSERT INTO it_asset_returns 
(department, emp_code, emp_name, email, make_of_old_asset, model_of_asset, asset_no_to_return, sap_item_code, cost_center, remarks, status)
VALUES 
('IT', 'EMP001', 'John Doe', 'john@example.com', 'Dell', 'Latitude 5420', 'AST001', 'SAP001', 'CC001', 'Laptop not working', 'Pending'),
('HR', 'EMP002', 'Jane Smith', 'jane@example.com', 'HP', 'EliteBook 840', 'AST002', 'SAP002', 'CC002', 'For upgrade', 'In Progress');
