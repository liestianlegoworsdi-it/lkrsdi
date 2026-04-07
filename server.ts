import express from "express";
import { createServer as createViteServer } from "vite";
import { parse } from "csv-parse";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: any;
try {
  const dbPath = process.env.VERCEL ? path.join("/tmp", "accounting.db") : path.join(process.cwd(), "accounting.db");
  console.log(`Initializing database at: ${dbPath}`);
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
} catch (err) {
  console.error("Failed to initialize database, using in-memory fallback:", err);
  db = new Database(":memory:");
}

// Initialize database tables with error handling
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS trial_balance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      period TEXT,
      account_code TEXT,
      account_name TEXT,
      initial_debit REAL,
      initial_credit REAL,
      mutation_debit REAL,
      mutation_credit REAL,
      final_debit REAL,
      final_credit REAL,
      UNIQUE(period, account_code)
    );
    
    CREATE TABLE IF NOT EXISTS budget (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER,
      month INTEGER,
      account_code TEXT,
      account_name TEXT,
      amount REAL,
      UNIQUE(year, month, account_code)
    );
  `);
  console.log("Database tables initialized successfully");
} catch (err) {
  console.error("Error creating database tables:", err);
}

const parseNum = (val: any) => {
  if (typeof val === 'number') return val;
  if (val === undefined || val === null || val === "" || val === "0" || val === "-") return 0;
  let s = val.toString().trim();
  const isNegative = (s.startsWith('(') && s.endsWith(')')) || s.startsWith('-') || s.endsWith('-');
  s = s.replace(/[()\-]/g, '');
  
  // Handle Indonesian format (1.234,56) vs International (1,234.56)
  const hasComma = s.includes(',');
  const hasDot = s.includes('.');
  let result = 0;
  
  if (hasComma && hasDot) {
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      result = parseFloat(s.replace(/\./g, '').replace(',', '.'));
    } else {
      result = parseFloat(s.replace(/,/g, ''));
    }
  } else if (hasComma) {
    const parts = s.split(',');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3 && parts[0].length <= 3)) {
      result = parseFloat(s.replace(/,/g, ''));
    } else {
      result = parseFloat(s.replace(',', '.'));
    }
  } else if (hasDot) {
    const parts = s.split('.');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3 && parts[0].length <= 3)) {
      result = parseFloat(s.replace(/\./g, ''));
    } else {
      result = parseFloat(s);
    }
  } else {
    result = parseFloat(s);
  }
  
  const finalVal = isNaN(result) ? 0 : result;
  return isNegative ? -finalVal : finalVal;
};

// Database already initialized above

const FIXED_GAS_API_URL = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbzFaQeASp3y3mFM2QGfM6OA3_2YcP3-TcY4QjtxxViaj7j-Wxm7nLYeC0MfhagInHMR/exec";

function periodToSheetName(period: string): string {
  const [year, month] = period.split("-");
  const monthMap: Record<string, string> = {
    "01": "Januari", "02": "Februari", "03": "Maret", "04": "April", "05": "Mei", "06": "Juni",
    "07": "Juli", "08": "Agustus", "09": "September", "10": "Oktober", "11": "Nopember", "12": "Desember"
  };
  return `${monthMap[month]} ${year}`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Test endpoint
  app.get("/api/ping", (req, res) => res.json({ status: "ok" }));

  // Endpoint for Google Apps Script to push data
  app.get(["/api/sync-push", "/api/sync-push/"], (req, res) => {
    res.json({ status: "online", message: "Endpoint siap menerima data POST" });
  });

  app.post(["/api/sync-push", "/api/sync-push/"], (req, res) => {
    const { type, period, year, data } = req.body;

    if (!type || !data || !Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    try {
      if (type === "trial_balance") {
        if (!period) return res.status(400).json({ error: "Period is required for trial balance" });
        
        const insert = db.prepare(`
          INSERT INTO trial_balance 
          (period, account_code, account_name, initial_debit, initial_credit, mutation_debit, mutation_credit, final_debit, final_credit)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(period, account_code) DO UPDATE SET
          account_name = EXCLUDED.account_name,
          initial_debit = EXCLUDED.initial_debit,
          initial_credit = EXCLUDED.initial_credit,
          mutation_debit = EXCLUDED.mutation_debit,
          mutation_credit = EXCLUDED.mutation_credit,
          final_debit = EXCLUDED.final_debit,
          final_credit = EXCLUDED.final_credit
        `);

        const transaction = db.transaction((rows) => {
          db.prepare("DELETE FROM trial_balance WHERE period = ?").run(period);
          let count = 0;
          let dataStarted = false;

          for (const row of rows) {
            // Handle both object and array formats
            let code, name, initD, initK, mutD, mutK, finD, finK;
            
            if (Array.isArray(row)) {
              [code, name, initD, initK, mutD, mutK, finD, finK] = row;
              
              if (!dataStarted) {
                const cleanCode = code ? code.toString().trim().replace(/[.\s-]/g, '') : "";
                if (cleanCode && /^\d+$/.test(cleanCode) && cleanCode.length >= 3) {
                  dataStarted = true;
                } else continue;
              }
              
              if (!code || code.toString().trim() === "" || code.toString().toLowerCase() === "jumlah") continue;
              
              insert.run(
                period,
                code.toString().trim().replace(/[.\s]/g, ''),
                name ? name.toString() : "",
                parseNum(initD), parseNum(initK),
                parseNum(mutD), parseNum(mutK),
                parseNum(finD), parseNum(finK)
              );
            } else {
              insert.run(
                period,
                row.account_code,
                row.account_name,
                row.initial_debit || 0,
                row.initial_credit || 0,
                row.mutation_debit || 0,
                row.mutation_credit || 0,
                row.final_debit || 0,
                row.final_credit || 0
              );
            }
            count++;
          }
          return count;
        });

        const count = transaction(data);
        return res.json({ success: true, message: `Berhasil push ${count} baris Neraca Saldo`, period });
      } 
      
      if (type === "budget") {
        if (!year) return res.status(400).json({ error: "Year is required for budget" });

        const insert = db.prepare(`
          INSERT INTO budget (year, month, account_code, account_name, amount)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(year, month, account_code) DO UPDATE SET
          account_name = EXCLUDED.account_name,
          amount = EXCLUDED.amount
        `);

        const transaction = db.transaction((rows) => {
          db.prepare("DELETE FROM budget WHERE year = ?").run(year);
          let count = 0;
          let dataStarted = false;

          // Detect column indices for array format
          let codeCol = 0, nameCol = 1, janCol = 2;

          for (const row of rows) {
            if (Array.isArray(row)) {
              const code = row[codeCol];
              const name = row[nameCol];
              
              if (!dataStarted) {
                const cleanCode = code ? code.toString().trim().replace(/[.\s-]/g, '') : "";
                if (cleanCode && /^\d+$/.test(cleanCode) && cleanCode.length >= 3) {
                  dataStarted = true;
                } else {
                  // Try to find header row
                  const rowStr = row.join(" ").toLowerCase();
                  if (rowStr.includes("kode") || rowStr.includes("no. rek")) {
                    codeCol = row.findIndex(c => c && /no\.?\s*rek|kode|acc|account/i.test(c.toString().trim()));
                    nameCol = row.findIndex(c => c && /uraian|nama|akun|rekening|description/i.test(c.toString().trim()));
                    janCol = row.findIndex(c => {
                      const s = c?.toString().trim().toLowerCase();
                      return s === 'jan' || s === 'januari' || s === 'january';
                    });
                    if (codeCol === -1) codeCol = 0;
                    if (nameCol === -1) nameCol = 1;
                    if (janCol === -1) janCol = 2;
                  }
                  continue;
                }
              }
              
              const cleanCode = code ? code.toString().trim().replace(/[.\s-]/g, '') : "";
              if (!code || code.toString().trim() === "" || code.toString().toLowerCase() === "jumlah") continue;
              
              for (let m = 1; m <= 12; m++) {
                const amount = parseNum(row[janCol + m - 1]);
                insert.run(year, m, cleanCode, name ? name.toString() : "", amount);
                count++;
              }
            } else {
              insert.run(
                year,
                row.month,
                row.account_code,
                row.account_name,
                row.amount || 0
              );
              count++;
            }
          }
          return count;
        });

        const count = transaction(data);
        return res.json({ success: true, message: `Berhasil push ${count} baris Anggaran`, year });
      }

      res.status(400).json({ error: "Unknown sync type" });
    } catch (error: any) {
      console.error("Error in sync-push:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/sync-list", async (req, res) => {
    const targetBaseUrl = (req.query.url as string || FIXED_GAS_API_URL).trim();
    console.log(`Fetching sheet list from: ${targetBaseUrl}`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const listRes = await fetch(targetBaseUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!listRes.ok) throw new Error(`GAS API Error: ${listRes.status} ${listRes.statusText}`);
      
      const text = await listRes.text();
      let listResult;
      try {
        listResult = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse GAS API response as JSON:", text.slice(0, 200));
        throw new Error("Respon dari Spreadsheet bukan format JSON yang valid");
      }
      
      res.json(listResult);
    } catch (error: any) {
      console.error("Error fetching sheet list:", error);
      res.status(500).json({ error: error.name === 'AbortError' ? 'Request timeout (15s)' : error.message });
    }
  });

  app.post("/api/fetch-api-url", async (req, res) => {
    const { url, period, syncAll, customSheet } = req.body;
    const targetBaseUrl = (url || FIXED_GAS_API_URL).trim();
    if (!targetBaseUrl) return res.status(400).json({ error: "URL API diperlukan" });

    const monthMap: Record<string, string> = {
      januari: "01", februari: "02", maret: "03", april: "04", mei: "05", juni: "06",
      juli: "07", agustus: "08", september: "09", oktober: "10", nopember: "11", november: "11", desember: "12",
      jan: "01", feb: "02", mar: "03", apr: "04", ags: "08", aug: "08", sep: "09", okt: "10", des: "12"
    };

    const processSheet = (sheetName: string, result: any, clearedBudgetYears: Set<number>) => {
      if (!result.data || !Array.isArray(result.data)) return { count: 0 };
      const rows = result.data;
      const type = (result.type === "budget" || sheetName.toUpperCase().includes("RKAPB") || sheetName.toUpperCase().includes("BUDGET") || sheetName.toUpperCase().includes("ANGGARAN")) ? "budget" : (result.type || "trial_balance");

      if (type === "trial_balance") {
        let detectedPeriod = "";
        const parts = sheetName.split(" ");
        if (parts.length >= 2) {
          const m = monthMap[parts[0].toLowerCase()];
          const y = parts[1];
          if (m && y) detectedPeriod = `${y}-${m}`;
        }
        
        // Fallback to provided period if detection fails
        const finalPeriod = detectedPeriod || period;
        if (!finalPeriod) return { count: 0, error: "Period tidak terdeteksi" };

        const insert = db.prepare(`
          INSERT OR REPLACE INTO trial_balance 
          (period, account_code, account_name, initial_debit, initial_credit, mutation_debit, mutation_credit, final_debit, final_credit)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = db.transaction((dataRows, p) => {
          db.prepare("DELETE FROM trial_balance WHERE period = ?").run(p);
          let inserted = 0;
          let dataStarted = false;
          for (const row of dataRows) {
            const [code, name, initD, initK, mutD, mutK, finD, finK] = row;
            if (!dataStarted) {
              if (code && /^\d/.test(code.toString().trim())) dataStarted = true;
              else continue;
            }
            if (!code || code.toString().trim() === "" || code.toString().toLowerCase() === "jumlah") continue;
            insert.run(p, code.toString().trim().replace(/[.\s]/g, ''), name ? name.toString() : "", parseNum(initD), parseNum(initK), parseNum(mutD), parseNum(mutK), parseNum(finD), parseNum(finK));
            inserted++;
          }
          return inserted;
        });
        const count = transaction(rows, finalPeriod);
        return { count, type: "trial_balance", period: finalPeriod };
      } else if (type === "budget") {
        const yearMatch = sheetName.match(/\d{4}/);
        const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
        
        if (!clearedBudgetYears.has(year)) {
          db.prepare("DELETE FROM budget WHERE year = ?").run(year);
          clearedBudgetYears.add(year);
        }

        const insertBudget = db.prepare(`
          INSERT INTO budget (year, month, account_code, account_name, amount)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(year, month, account_code) DO UPDATE SET amount = EXCLUDED.amount
        `);

        const transaction = db.transaction((dataRows, budgetYear) => {
          let inserted = 0;
          let dataStarted = false;
          let janCol = -1;
          let codeCol = -1;
          let nameCol = -1;

          for (let i = 0; i < Math.min(100, dataRows.length); i++) {
            const r = dataRows[i];
            if (!r || r.length < 3) continue;
            const jIdx = r.findIndex((c: any) => {
              const s = c?.toString().trim().toLowerCase();
              return s === 'jan' || s === 'januari' || s === 'january';
            });
            if (jIdx !== -1) {
              janCol = jIdx;
              const cIdx = r.findIndex((c: any) => c && /no\.?\s*rek|kode|acc|account/i.test(c.toString().trim().toLowerCase()));
              if (cIdx !== -1) codeCol = cIdx;
              const nIdx = r.findIndex((c: any) => c && /uraian|nama|akun|rekening|description/i.test(c.toString().trim().toLowerCase()));
              if (nIdx !== -1) nameCol = nIdx;
              break;
            }
          }

          if (janCol === -1) return 0;
          if (codeCol === -1) codeCol = 0;
          if (nameCol === -1) nameCol = 1;

          for (const row of dataRows) {
            const code = row[codeCol];
            const name = row[nameCol];
            if (!dataStarted) {
              const cleanCode = code ? code.toString().trim().replace(/[.\s-]/g, '') : "";
              if (cleanCode && /^\d+$/.test(cleanCode) && cleanCode.length >= 3) dataStarted = true;
              else continue;
            }
            const cleanCode = code ? code.toString().trim().replace(/[.\s-]/g, '') : "";
            if (!code || code.toString().trim() === "" || code.toString().toLowerCase() === "jumlah") continue;
            for (let m = 1; m <= 12; m++) {
              const colIdx = janCol + m - 1;
              if (colIdx >= row.length) continue;
              const amount = parseNum(row[colIdx]);
              insertBudget.run(budgetYear, m, cleanCode, name ? name.toString() : "", amount);
              inserted++;
            }
          }
          return inserted;
        });
        const count = transaction(rows, year);
        return { count, type: "budget", year };
      }
      return { count: 0 };
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout per sheet

      if (syncAll) {
        console.log(`Full Sync started from: ${targetBaseUrl}`);
        const listRes = await fetch(targetBaseUrl, { signal: controller.signal });
        if (!listRes.ok) throw new Error(`GAS API Error: ${listRes.status}`);
        const listResult = await listRes.json();
        clearTimeout(timeoutId);
        
        if (!listResult.available_sheets || !Array.isArray(listResult.available_sheets)) {
          throw new Error("API tidak mengembalikan daftar sheet yang tersedia");
        }

        const allResults = [];
        const clearedBudgetYears = new Set<number>();

        for (const sheetName of listResult.available_sheets) {
          try {
            const sheetController = new AbortController();
            const sheetTimeoutId = setTimeout(() => sheetController.abort(), 20000);
            
            const targetUrl = `${targetBaseUrl}${targetBaseUrl.includes('?') ? '&' : '?'}sheet=${encodeURIComponent(sheetName)}`;
            const response = await fetch(targetUrl, { signal: sheetController.signal });
            clearTimeout(sheetTimeoutId);
            
            if (!response.ok) {
              console.warn(`Failed to fetch sheet ${sheetName}: ${response.status}`);
              continue;
            }
            const result = await response.json();
            const res = processSheet(sheetName, result, clearedBudgetYears);
            allResults.push({ sheet: sheetName, ...res });
          } catch (e) {
            console.error(`Error syncing sheet ${sheetName}:`, e);
          }
        }
        return res.json({ success: true, results: allResults });
      }

      const sheetName = customSheet || periodToSheetName(period);
      const targetUrl = `${targetBaseUrl}${targetBaseUrl.includes('?') ? '&' : '?'}sheet=${encodeURIComponent(sheetName)}`;
      
      console.log(`Fetching sheet "${sheetName}" from: ${targetUrl}`);
      const response = await fetch(targetUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`GAS API Error: ${response.status} ${response.statusText}`);
      
      const result = await response.json();
      const syncRes = processSheet(sheetName, result, new Set<number>());
      return res.json({ success: true, ...syncRes });
    } catch (error: any) {
      console.error("Error in fetch-api-url:", error);
      const isTimeout = error.name === 'AbortError';
      res.status(500).json({ error: isTimeout ? 'Request timeout' : error.message });
    }
  });

  app.get("/api/budget", (req, res) => {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ success: false, error: "Year is required" });
    }

    try {
      const yearInt = parseInt(year as string);
      const data = db.prepare("SELECT * FROM budget WHERE year = ? ORDER BY account_code ASC, month ASC").all(yearInt);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/neraca-saldo-year", (req, res) => {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }

    const data = db.prepare("SELECT * FROM trial_balance WHERE period LIKE ? ORDER BY period ASC, account_code ASC").all(`${year}-%`);
    res.json(data);
  });

  app.get("/api/neraca-saldo", (req, res) => {
    const { period } = req.query;
    if (!period) {
      return res.status(400).json({ error: "Period is required" });
    }

    const data = db.prepare("SELECT * FROM trial_balance WHERE period = ? ORDER BY account_code ASC").all(period);
    res.json(data);
  });

  app.get("/api/neraca-saldo-ytd", (req, res) => {
    const { period } = req.query;
    if (!period) {
      return res.status(400).json({ error: "Period is required" });
    }

    const [year, month] = (period as string).split("-");
    const startPeriod = `${year}-01`;
    const endPeriod = period;

    // Aggregate YTD: 
    // - For P&L (4,5,6): Sum final_debit/credit across all periods
    // - For Balance Sheet (1,2,3): Take final_debit/credit from the LATEST period
    // - initial_debit/credit: Take from the FIRST period (Jan)
    const data = db.prepare(`
      SELECT 
        account_code, 
        MAX(account_name) as account_name,
        SUM(CASE 
          WHEN (account_code LIKE '4%' OR account_code LIKE '5%' OR account_code LIKE '6%') THEN final_debit 
          WHEN period = ? THEN final_debit 
          ELSE 0 
        END) as final_debit,
        SUM(CASE 
          WHEN (account_code LIKE '4%' OR account_code LIKE '5%' OR account_code LIKE '6%') THEN final_credit 
          WHEN period = ? THEN final_credit 
          ELSE 0 
        END) as final_credit,
        SUM(CASE WHEN period = ? THEN initial_debit ELSE 0 END) as initial_debit,
        SUM(CASE WHEN period = ? THEN initial_credit ELSE 0 END) as initial_credit
      FROM trial_balance 
      WHERE period >= ? AND period <= ?
      GROUP BY account_code
      ORDER BY account_code ASC
    `).all(endPeriod, endPeriod, startPeriod, startPeriod, startPeriod, endPeriod);
    
    res.json(data);
  });

  app.get("/api/periods", (req, res) => {
    const periods = db.prepare("SELECT DISTINCT period FROM trial_balance ORDER BY period DESC").all();
    res.json(periods.map((p: any) => p.period));
  });

  app.get("/api/balance-check", (req, res) => {
    try {
      const { period } = req.query;
      let periods = db.prepare("SELECT DISTINCT period FROM trial_balance ORDER BY period ASC").all().map((p: any) => p.period);
      
      if (period) {
        const targetPeriod = period as string;
        const targetIdx = periods.indexOf(targetPeriod);
        if (targetIdx <= 0) {
          // No predecessor or period not found
          return res.json({ success: true, discrepancies: [] });
        }
        // Only check the transition to the target period
        periods = [periods[targetIdx - 1], targetPeriod];
      }

      const discrepancies: any[] = [];

      for (let i = 1; i < periods.length; i++) {
        const prevPeriod = periods[i - 1];
        const currPeriod = periods[i];

        const prevData = db.prepare("SELECT account_code, account_name, final_debit, final_credit FROM trial_balance WHERE period = ?").all(prevPeriod);
        const currData = db.prepare("SELECT account_code, account_name, initial_debit, initial_credit, final_debit, final_credit FROM trial_balance WHERE period = ?").all(currPeriod);

        const currMap = new Map();
        currData.forEach((item: any) => currMap.set(item.account_code, item));

        // 1. General Balance Check (Prev Final vs Curr Initial)
        prevData.forEach((prev: any) => {
          // Exclude revenue (4), expenses (5), and tax estimation (611000000)
          if (prev.account_code.startsWith('4') || prev.account_code.startsWith('5') || prev.account_code === '611000000') {
            return;
          }

          const curr = currMap.get(prev.account_code);
          if (curr) {
            const diffDebit = Math.abs(prev.final_debit - curr.initial_debit);
            const diffCredit = Math.abs(prev.final_credit - curr.initial_credit);

            if (diffDebit > 0.01 || diffCredit > 0.01) {
              discrepancies.push({
                type: "Balance Mismatch",
                account_code: prev.account_code,
                account_name: prev.account_name,
                prev_period: prevPeriod,
                curr_period: currPeriod,
                prev_final_debit: prev.final_debit,
                curr_initial_debit: curr.initial_debit,
                prev_final_credit: prev.final_credit,
                curr_initial_credit: curr.initial_credit,
                gap_debit: prev.final_debit - curr.initial_debit,
                gap_credit: prev.final_credit - curr.initial_credit
              });
            }
          } else {
            // Account exists in prev but not in curr
            if (Math.abs(prev.final_debit) > 0.01 || Math.abs(prev.final_credit) > 0.01) {
              discrepancies.push({
                type: "Missing Account",
                account_code: prev.account_code,
                account_name: prev.account_name,
                prev_period: prevPeriod,
                curr_period: currPeriod,
                prev_final_debit: prev.final_debit,
                curr_initial_debit: 0,
                prev_final_credit: prev.final_credit,
                curr_initial_credit: 0,
                gap_debit: prev.final_debit,
                gap_credit: prev.final_credit,
                message: "Akun tidak ditemukan di periode saat ini"
              });
            }
          }
        });

        // Also check accounts in curr but not in prev
        currData.forEach((curr: any) => {
          // Exclude revenue (4), expenses (5), and tax estimation (611000000)
          if (curr.account_code.startsWith('4') || curr.account_code.startsWith('5') || curr.account_code === '611000000') {
            return;
          }

          const prev = prevData.find((p: any) => p.account_code === curr.account_code);
          if (!prev) {
            if (Math.abs(curr.initial_debit) > 0.01 || Math.abs(curr.initial_credit) > 0.01) {
              discrepancies.push({
                type: "New Account with Balance",
                account_code: curr.account_code,
                account_name: curr.account_name,
                prev_period: prevPeriod,
                curr_period: currPeriod,
                prev_final_debit: 0,
                curr_initial_debit: curr.initial_debit,
                prev_final_credit: 0,
                curr_initial_credit: curr.initial_credit,
                gap_debit: -curr.initial_debit,
                gap_credit: -curr.initial_credit,
                message: "Akun baru di periode saat ini dengan saldo awal tidak nol"
              });
            }
          }
        });

        // 2. Cash Flow vs Balance Sheet (Initial Cash)
        // Arus Kas Awal = Sum of (prev.final_debit - prev.final_credit) for 11101 and 11102
        // Neraca Awal = Sum of (curr.initial_debit - curr.initial_credit) for 11101 and 11102
        const getCashVal = (dataset: any[], fieldD: string, fieldK: string) => {
          return dataset
            .filter(i => i.account_code.startsWith('11101') || i.account_code.startsWith('11102'))
            .reduce((acc, i) => acc + (i[fieldD] - i[fieldK]), 0);
        };

        const cashAwalArusKas = getCashVal(prevData, 'final_debit', 'final_credit');
        const cashAwalNeraca = getCashVal(currData, 'initial_debit', 'initial_credit');

        if (Math.abs(cashAwalArusKas - cashAwalNeraca) > 0.01) {
          discrepancies.push({
            type: "Cash Flow Sync",
            message: "Kas Awal di Arus Kas tidak sama dengan Kas Awal di Neraca",
            curr_period: currPeriod,
            val1: cashAwalArusKas,
            val2: cashAwalNeraca,
            gap: cashAwalArusKas - cashAwalNeraca
          });
        }

        // 3. Tax Estimation Check (P&L vs CALK 4.6)
        const getPLVal = (dataset: any[], prefix: string, isRevenue = false) => {
          return dataset
            .filter(i => i.account_code.startsWith(prefix))
            .reduce((acc, i) => acc + (isRevenue ? (i.final_credit - i.final_debit) : (i.final_debit - i.final_credit)), 0);
        };

        // EBT Calculation
        const revTotal = getPLVal(currData, '41', true) + getPLVal(currData, '42', true) + getPLVal(currData, '43', true);
        const hppTotal = getPLVal(currData, '51');
        const opExTotal = getPLVal(currData, '52');
        const otherExTotal = getPLVal(currData, '531');
        const depAmorTotal = getPLVal(currData, '54');
        
        const ebt = revTotal - hppTotal - opExTotal - otherExTotal - depAmorTotal;
        
        const sumbangan = getPLVal(currData, '531040000');
        const bebanPajak = getPLVal(currData, '521021700');
        const bebanPajakBungaBank = getPLVal(currData, '531010000');
        const totalKoreksiPositif = sumbangan + bebanPajak + bebanPajakBungaBank;
        
        const pendapatanBungaBank = getPLVal(currData, '431010100', true) + 
                                  getPLVal(currData, '431010200', true) + 
                                  getPLVal(currData, '431010300', true) + 
                                  getPLVal(currData, '431010400', true);
        
        const labaSetelahKoreksi = ebt + totalKoreksiPositif - pendapatanBungaBank;
        const pembulatan = labaSetelahKoreksi % 1000;
        const labaKenaPajak = labaSetelahKoreksi - (pembulatan > 0 ? pembulatan : 0);
        
        const calculatedTax = labaKenaPajak * 0.22;
        const recordedTax = getPLVal(currData, '611');

        if (Math.abs(calculatedTax - recordedTax) > 1) { // Allow small rounding diff
          discrepancies.push({
            type: "Tax Calculation Sync",
            message: "Taksiran Pajak di Laba Rugi tidak sesuai dengan perhitungan CALK 4.6",
            curr_period: currPeriod,
            val1: recordedTax,
            val2: calculatedTax,
            gap: recordedTax - calculatedTax
          });
        }

        // 4. Cash Flow vs Balance Sheet (Ending Cash)
        const getVal = (dataset: any[], prefix: string, isAsset = true) => {
          return dataset
            .filter(i => i.account_code.startsWith(prefix))
            .reduce((acc, i) => acc + (isAsset ? (i.final_debit - i.final_credit) : (i.final_credit - i.final_debit)), 0);
        };

        const getPrevVal = (dataset: any[], prefix: string, isAsset = true) => {
          return dataset
            .filter(i => i.account_code.startsWith(prefix))
            .reduce((acc, i) => acc + (isAsset ? (i.final_debit - i.final_credit) : (i.final_credit - i.final_debit)), 0);
        };

        const netProfit = ebt - recordedTax;
        const dep = getPLVal(currData, "541");
        
        const op = netProfit + dep + 
                  (getPrevVal(prevData, "11201") - getVal(currData, "11201")) +
                  (getPrevVal(prevData, "11202") - getVal(currData, "11202")) +
                  (getPrevVal(prevData, "113") - getVal(currData, "113")) +
                  ((getPrevVal(prevData, "114") + getPrevVal(prevData, "115") + getPrevVal(prevData, "116")) - (getVal(currData, "114") + getVal(currData, "115") + getVal(currData, "116"))) +
                  (getVal(currData, "21", false) - getPrevVal(prevData, "21", false));

        const inv = (getPrevVal(prevData, "11103") - getVal(currData, "11103")) +
                  (getPrevVal(prevData, "12102") - getVal(currData, "12102")) +
                  (getPrevVal(prevData, "12104") - getVal(currData, "12104")) +
                  (getPrevVal(prevData, "12106") - getVal(currData, "12106")) +
                  (getPrevVal(prevData, "12103") - getVal(currData, "12103")) +
                  (getPrevVal(prevData, "131") - getVal(currData, "131")) +
                  (getPrevVal(prevData, "123010000") - getVal(currData, "123010000")) + (getPrevVal(prevData, "123020000") - getVal(currData, "123020000")) + (getPrevVal(prevData, "12101") - getVal(currData, "12101"));

        const fin = (getVal(currData, "22", false) - getPrevVal(prevData, "22", false)) +
                  (getVal(currData, "331", false) - getPrevVal(prevData, "331", false));

        const totalChange = op + inv + fin;
        const cashAkhirArusKas = cashAwalArusKas + totalChange;
        const cashAkhirNeraca = getCashVal(currData, 'final_debit', 'final_credit');

        if (Math.abs(cashAkhirArusKas - cashAkhirNeraca) > 1) {
          discrepancies.push({
            type: "Cash Flow Sync",
            message: "Kas Akhir di Arus Kas tidak sama dengan Kas Akhir di Neraca",
            curr_period: currPeriod,
            val1: cashAkhirArusKas,
            val2: cashAkhirNeraca,
            gap: cashAkhirArusKas - cashAkhirNeraca
          });
        }

        // 5. Trial Balance Equilibrium Check
        const totalDebit = currData.reduce((acc: number, i: any) => acc + i.final_debit, 0);
        const totalCredit = currData.reduce((acc: number, i: any) => acc + i.final_credit, 0);
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
          discrepancies.push({
            type: "Trial Balance Out of Balance",
            message: "Neraca Saldo tidak seimbang (Debit != Kredit)",
            curr_period: currPeriod,
            val1: totalDebit,
            val2: totalCredit,
            gap: totalDebit - totalCredit
          });
        }
      }

      res.json({ success: true, discrepancies });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete data for a specific period
  app.delete("/api/trial-balance/:period", (req, res) => {
    const { period } = req.params;
    try {
      const stmt = db.prepare("DELETE FROM trial_balance WHERE period = ?");
      const result = stmt.run(period);
      console.log(`Deleted ${result.changes} rows for period ${period}`);
      res.json({ success: true, deletedCount: result.changes });
    } catch (error) {
      console.error("Error deleting data:", error);
      res.status(500).json({ error: "Gagal menghapus data periode." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  if (process.env.VERCEL) {
    return app;
  }

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Auto-sync if database is empty
    const count = db.prepare("SELECT COUNT(*) as count FROM trial_balance").get() as { count: number };
    if (count.count === 0) {
      console.log("Database empty, performing initial sync...");
      try {
        console.log("Ready for initial synchronization. Please use the Import menu.");
      } catch (err) {
        console.error("Initial sync failed:", err);
      }
    }
  });

  return app;
}

const app = await startServer();
export default app;
