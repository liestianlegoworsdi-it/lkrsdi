
import Database from 'better-sqlite3';

const db = new Database('accounting.db');
const period = '2025-03';

console.log(`Checking accounts starting with '2' for period ${period}`);
const rows = db.prepare("SELECT account_code, account_name, final_debit, final_credit FROM trial_balance WHERE period = ? AND account_code LIKE '2%' ORDER BY account_code ASC").all(period);

rows.forEach(row => {
    console.log(`${row.account_code} | ${row.account_name} | D: ${row.final_debit} | K: ${row.final_credit}`);
});

const totalK = rows.reduce((acc, row) => acc + (row.final_credit - row.final_debit), 0);
console.log(`Total Liabilities (K-D): ${totalK}`);

// Check specifically for "21"
const rows21 = rows.filter(r => r.account_code.startsWith('21'));
const total21 = rows21.reduce((acc, row) => acc + (row.final_credit - row.final_debit), 0);
console.log(`Total 21 (K-D): ${total21}`);

// Check if any account is considered parent
const isParentAccount = (code) => {
    if (!code || code.length < 4) return false;
    const trailing = code.slice(3);
    return trailing.split('').every(char => char === '0');
};

const total21NoParent = rows21.filter(r => !isParentAccount(r.account_code)).reduce((acc, row) => acc + (row.final_credit - row.final_debit), 0);
console.log(`Total 21 No Parent (K-D): ${total21NoParent}`);
