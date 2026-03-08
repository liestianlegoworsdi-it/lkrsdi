import express from "express";
import { createServer as createViteServer } from "vite";
import { parse } from "csv-parse";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("accounting.db");
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

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

// Initialize database
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

const FIXED_GAS_API_URL = "https://script.google.com/macros/s/AKfycbzFaQeASp3y3mFM2QGfM6OA3_2YcP3-TcY4QjtxxViaj7j-Wxm7nLYeC0MfhagInHMR/exec";

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

  app.post("/api/fetch-api-url", async (req, res) => {
    const { url, period, syncAll } = req.body;
    const targetBaseUrl = (url || FIXED_GAS_API_URL).trim();
    if (!targetBaseUrl) return res.status(400).json({ error: "URL API diperlukan" });

    try {
      if (syncAll) {
        console.log(`Full Sync from GAS API: ${targetBaseUrl}`);
        const listRes = await fetch(targetBaseUrl);
        if (!listRes.ok) throw new Error(`GAS API Error: ${listRes.status}`);
        const listResult = await listRes.json();
        
        if (!listResult.available_sheets || !Array.isArray(listResult.available_sheets)) {
          throw new Error("API tidak mengembalikan daftar sheet yang tersedia");
        }

        const allResults = [];
        const clearedBudgetYears = new Set<number>();

        for (const sheetName of listResult.available_sheets) {
          try {
            const targetUrl = `${targetBaseUrl}${targetBaseUrl.includes('?') ? '&' : '?'}sheet=${encodeURIComponent(sheetName)}`;
            const response = await fetch(targetUrl);
            if (!response.ok) continue;
            
            const result = await response.json();
            if (!result.data || !Array.isArray(result.data)) continue;

            const rows = result.data;
            const type = (result.type === "budget" || sheetName.toUpperCase().includes("RKAPB") || sheetName.toUpperCase().includes("BUDGET") || sheetName.toUpperCase().includes("ANGGARAN")) ? "budget" : (result.type || "trial_balance");

            if (type === "trial_balance") {
              const monthMap: Record<string, string> = {
                januari: "01", februari: "02", maret: "03", april: "04", mei: "05", juni: "06",
                juli: "07", agustus: "08", september: "09", oktober: "10", nopember: "11", november: "11", desember: "12",
                jan: "01", feb: "02", mar: "03", apr: "04", ags: "08", aug: "08", sep: "09", okt: "10", des: "12"
              };
              const parts = sheetName.split(" ");
              let detectedPeriod = "";
              if (parts.length >= 2) {
                const m = monthMap[parts[0].toLowerCase()];
                const y = parts[1];
                if (m && y) detectedPeriod = `${y}-${m}`;
              }

              if (detectedPeriod) {
                const insert = db.prepare(`
                  INSERT OR REPLACE INTO trial_balance 
                  (period, account_code, account_name, initial_debit, initial_credit, mutation_debit, mutation_credit, final_debit, final_credit)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                const transaction = db.transaction((dataRows, finalPeriod) => {
                  db.prepare("DELETE FROM trial_balance WHERE period = ?").run(finalPeriod);
                  let inserted = 0;
                  let dataStarted = false;
                  for (const row of dataRows) {
                    const [code, name, initD, initK, mutD, mutK, finD, finK] = row;
                    if (!dataStarted) {
                      if (code && /^\d/.test(code.toString().trim())) dataStarted = true;
                      else continue;
                    }
                    if (!code || code.toString().trim() === "" || code.toString().toLowerCase() === "jumlah") continue;
                    insert.run(finalPeriod, code.toString().trim().replace(/[.\s]/g, ''), name ? name.toString() : "", parseNum(initD), parseNum(initK), parseNum(mutD), parseNum(mutK), parseNum(finD), parseNum(finK));
                    inserted++;
                  }
                  return inserted;
                });
                const count = transaction(rows, detectedPeriod);
                allResults.push({ sheet: sheetName, type: "trial_balance", count, period: detectedPeriod });
              }
            } else if (type === "budget") {
              const yearMatch = sheetName.match(/\d{4}/);
              const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
              console.log(`[Sync] Processing budget sheet "${sheetName}" for year ${year}`);
              
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
                  
                  // Look for January column
                  const jIdx = r.findIndex((c: any) => {
                    const s = c?.toString().trim().toLowerCase();
                    return s === 'jan' || s === 'januari' || s === 'january';
                  });
                  if (jIdx !== -1) {
                    janCol = jIdx;
                    
                    // Look for Code column
                    const cIdx = r.findIndex((c: any) => c && /no\.?\s*rek|kode|acc|account/i.test(c.toString().trim().toLowerCase()));
                    if (cIdx !== -1) codeCol = cIdx;
                    
                    // Look for Name column
                    const nIdx = r.findIndex((c: any) => c && /uraian|nama|akun|rekening|description/i.test(c.toString().trim().toLowerCase()));
                    if (nIdx !== -1) nameCol = nIdx;
                    
                    console.log(`[Sync] Found budget header at row ${i}: janCol=${janCol}, codeCol=${codeCol}, nameCol=${nameCol}`);
                    break;
                  }
                }

                if (janCol === -1) {
                  console.log(`[Sync] Could not find January column in sheet ${sheetName}`);
                  return 0;
                }
                if (codeCol === -1) codeCol = 0;
                if (nameCol === -1) nameCol = 1;

                for (const row of dataRows) {
                  const code = row[codeCol];
                  const name = row[nameCol];
                  if (!dataStarted) {
                    const cleanCode = code ? code.toString().trim().replace(/[.\s-]/g, '') : "";
                    // More lenient: start if code is numeric and length >= 3
                    if (cleanCode && /^\d+$/.test(cleanCode) && cleanCode.length >= 3) {
                      dataStarted = true;
                    } else continue;
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
              console.log(`[Sync] Inserted ${count} budget entries for ${year} from ${sheetName}`);
              allResults.push({ sheet: sheetName, type: "budget", count, year });
            }
          } catch (e) {
            console.error(`Error syncing sheet ${sheetName}:`, e);
          }
        }
        return res.json({ success: true, results: allResults });
      }

      const sheetName = periodToSheetName(period);
      const targetUrl = `${targetBaseUrl}${targetBaseUrl.includes('?') ? '&' : '?'}sheet=${encodeURIComponent(sheetName)}`;
      
      console.log(`Fetching from GAS API: ${targetUrl}`);
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error(`GAS API Error: ${response.status}`);
      
      const result = await response.json();
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error(result.error || "Format data API tidak valid");
      }

      const rows = result.data;
      const type = result.type || "trial_balance";

      if (type === "trial_balance") {
        const insert = db.prepare(`
          INSERT OR REPLACE INTO trial_balance 
          (period, account_code, account_name, initial_debit, initial_credit, mutation_debit, mutation_credit, final_debit, final_credit)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = db.transaction((dataRows, finalPeriod) => {
          db.prepare("DELETE FROM trial_balance WHERE period = ?").run(finalPeriod);
          let inserted = 0;
          let dataStarted = false;

          for (const row of dataRows) {
            const [code, name, initD, initK, mutD, mutK, finD, finK] = row;
            if (!dataStarted) {
              if (code && /^\d/.test(code.toString().trim())) dataStarted = true;
              else continue;
            }
            if (!code || code.toString().trim() === "" || code.toString().toLowerCase() === "jumlah") continue;
            
            insert.run(
              finalPeriod,
              code.toString().trim().replace(/[.\s]/g, ''),
              name ? name.toString() : "",
              parseNum(initD), parseNum(initK),
              parseNum(mutD), parseNum(mutK),
              parseNum(finD), parseNum(finK)
            );
            inserted++;
          }
          return inserted;
        });

        const count = transaction(rows, period);
        return res.json({ success: true, count, period });
      }

      res.status(400).json({ error: "Tipe data API tidak didukung saat ini" });
    } catch (error: any) {
      console.error("Error in fetch-api-url:", error);
      res.status(500).json({ error: error.message });
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

  app.get("/api/neraca-saldo", (req, res) => {
    const { period } = req.query;
    if (!period) {
      return res.status(400).json({ error: "Period is required" });
    }

    const data = db.prepare("SELECT * FROM trial_balance WHERE period = ? ORDER BY account_code ASC").all(period);
    res.json(data);
  });

  app.get("/api/periods", (req, res) => {
    const periods = db.prepare("SELECT DISTINCT period FROM trial_balance ORDER BY period DESC").all();
    res.json(periods.map((p: any) => p.period));
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

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Auto-sync if database is empty
    const count = db.prepare("SELECT COUNT(*) as count FROM trial_balance").get() as { count: number };
    if (count.count === 0) {
      console.log("Database empty, performing initial sync...");
      try {
        // We can't easily call the route handler directly, but we can call a fetch to ourselves
        // or just run the logic. For simplicity, let's just log that it's ready for sync.
        console.log("Ready for initial synchronization. Please use the Import menu.");
      } catch (err) {
        console.error("Initial sync failed:", err);
      }
    }
  });
}

startServer();
