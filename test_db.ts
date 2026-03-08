import Database from 'better-sqlite3';

try {
  const db = new Database('accounting.db');
  console.log('Database opened successfully');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables);
  db.close();
} catch (err) {
  console.error('Error opening database:', err);
}
