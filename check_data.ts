
import Database from 'better-sqlite3';

const db = new Database('accounting.db');

console.log("--- Checking Budget Table ---");
const budgetSummary = db.prepare("SELECT year, month, COUNT(*) as count FROM budget GROUP BY year, month ORDER BY year, month").all();
console.log("Budget Summary:", budgetSummary);

console.log("\n--- Checking Trial Balance Table ---");
const trialBalanceSummary = db.prepare("SELECT period, COUNT(*) as count FROM trial_balance GROUP BY period ORDER BY period").all();
console.log("Trial Balance Summary:", trialBalanceSummary);

console.log("\n--- Checking for January 2026 Budget ---");
const jan2026Budget = db.prepare("SELECT * FROM budget WHERE year = 2026 AND month = 1 LIMIT 5").all();
console.log("Jan 2026 Budget (first 5):", jan2026Budget);
