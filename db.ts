import sqlite3 from 'better-sqlite3';
import path from 'path';

const db = new sqlite3('accounting.db');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    icon TEXT,
    color TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category_id INTEGER,
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id)
  );
`);

// Seed initial categories if empty
const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
if (categoryCount.count === 0) {
  const insertCategory = db.prepare('INSERT INTO categories (name, type, icon, color) VALUES (?, ?, ?, ?)');
  
  // Income categories
  insertCategory.run('Gaji', 'income', 'Wallet', '#10b981');
  insertCategory.run('Investasi', 'income', 'TrendingUp', '#3b82f6');
  insertCategory.run('Penjualan', 'income', 'ShoppingBag', '#f59e0b');
  
  // Expense categories
  insertCategory.run('Makanan', 'expense', 'Utensils', '#ef4444');
  insertCategory.run('Transportasi', 'expense', 'Car', '#6366f1');
  insertCategory.run('Sewa', 'expense', 'Home', '#8b5cf6');
  insertCategory.run('Hiburan', 'expense', 'Music', '#ec4899');
  insertCategory.run('Lainnya', 'expense', 'MoreHorizontal', '#64748b');
}

export default db;
