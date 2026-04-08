-- FNX Trading Platform - MySQL Schema Setup
-- Run this script to create the database and tables:
--   mysql -u root -p < scripts/setup-db.sql

CREATE DATABASE IF NOT EXISTS fnx_trading;
USE fnx_trading;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(64) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Open positions
CREATE TABLE IF NOT EXISTS positions (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  instrument_id VARCHAR(50) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  side ENUM('buy', 'sell') NOT NULL,
  type ENUM('market', 'limit', 'stop') NOT NULL,
  open_price DECIMAL(20, 8) NOT NULL,
  current_price DECIMAL(20, 8) NOT NULL,
  quantity DECIMAL(15, 4) NOT NULL,
  leverage INT NOT NULL,
  stop_loss DECIMAL(20, 8) DEFAULT NULL,
  take_profit DECIMAL(20, 8) DEFAULT NULL,
  profit_loss DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  profit_loss_percent DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  margin DECIMAL(15, 2) NOT NULL,
  swap DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  commission DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  open_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('open', 'closed', 'pending') NOT NULL DEFAULT 'open',
  INDEX idx_user_status (user_id, status),
  INDEX idx_instrument (instrument_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trade history (closed positions)
CREATE TABLE IF NOT EXISTS trade_history (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  instrument_id VARCHAR(50) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  side ENUM('buy', 'sell') NOT NULL,
  type ENUM('market', 'limit', 'stop') NOT NULL,
  open_price DECIMAL(20, 8) NOT NULL,
  close_price DECIMAL(20, 8) NOT NULL,
  quantity DECIMAL(15, 4) NOT NULL,
  leverage INT NOT NULL,
  stop_loss DECIMAL(20, 8) DEFAULT NULL,
  take_profit DECIMAL(20, 8) DEFAULT NULL,
  profit_loss DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  profit_loss_percent DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  margin DECIMAL(15, 2) NOT NULL,
  swap DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  commission DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  open_time TIMESTAMP NOT NULL,
  close_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  duration VARCHAR(50) NOT NULL DEFAULT '',
  status ENUM('open', 'closed', 'pending') NOT NULL DEFAULT 'closed',
  INDEX idx_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Pending orders
CREATE TABLE IF NOT EXISTS pending_orders (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  instrument_id VARCHAR(50) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  side ENUM('buy', 'sell') NOT NULL,
  type ENUM('limit', 'stop') NOT NULL,
  target_price DECIMAL(20, 8) NOT NULL,
  quantity DECIMAL(15, 4) NOT NULL,
  leverage INT NOT NULL,
  stop_loss DECIMAL(20, 8) DEFAULT NULL,
  take_profit DECIMAL(20, 8) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed admin user (password: admin123, SHA256 hashed)
INSERT IGNORE INTO users (id, name, email, password, role, balance)
VALUES (
  UUID(),
  'Admin',
  'admin@fnxtrading.com',
  'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  'admin',
  0.00
);
