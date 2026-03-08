import React, { useState, useEffect } from "react";
import { 
  Upload, FileText, Table as TableIcon, Calendar, CheckCircle, 
  AlertCircle, Loader2, Link as LinkIcon, RefreshCw, Info,
  Menu, ChevronLeft, ChevronRight, ChevronDown, Gem, LogOut, Settings,
  LayoutDashboard, TrendingUp, TrendingDown, ArrowUpRight,
  ArrowDownRight, DollarSign, PieChart, Activity, Search, Download, BarChart3,
  Zap, Globe, X, BookOpen, Wallet
} from "lucide-react";
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CalkExpandableSection = ({ 
  id, 
  title, 
  total, 
  items, 
  subgroups,
  isExpanded, 
  onToggle, 
  formatCurrency 
}: { 
  id: string, 
  title: string, 
  total: number, 
  items?: { label: string, val: number }[], 
  subgroups?: { label: string, items: { label: string, val: number }[] }[],
  isExpanded: boolean, 
  onToggle: (id: string) => void,
  formatCurrency: (val: number) => string
}) => {
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
      <button 
        onClick={() => onToggle(id)}
        className={cn(
          "w-full flex items-center justify-between p-6 transition-colors",
          isExpanded ? "bg-emerald-50/50" : "bg-white hover:bg-slate-50"
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
            isExpanded ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
          )}>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          <h3 className={cn("font-bold text-slate-900 transition-all", isExpanded && "text-emerald-700")}>{title}</h3>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono font-bold text-slate-900">{formatCurrency(total)}</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Saldo</div>
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100"
          >
            <div className="p-6 bg-white space-y-6">
              {subgroups && subgroups.length > 0 ? (
                <div className="space-y-6">
                  {subgroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.label}</h4>
                        <span className="text-[10px] font-mono font-bold text-slate-900">
                          {formatCurrency(group.items.reduce((acc, i) => acc + i.val, 0))}
                        </span>
                      </div>
                      <table className="w-full text-xs">
                        <tbody className="divide-y divide-slate-50">
                          {group.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2 text-slate-600 pl-2">{item.label}</td>
                              <td className="py-2 text-right font-mono text-slate-900">{formatCurrency(item.val)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50">
                      <th className="pb-2 text-left">Rincian Akun</th>
                      <th className="pb-2 text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {items && items.length > 0 ? items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 text-slate-600">{item.label}</td>
                        <td className="py-3 text-right font-mono text-slate-900">{formatCurrency(item.val)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={2} className="py-4 text-center text-slate-400 italic">Tidak ada rincian data untuk periode ini.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TrialBalanceItem {
  id: number;
  account_code: string;
  account_name: string;
  initial_debit: number;
  initial_credit: number;
  mutation_debit: number;
  mutation_credit: number;
  final_debit: number;
  final_credit: number;
}

interface BudgetItem {
  id: number;
  year: number;
  month: number;
  account_code: string;
  account_name: string;
  amount: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "report" | "profit_loss" | "neraca" | "arus_kas" | "p_ekuitas" | "profit_loss_summary" | "budget_2026" | "rkapb_comparison" | "rkapb_ratios" | "calk" | "cashflow_dev" | "ebitda_eat">("dashboard");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [comparisonPeriod, setComparisonPeriod] = useState<string>("");
  const [data, setData] = useState<TrialBalanceItem[]>([]);
  const [comparisonData, setComparisonData] = useState<TrialBalanceItem[]>([]);
  const [prevPeriodData, setPrevPeriodData] = useState<TrialBalanceItem[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (message && message.type === "success") {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'pendapatan': true,
    'beban': true,
    '411': false,
    '412': false,
    '413': false,
    '414': false,
    '415': false,
    '42': false,
    '52101': false,
    '52102': false,
    '52103': false,
    '531': false,
    '541': false
  });
  const [expandedCalk, setExpandedCalk] = useState<Record<string, boolean>>({});

  const toggleCalk = (id: string) => {
    setExpandedCalk(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  // Simple Sheets State
  const [apiUrl, setApiUrl] = useState(localStorage.getItem("apiUrl") || "https://script.google.com/macros/s/AKfycbzFaQeASp3y3mFM2QGfM6OA3_2YcP3-TcY4QjtxxViaj7j-Wxm7nLYeC0MfhagInHMR/exec");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const printReport = () => {
    window.print();
  };

  const fetchPeriods = async () => {
    try {
      const res = await fetch("/api/periods");
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status}. ${text.slice(0, 100)}`);
      }
      const data = await res.json();
      setPeriods(data);
    } catch (err: any) {
      console.error("Failed to fetch periods", err);
    }
  };

  const fetchData = async (selectedPeriod: string, type: 'current' | 'comparison' | 'prev' = 'current') => {
    if (type === 'current') setLoading(true);
    try {
      const res = await fetch(`/api/neraca-saldo?period=${selectedPeriod}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status}. ${text.slice(0, 100)}`);
      }
      const result = await res.json();
      if (type === 'comparison') {
        setComparisonData(result);
      } else if (type === 'prev') {
        setPrevPeriodData(result);
      } else {
        setData(result);
      }
    } catch (err: any) {
      console.error("Failed to fetch data", err);
    } finally {
      if (type === 'current') setLoading(false);
    }
  };

  const fetchBudget = async (year: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/budget?year=${year}`);
      if (!res.ok) throw new Error("Failed to fetch budget");
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setBudgetData(result.data);
      } else {
        setBudgetData([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch budget", err);
      setBudgetData([]);
    } finally {
      setLoading(false);
    }
  };

  const getBudgetVal = (accountCode: string, month: number) => {
    const cleanCode = accountCode.replace(/[.\s-]/g, '');
    return budgetData.filter(i => i.account_code.startsWith(cleanCode) && i.month === month && !isBudgetParentAccount(i.account_code))
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const getBudgetTotal = (prefix: string, month: number) => {
    const cleanPrefix = prefix.replace(/[.\s-]/g, '');
    return budgetData.filter(i => i.account_code.startsWith(cleanPrefix) && i.month === month && !isBudgetParentAccount(i.account_code))
      .reduce((acc, curr) => {
        // 414 is Discount (Contra-Revenue)
        const isContra = curr.account_code.startsWith('414') && cleanPrefix !== '414';
        return acc + (isContra ? -curr.amount : curr.amount);
      }, 0);
  };

  const getBudgetYearTotal = (accountCode: string) => {
    const cleanCode = accountCode.replace(/[.\s-]/g, '');
    return budgetData.filter(i => i.account_code.startsWith(cleanCode) && !isBudgetParentAccount(i.account_code))
      .reduce((acc, curr) => {
        const isContra = curr.account_code.startsWith('414') && cleanCode !== '414';
        return acc + (isContra ? -curr.amount : curr.amount);
      }, 0);
  };

  const getBudgetYearTotalByPrefix = (prefix: string) => {
    const cleanPrefix = prefix.replace(/[.\s-]/g, '');
    return budgetData.filter(i => i.account_code.startsWith(cleanPrefix) && !isBudgetParentAccount(i.account_code))
      .reduce((acc, curr) => {
        const isContra = curr.account_code.startsWith('414') && cleanPrefix !== '414';
        return acc + (isContra ? -curr.amount : curr.amount);
      }, 0);
  };

  const getBudgetGrossProfit = (month: number) => {
    return getBudgetTotal("4", month) - getBudgetTotal("51", month);
  };

  const getBudgetTotalBebanOperasional = (month: number) => {
    return getBudgetTotal("52101", month) + getBudgetTotal("52102", month) + getBudgetTotal("52103", month);
  };

  const getBudgetYearTotalBebanOperasional = () => {
    return getBudgetYearTotalByPrefix("52101") + getBudgetYearTotalByPrefix("52102") + getBudgetYearTotalByPrefix("52103");
  };

  const getBudgetOperationalProfit = (month: number) => {
    return getBudgetGrossProfit(month) - getBudgetTotalBebanOperasional(month);
  };

  const getBudgetNetProfitBeforeTax = (month: number) => {
    return getBudgetOperationalProfit(month) - getBudgetTotal("531", month) - getBudgetTotal("54", month);
  };

  const getBudgetNetProfitAfterTax = (month: number) => {
    const beforeTax = getBudgetNetProfitBeforeTax(month);
    return beforeTax - (beforeTax * 0.22);
  };

  const getBudgetYearGrossProfit = () => {
    return getBudgetYearTotalByPrefix("4") - getBudgetYearTotalByPrefix("51");
  };

  const getBudgetYearOperationalProfit = () => {
    return getBudgetYearGrossProfit() - getBudgetYearTotalBebanOperasional();
  };

  const getBudgetYearNetProfitBeforeTax = () => {
    return getBudgetYearOperationalProfit() - getBudgetYearTotalByPrefix("531") - getBudgetYearTotalByPrefix("54");
  };

  const getBudgetYearNetProfitAfterTax = () => {
    const beforeTax = getBudgetYearNetProfitBeforeTax();
    return beforeTax - (beforeTax * 0.22);
  };

  const BudgetRow = ({ label, code, isTotal = false, isSubTotal = false, isHeader = false, pl = 0 }: { label: string, code?: string, isTotal?: boolean, isSubTotal?: boolean, isHeader?: boolean, pl?: number }) => {
    return (
      <tr className={cn(
        isHeader && "bg-slate-50 font-bold text-slate-900",
        isTotal && "bg-emerald-50 font-bold border-y-2 border-slate-900",
        isSubTotal && "font-bold italic bg-slate-50/50"
      )}>
        <td className={cn("py-2 px-2 sticky left-0 bg-white z-10 border-r border-slate-100 min-w-[300px]", pl === 1 && "pl-4", pl === 2 && "pl-8", pl === 3 && "pl-12", isTotal && "bg-emerald-50", isHeader && "bg-slate-50")}>
          {label}
        </td>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
          let val = 0;
          if (code === "611") {
            val = getBudgetNetProfitBeforeTax(m) * 0.22;
          } else if (code) {
            val = getBudgetVal(code, m);
          }
          return (
            <td key={m} className="py-2 px-2 text-right font-mono border-r border-slate-100">
              {val !== 0 ? formatCurrency(val).replace("Rp", "").trim() : "-"}
            </td>
          );
        })}
        <td className="py-2 px-2 text-right font-mono font-bold bg-slate-50">
          {(() => {
            if (code === "611") {
              return formatCurrency(getBudgetYearNetProfitBeforeTax() * 0.22).replace("Rp", "").trim();
            }
            return code ? formatCurrency(getBudgetYearTotal(code)).replace("Rp", "").trim() : "-";
          })()}
        </td>
      </tr>
    );
  };

  const exportRKAPBToExcel = () => {
    const table = document.getElementById('rkapb-table');
    if (!table) {
      setMessage({ type: "error", text: "Tabel tidak ditemukan" });
      return;
    }
    
    // Create worksheet from table
    const ws = XLSX.utils.table_to_sheet(table);
    
    // Post-process cells to ensure numbers are correctly typed and formatted
    Object.keys(ws).forEach(cell => {
      if (cell[0] === '!') return;
      const cellData = ws[cell];
      
      if (cellData && cellData.t === 's') {
        const val = cellData.v.toString().trim();
        
        // Handle "-" as 0
        if (val === '-' || val === '') {
          cellData.v = 0;
          cellData.t = 'n';
          cellData.z = '#,##0';
          return;
        }

        // Try to parse Indonesian formatted number (e.g. 212.278.073)
        // Remove dots (thousands separator)
        const cleanVal = val.replace(/\./g, '').replace(/,/g, '.');
        const num = Number(cleanVal);
        
        // If it's a valid number and not just a string that happens to be numeric (like account codes)
        // We only convert if it's not the first column (A) which is "URAIAN"
        const col = cell.replace(/[0-9]/g, '');
        if (col !== 'A' && !isNaN(num)) {
          cellData.v = num;
          cellData.t = 'n';
          cellData.z = '#,##0'; // Excel number format with thousands separator
        }
      }
    });
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RKAPB 2026");
    XLSX.writeFile(wb, `RKAPB_2026_RSUM_DIK.xlsx`);
  };

  const isBudgetParentAccount = (code: string) => {
    const cleanCode = code.replace(/[.\s-]/g, '');
    return budgetData.some(i => i.account_code.startsWith(cleanCode) && i.account_code !== cleanCode);
  };

  const BudgetDetailRows = ({ prefix, pl = 0 }: { prefix: string, pl?: number }) => {
    const cleanPrefix = prefix.replace(/[.\s-]/g, '');
    const accounts = Array.from(new Set(
      budgetData
        .filter(i => i.account_code.startsWith(cleanPrefix) && !isBudgetParentAccount(i.account_code))
        .map(i => JSON.stringify({ code: i.account_code, name: i.account_name }))
    )).map(s => JSON.parse(s))
    .sort((a, b) => a.code.localeCompare(b.code));

    if (accounts.length === 0) return null;

    return (
      <>
        {accounts.map(acc => (
          <BudgetRow key={acc.code} label={acc.name} code={acc.code} pl={pl} />
        ))}
      </>
    );
  };

  const ComparisonDetailRows = ({ prefix, isRevenue = true, month }: { prefix: string, isRevenue?: boolean, month: number }) => {
    const cleanPrefix = prefix.replace(/[.\s-]/g, '');
    const accounts = Array.from(new Set(
      budgetData
        .filter(i => i.account_code.startsWith(cleanPrefix) && !isBudgetParentAccount(i.account_code))
        .map(i => JSON.stringify({ code: i.account_code, name: i.account_name }))
    )).map(s => JSON.parse(s))
    .sort((a, b) => a.code.localeCompare(b.code));

    if (accounts.length === 0) return null;

    return (
      <>
        {accounts.map(acc => {
          const real = getPLVal(data, acc.code, isRevenue);
          const budget = getBudgetVal(acc.code, month);
          const diff = isRevenue ? (real - budget) : (budget - real);
          const pct = budget !== 0 ? (real / budget) * 100 : 0;

          const realYtd = getPLVal(data, acc.code, isRevenue); 
          const budgetYtd = Array.from({length: month}, (_, i) => getBudgetVal(acc.code, i + 1)).reduce((a, b) => a + b, 0);
          const diffYtd = isRevenue ? (realYtd - budgetYtd) : (budgetYtd - realYtd);
          const pctYtd = budgetYtd !== 0 ? (realYtd / budgetYtd) * 100 : 0;

          return (
            <tr key={acc.code} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-[10px]">
              <td className="py-1.5 px-2 pl-12 text-slate-500 italic sticky left-0 bg-white z-10">{acc.code} - {acc.name}</td>
              <td className="py-1.5 px-2 text-right font-mono text-slate-500">{formatCurrency(real).replace("Rp", "").trim()}</td>
              <td className="py-1.5 px-2 text-right font-mono text-slate-500">{formatCurrency(budget).replace("Rp", "").trim()}</td>
              <td className={cn("py-1.5 px-2 text-right font-mono", diff < 0 ? "text-red-400" : "text-emerald-400")}>{formatCurrency(diff).replace("Rp", "").trim()}</td>
              <td className="py-1.5 px-2 text-right font-mono text-slate-400 border-r border-slate-100">{pct.toFixed(1)}%</td>
              <td className="py-1.5 px-2 text-right font-mono text-slate-500">{formatCurrency(realYtd).replace("Rp", "").trim()}</td>
              <td className="py-1.5 px-2 text-right font-mono text-slate-500">{formatCurrency(budgetYtd).replace("Rp", "").trim()}</td>
              <td className={cn("py-1.5 px-2 text-right font-mono", diffYtd < 0 ? "text-red-400" : "text-emerald-400")}>{formatCurrency(diffYtd).replace("Rp", "").trim()}</td>
              <td className="py-1.5 px-2 text-right font-mono text-slate-400">{pctYtd.toFixed(1)}%</td>
            </tr>
          );
        })}
      </>
    );
  };

  const BudgetSummaryRow = ({ label, valFunc, yearValFunc, isTotal = true }: { label: string, valFunc: (m: number) => number, yearValFunc: () => number, isTotal?: boolean }) => {
    return (
      <tr className={cn(
        isTotal && "bg-emerald-50 font-bold border-y-2 border-slate-900",
      )}>
        <td className={cn("py-2 px-2 sticky left-0 bg-white z-10 border-r border-slate-100 min-w-[300px]", isTotal && "bg-emerald-50")}>
          {label}
        </td>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
          const val = valFunc(m);
          return (
            <td key={m} className="py-2 px-2 text-right font-mono border-r border-slate-100">
              {val !== 0 ? formatCurrency(val).replace("Rp", "").trim() : "-"}
            </td>
          );
        })}
        <td className="py-2 px-2 text-right font-mono font-bold bg-slate-50">
          {formatCurrency(yearValFunc()).replace("Rp", "").trim()}
        </td>
      </tr>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenu && !(event.target as HTMLElement).closest('.relative.group')) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  useEffect(() => {
    fetchPeriods();
    fetchBudget(2026);
  }, []);

  useEffect(() => {
    if (activeTab === "budget_2026" || activeTab === "rkapb_comparison") {
      fetchBudget(2026);
    } else {
      fetchData(period);
    }
    
    // For Arus Kas, we need the previous period
    const [year, month] = period.split("-");
    let prevYear = parseInt(year);
    let prevMonth = parseInt(month) - 1;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    const prevPeriodStr = `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
    fetchData(prevPeriodStr, 'prev');
  }, [period, activeTab]);

  useEffect(() => {
    if (comparisonPeriod) {
      fetchData(comparisonPeriod, 'comparison');
    } else {
      setComparisonData([]);
    }
  }, [comparisonPeriod]);

  const getTargetSheetName = (p: string) => {
    const [year, month] = p.split("-");
    const monthMap: Record<string, string> = {
      "01": "Januari", "02": "Februari", "03": "Maret", "04": "April", "05": "Mei", "06": "Juni",
      "07": "Juli", "08": "Agustus", "09": "September", "10": "Oktober", "11": "November", "12": "Desember"
    };
    return `${monthMap[month]} ${year}`;
  };

  const handleDeletePeriodData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/trial-balance/${period}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessage({ type: "success", text: `Berhasil menghapus data periode ${getTargetSheetName(period)}.` });
        setData([]);
        setShowDeleteConfirm(false);
        fetchData(period);
        fetchPeriods();
      } else {
        let errorMessage = "Gagal menghapus data.";
        try {
          const err = await response.json();
          errorMessage = err.error || errorMessage;
        } catch (e) {
          // If not JSON, use status text or default
          errorMessage = `Error ${response.status}: ${response.statusText || "Gagal menghapus data."}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAllSheets = async () => {
    setSyncingAll(true);
    setMessage(null);
    try {
      const response = await fetch("/api/fetch-api-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: apiUrl, syncAll: true }),
      });

      let result;
      try {
        result = await response.json();
      } catch (e) {
        throw new Error(`Error ${response.status}: ${response.statusText || "Gagal sinkronisasi semua data."}`);
      }

      if (response.ok) {
        const count = result.results.reduce((acc: number, r: any) => acc + r.count, 0);
        const sheets = result.results.map((r: any) => r.sheet).join(", ");
        setMessage({ 
          type: "success", 
          text: `Berhasil memperbarui ${count} baris data dari ${result.results.length} sheet: ${sheets}` 
        });
        fetchData(period);
        fetchPeriods();
        fetchBudget(2026);
      } else {
        throw new Error(result.error || "Gagal sinkronisasi semua data.");
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSyncingAll(false);
    }
  };

  const handleSyncSheets = async () => {
    setSyncing(true);
    setMessage(null);

    try {
      const response = await fetch("/api/fetch-api-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: apiUrl, period }),
      });

      let result;
      try {
        result = await response.json();
      } catch (e) {
        throw new Error(`Error ${response.status}: ${response.statusText || "Gagal menarik data."}`);
      }

      if (response.ok) {
        setMessage({ type: "success", text: `Berhasil menarik ${result.count} baris data dari sheet "${getTargetSheetName(result.period)}"!` });
        if (result.period === period) {
          fetchData(period);
        }
        fetchPeriods();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: `Gagal: ${err.message}` });
    } finally {
      setSyncing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  };

  const totals = data.reduce(
    (acc, item) => {
      acc.initD += item.initial_debit;
      acc.initK += item.initial_credit;
      acc.mutD += item.mutation_debit;
      acc.mutK += item.mutation_credit;
      acc.finD += item.final_debit;
      acc.finK += item.final_credit;
      return acc;
    },
    { initD: 0, initK: 0, mutD: 0, mutK: 0, finD: 0, finK: 0 }
  );

  const isParentAccount = (dataset: TrialBalanceItem[], code: string) => {
    if (!code) return false;
    const account = dataset.find(i => i.account_code === code);
    // If it has any balance or activity, it's a leaf for our calculation purposes
    if (account && (
      account.initial_debit !== 0 || account.initial_credit !== 0 ||
      account.mutation_debit !== 0 || account.mutation_credit !== 0 ||
      account.final_debit !== 0 || account.final_credit !== 0
    )) return false;
    
    const prefix = code.replace(/0+$/, '');
    if (!prefix) return true;
    return dataset.some(i => i.account_code !== code && i.account_code.startsWith(prefix) && i.account_code.length >= code.length);
  };

  const getVal = (dataset: TrialBalanceItem[], prefix: string, isAsset = true) => {
    return dataset
      .filter(i => i.account_code.startsWith(prefix) && !isParentAccount(dataset, i.account_code))
      .reduce((acc, i) => acc + (isAsset ? (i.final_debit - i.final_credit) : (i.final_credit - i.final_debit)), 0);
  };

  const getMutationVal = (dataset: TrialBalanceItem[], prefix: string, isAsset = true) => {
    return dataset
      .filter(i => i.account_code.startsWith(prefix) && !isParentAccount(dataset, i.account_code))
      .reduce((acc, i) => acc + (isAsset ? (i.mutation_debit - i.mutation_credit) : (i.mutation_credit - i.mutation_debit)), 0);
  };

  const getPrevVal = (prefix: string, isAsset = true) => {
    if (period === "2026-01") {
      return data
        .filter(i => i.account_code.startsWith(prefix) && !isParentAccount(data, i.account_code))
        .reduce((acc, i) => acc + (isAsset ? (i.initial_debit - i.initial_credit) : (i.initial_credit - i.initial_debit)), 0);
    }
    return getVal(prevPeriodData, prefix, isAsset);
  };

  const getNetProfit = (dataset: TrialBalanceItem[]) => {
    return getFinalNetProfit(dataset);
  };

  const getRevenueTotal = (dataset: TrialBalanceItem[]) => {
    const opRevenue = dataset
      .filter(i => (i.account_code.startsWith('41') || i.account_code.startsWith('42')) && !isParentAccount(dataset, i.account_code))
      .reduce((acc, i) => acc + (i.final_credit - i.final_debit), 0);
    const otherRevenue = dataset
      .filter(i => i.account_code.startsWith('43') && !isParentAccount(dataset, i.account_code))
      .reduce((acc, i) => acc + (i.final_credit - i.final_debit), 0);
    return opRevenue + otherRevenue;
  };

  const getExpenseTotal = (dataset: TrialBalanceItem[]) => {
    return dataset
      .filter(i => (
        i.account_code.startsWith('5') || 
        i.account_code.startsWith('6') || 
        i.account_code.startsWith('7') || 
        i.account_code.startsWith('8') || 
        i.account_code.startsWith('9')
      ) && !isParentAccount(dataset, i.account_code))
      .reduce((acc, i) => acc + (i.final_debit - i.final_credit), 0);
  };

  const getPLVal = (dataset: TrialBalanceItem[], prefix: string, isRevenue = false) => {
    return dataset
      .filter(i => i.account_code.startsWith(prefix) && !isParentAccount(dataset, i.account_code))
      .reduce((acc, i) => acc + (isRevenue ? (i.final_credit - i.final_debit) : (i.final_debit - i.final_credit)), 0);
  };

  const getHPPAndDirectExpense = (dataset: TrialBalanceItem[]) => {
    const hpp = getPLVal(dataset, '511');
    const bebanLangsung = getPLVal(dataset, '512');
    const jasaPelayanan = getPLVal(dataset, '513');
    const pemeriksaanKeluar = getPLVal(dataset, '514');
    return hpp + bebanLangsung + jasaPelayanan + pemeriksaanKeluar;
  };

  const getGrossProfit = (dataset: TrialBalanceItem[]) => {
    return getRevenueTotal(dataset) - getHPPAndDirectExpense(dataset);
  };

  const getOperationalExpense = (dataset: TrialBalanceItem[]) => {
    const personalia = getPLVal(dataset, '52101');
    const administrasi = getPLVal(dataset, '52102');
    const umum = getPLVal(dataset, '52103');
    return personalia + administrasi + umum;
  };

  const getOperationalProfit = (dataset: TrialBalanceItem[]) => {
    return getGrossProfit(dataset) - getOperationalExpense(dataset);
  };

  const getOtherExpenseTotal = (dataset: TrialBalanceItem[]) => {
    return getPLVal(dataset, '531');
  };

  const getDepreciationAndAmortization = (dataset: TrialBalanceItem[]) => {
    const penyusutan = getPLVal(dataset, '541');
    const amortisasi = getPLVal(dataset, '542');
    const marginUtang = getPLVal(dataset, '543');
    return penyusutan + amortisasi + marginUtang;
  };

  const getNetProfitBeforeTax = (dataset: TrialBalanceItem[]) => {
    return getOperationalProfit(dataset) - getOtherExpenseTotal(dataset) - getDepreciationAndAmortization(dataset);
  };

  const getTaxEstimation = (dataset: TrialBalanceItem[]) => {
    // Taksiran Pajak Penghasilan nilainya mengambil pada neraca saldo masing masing periode (Akun 611)
    return getPLVal(dataset, '611');
  };

  const getFinalNetProfit = (dataset: TrialBalanceItem[]) => {
    return getNetProfitBeforeTax(dataset) - getTaxEstimation(dataset);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation Bar - Excel Style */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        {/* Top Branding Bar */}
        <div className="bg-[#064E3B] text-white px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center shadow-lg rotate-45 group">
              <Gem className="w-5 h-5 text-[#064E3B] -rotate-45 group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-lg font-display font-bold tracking-tight">
              RSDI <span className="text-emerald-400">Kendal</span> <span className="text-white/40 font-normal text-sm ml-2">| Laporan Keuangan 2026</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-100/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Periode: {period}
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            
            <button 
              onClick={handleSyncAllSheets}
              disabled={syncingAll}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                syncingAll 
                  ? "bg-white/10 text-white/40 cursor-not-allowed" 
                  : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
              )}
              title="Sinkronisasi Seluruh Data (Termasuk RKAPB)"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", syncingAll && "animate-spin")} />
              {syncingAll ? "Sinkronisasi..." : "Refresh Data"}
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ribbon Menu Bar */}
        <div className="px-4 flex items-center justify-between">
          <nav className="flex items-center">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setOpenMenu(null);
              }}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative",
                activeTab === "dashboard" ? "text-[#064E3B] bg-emerald-50/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <LayoutDashboard className={cn("w-4 h-4", activeTab === "dashboard" ? "text-emerald-600" : "text-slate-400")} />
              Dashboard
              {activeTab === "dashboard" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
              )}
            </button>

            {/* LK Menu */}
            <div className="relative group">
              <button
                onClick={() => setOpenMenu(openMenu === "lk" ? null : "lk")}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative",
                  ["neraca", "report", "profit_loss_summary", "profit_loss", "arus_kas", "p_ekuitas", "calk"].includes(activeTab) ? "text-[#064E3B] bg-emerald-50/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <FileText className={cn("w-4 h-4", ["neraca", "report", "profit_loss_summary", "profit_loss", "arus_kas", "p_ekuitas", "calk"].includes(activeTab) ? "text-emerald-600" : "text-slate-400")} />
                LK
                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                {["neraca", "report", "profit_loss_summary", "profit_loss", "arus_kas", "p_ekuitas", "calk"].includes(activeTab) && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
                )}
              </button>
              {openMenu === "lk" && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-b-xl py-2 z-[100]">
                  {/* Neraca Submenu */}
                  <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Neraca</div>
                  <button
                    onClick={() => { setActiveTab("neraca"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Neraca
                  </button>
                  <button
                    onClick={() => { setActiveTab("report"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Neraca Saldo
                  </button>

                  {/* Laba Rugi Submenu */}
                  <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mt-2 mb-1">Laba Rugi</div>
                  <button
                    onClick={() => { setActiveTab("profit_loss_summary"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Laba Rugi
                  </button>
                  <button
                    onClick={() => { setActiveTab("profit_loss"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Laba Rugi Detail
                  </button>

                  {/* Other LK items */}
                  <div className="h-[1px] bg-slate-100 my-2 mx-4" />
                  <button
                    onClick={() => { setActiveTab("arus_kas"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                    Arus Kas
                  </button>
                  <button
                    onClick={() => { setActiveTab("p_ekuitas"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <PieChart className="w-3.5 h-3.5 text-slate-400" />
                    Ekuitas
                  </button>
                  <button
                    onClick={() => { setActiveTab("calk"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    CALK
                  </button>
                </div>
              )}
            </div>

            {/* Analisa Menu */}
            <div className="relative group">
              <button
                onClick={() => setOpenMenu(openMenu === "analisa" ? null : "analisa")}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative",
                  (activeTab === "budget_2026" || activeTab === "rkapb_comparison" || activeTab === "rkapb_ratios" || activeTab === "ebitda_eat") ? "text-[#064E3B] bg-emerald-50/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <BarChart3 className={cn("w-4 h-4", (activeTab === "budget_2026" || activeTab === "rkapb_comparison" || activeTab === "rkapb_ratios" || activeTab === "ebitda_eat") ? "text-emerald-600" : "text-slate-400")} />
                Analisa
                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                {(activeTab === "budget_2026" || activeTab === "rkapb_comparison" || activeTab === "rkapb_ratios" || activeTab === "ebitda_eat") && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
                )}
              </button>
              {openMenu === "analisa" && (
                <div className="absolute top-full left-0 w-56 bg-white border border-slate-200 shadow-xl rounded-b-xl py-2 z-[100]">
                  <button
                    onClick={() => { setActiveTab("budget_2026"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Anggaran 2026
                  </button>
                  <button
                    onClick={() => { setActiveTab("rkapb_comparison"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Realisasi vs Anggaran
                  </button>
                  <button
                    onClick={() => { setActiveTab("rkapb_ratios"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Rasio Keuangan
                  </button>
                  <button
                    onClick={() => { setActiveTab("ebitda_eat"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    EBITDA & EAT
                  </button>
                </div>
              )}
            </div>

            {/* Cash Flow Menu */}
            <button
              onClick={() => { setActiveTab("cashflow_dev"); setOpenMenu(null); }}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative",
                activeTab === "cashflow_dev" ? "text-[#064E3B] bg-emerald-50/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Wallet className={cn("w-4 h-4", activeTab === "cashflow_dev" ? "text-emerald-600" : "text-slate-400")} />
              Cash Flow
              {activeTab === "cashflow_dev" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
              )}
            </button>
          </nav>

          <div className="flex items-center gap-3 pr-4">
            {activeTab === "profit_loss" && (
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <select 
                  value={comparisonPeriod}
                  onChange={(e) => setComparisonPeriod(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 cursor-pointer outline-none"
                >
                  <option value="">Bandingkan...</option>
                  {periods.filter(p => p !== period).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 cursor-pointer outline-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="min-h-screen">
        <main className="p-6 md:p-8 max-w-[1600px] mx-auto">
          {/* Status Message - Global */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-6 p-4 rounded-xl flex items-start gap-4 shadow-sm border relative ${
                  message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${message.type === "success" ? "bg-emerald-100" : "bg-red-100"}`}>
                  {message.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold mb-0.5 uppercase tracking-tight">{message.type === "success" ? "Berhasil!" : "Terjadi Kesalahan"}</h4>
                  <p className="text-[11px] font-medium opacity-80 leading-relaxed">{message.text}</p>
                </div>
                <button 
                  onClick={() => setMessage(null)}
                  className="absolute top-2 right-2 p-1 hover:bg-black/5 rounded-full transition-colors"
                >
                  <LogOut className="w-3 h-3 rotate-90 opacity-40" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-end no-print">
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
                    <div className="relative">
                      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Total Pendapatan</p>
                      <h3 className="text-xl font-display font-bold text-slate-900">{formatCurrency(getRevenueTotal(data))}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", getRevenueTotal(data) >= getRevenueTotal(prevPeriodData) ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                          {getRevenueTotal(prevPeriodData) !== 0 ? (((getRevenueTotal(data) - getRevenueTotal(prevPeriodData)) / getRevenueTotal(prevPeriodData)) * 100).toFixed(1) : "0"}%
                        </span>
                        <span className="text-[10px] text-slate-400">vs bln lalu</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
                    <div className="relative">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      </div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Total Beban</p>
                      <h3 className="text-xl font-display font-bold text-slate-900">{formatCurrency(getExpenseTotal(data))}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", getExpenseTotal(data) <= getExpenseTotal(prevPeriodData) ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                          {getExpenseTotal(prevPeriodData) !== 0 ? (((getExpenseTotal(data) - getExpenseTotal(prevPeriodData)) / getExpenseTotal(prevPeriodData)) * 100).toFixed(1) : "0"}%
                        </span>
                        <span className="text-[10px] text-slate-400">vs bln lalu</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#064E3B] p-6 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="relative">
                      <div className="w-10 h-10 bg-emerald-400 rounded-lg flex items-center justify-center mb-4 rotate-12 group-hover:rotate-0 transition-transform">
                        <DollarSign className="w-5 h-5 text-[#064E3B]" />
                      </div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-100/40 mb-1">Laba Bersih</p>
                      <h3 className="text-xl font-display font-bold text-white">{formatCurrency(getNetProfit(data))}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", getNetProfit(data) >= getNetProfit(prevPeriodData) ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                          {getNetProfit(prevPeriodData) !== 0 ? (((getNetProfit(data) - getNetProfit(prevPeriodData)) / Math.abs(getNetProfit(prevPeriodData))) * 100).toFixed(1) : "0"}%
                        </span>
                        <span className="text-[10px] text-emerald-100/40">vs bln lalu</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                        <Activity className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Net Profit Margin</p>
                      <h3 className="text-xl font-display font-bold text-slate-900">
                        {getRevenueTotal(data) !== 0 ? ((getNetProfit(data) / getRevenueTotal(data)) * 100).toFixed(1) : "0"}%
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${Math.min(100, Math.max(0, (getRevenueTotal(data) !== 0 ? (getNetProfit(data) / getRevenueTotal(data)) * 100 : 0)))}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Ringkasan Eksekutif */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Ringkasan Eksekutif & Analisis Keuangan</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Analisis Profitabilitas</h5>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {getNetProfit(data) > 0 
                                ? `Rumah Sakit mencatatkan laba bersih sebesar ${formatCurrency(getNetProfit(data))} pada periode ini. Margin laba bersih berada di angka ${((getNetProfit(data)/getRevenueTotal(data))*100).toFixed(1)}%, menunjukkan efisiensi operasional yang ${((getNetProfit(data)/getRevenueTotal(data))*100) > 15 ? 'sangat baik' : 'cukup stabil'}.`
                                : `Rumah Sakit mencatatkan defisit sebesar ${formatCurrency(Math.abs(getNetProfit(data)))} pada periode ini. Diperlukan peninjauan kembali terhadap struktur biaya operasional.`
                              }
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Likuiditas & Solvabilitas</h5>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              Rasio lancar saat ini menunjukkan posisi kas dan setara kas yang memadai untuk menutupi kewajiban jangka pendek. Pengelolaan piutang perlu ditingkatkan untuk menjaga arus kas tetap sehat.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-xs font-bold text-slate-600">Pencapaian Target Pendapatan</span>
                              <span className="text-xs font-bold text-emerald-600">
                                {(() => {
                                  const month = parseInt(period.split("-")[1]);
                                  const budget = getBudgetTotal("4", month);
                                  const actual = getRevenueTotal(data);
                                  return budget !== 0 ? ((actual / budget) * 100).toFixed(1) : "0";
                                })()}%
                              </span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (getRevenueTotal(data) / (getBudgetTotal("4", parseInt(period.split("-")[1])) || 1)) * 100)}%` }}
                                className="h-full bg-emerald-500"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-xs font-bold text-slate-600">Efisiensi Biaya (vs Anggaran)</span>
                              <span className="text-xs font-bold text-blue-600">
                                {(() => {
                                  const month = parseInt(period.split("-")[1]);
                                  const budget = getBudgetTotal("5", month);
                                  const actual = getExpenseTotal(data);
                                  return budget !== 0 ? ((actual / budget) * 100).toFixed(1) : "0";
                                })()}%
                              </span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (getExpenseTotal(data) / (getBudgetTotal("5", parseInt(period.split("-")[1])) || 1)) * 100)}%` }}
                                className="h-full bg-blue-500"
                              />
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Penilaian Kinerja</span>
                            </div>
                            <div className="text-2xl font-display font-bold text-slate-900">
                              {(() => {
                                const net = getNetProfit(data);
                                if (net > 500000000) return "SANGAT BAIK";
                                if (net > 100000000) return "BAIK";
                                if (net > 0) return "CUKUP";
                                return "PERLU PERBAIKAN";
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Charts */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Perbandingan Pendapatan & Beban</h4>
                        <PieChart className="w-4 h-4 text-slate-300" />
                      </div>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Pendapatan', value: getRevenueTotal(data), color: '#10b981' },
                              { name: 'Beban', value: getExpenseTotal(data), color: '#ef4444' }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                              tickFormatter={(val) => `Rp ${val/1000000}jt`}
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              formatter={(val: number) => formatCurrency(val)}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                              {[0, 1].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Akses Cepat</h4>
                      <div className="space-y-3">
                        {[
                          { id: "neraca", label: "Neraca", icon: Activity, desc: "Posisi Keuangan" },
                          { id: "report", label: "Neraca Saldo", icon: TableIcon, desc: "Detail Saldo Akun" },
                          { id: "profit_loss_summary", label: "Laba Rugi", icon: FileText, desc: "Ringkasan Laba Rugi" },
                          { id: "profit_loss", label: "Laba Rugi Detail", icon: FileText, desc: "Analisis Profitabilitas" },
                          { id: "rkapb_comparison", label: "Realisasi vs Anggaran", icon: BarChart3, desc: "Perbandingan RKAPB" },
                          { id: "ebitda_eat", label: "EBITDA & EAT", icon: Zap, desc: "Analisis Profitabilitas" },
                          { id: "arus_kas", label: "Arus Kas", icon: TrendingUp, desc: "Aliran Kas" },
                          { id: "p_ekuitas", label: "Ekuitas", icon: PieChart, desc: "Perubahan Ekuitas" },
                          { id: "budget_2026", label: "Anggaran 2026", icon: PieChart, desc: "RKAPB 2026" },
                        ].map((link) => (
                          <button 
                            key={link.id}
                            onClick={() => setActiveTab(link.id as any)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-all group border border-transparent hover:border-emerald-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                                <link.icon className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-bold text-slate-900">{link.label}</p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest">{link.desc}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "calk" && (
              <motion.div
                key="calk"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto space-y-8 pb-20"
              >
                {/* CALK Header Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="p-12 text-center border-b border-slate-100 bg-slate-50/30">
                    <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100 rotate-3">
                      <BookOpen className="w-10 h-10 text-white -rotate-3" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 mb-4 tracking-tight">Catatan Atas Laporan Keuangan (CALK)</h1>
                    <div className="flex items-center justify-center gap-4 text-slate-500 font-medium uppercase tracking-widest text-xs">
                      <span>RSU Muhammadiyah Darul Istiqomah</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>Periode {getTargetSheetName(period)}</span>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-3 no-print">
                    </div>
                  </div>

                  <div className="p-12 space-y-12">
                    {/* Section 1: Gambaran Umum */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">1</span>
                        <h2 className="text-xl font-display font-bold text-slate-900">Gambaran Umum</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-slate-600">
                        <div className="space-y-4">
                          <p>
                            RSU Muhammadiyah Darul Istiqomah Kaliwungu merupakan amal usaha Muhammadiyah di bidang kesehatan yang berlokasi di Kabupaten Kendal. Rumah sakit ini berkomitmen memberikan pelayanan kesehatan yang bermutu, profesional, dan bernafaskan nilai-nilai Islami.
                          </p>
                          <p>
                            Laporan Keuangan ini disusun untuk memberikan informasi mengenai posisi keuangan, kinerja keuangan, dan arus kas entitas yang bermanfaat bagi pengguna laporan dalam membuat dan mengevaluasi keputusan mengenai alokasi sumber daya.
                          </p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Visi & Misi</h4>
                          <ul className="space-y-2 italic">
                            <li>• Menjadi Rumah Sakit pilihan utama masyarakat.</li>
                            <li>• Memberikan pelayanan kesehatan yang paripurna.</li>
                            <li>• Mengelola rumah sakit secara efektif dan efisien.</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Section 2: Kebijakan Akuntansi */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">2</span>
                        <h2 className="text-xl font-display font-bold text-slate-900">Kebijakan Akuntansi Signifikan</h2>
                      </div>
                      <div className="space-y-6 text-sm text-slate-600">
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                          <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Dasar Penyusunan Laporan Keuangan
                          </h3>
                          <p>
                            Laporan keuangan disusun berdasarkan Standar Akuntansi Keuangan Entitas Tanpa Akuntabilitas Publik (SAK ETAP) atau standar yang relevan bagi amal usaha Muhammadiyah. Dasar pengukuran adalah biaya historis (historical cost), kecuali beberapa pos tertentu yang diukur berdasarkan nilai wajar.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              Pengakuan Pendapatan
                            </h3>
                            <p className="text-xs leading-relaxed">
                              Pendapatan dari jasa layanan pasien diakui pada saat layanan diberikan (accrual basis). Pendapatan farmasi diakui pada saat penyerahan barang kepada pasien.
                            </p>
                          </div>
                          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              Aset Tetap & Penyusutan
                            </h3>
                            <p className="text-xs leading-relaxed">
                              Aset tetap dicatat berdasarkan biaya perolehan. Penyusutan dihitung menggunakan metode garis lurus (straight-line method) berdasarkan estimasi masa manfaat ekonomis aset.
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Section 3: Penjelasan Pos Neraca */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">3</span>
                        <h2 className="text-xl font-display font-bold text-slate-900">Penjelasan Pos-Pos Neraca</h2>
                      </div>
                      
                      <div className="space-y-4">
                        {/* 3.1 Kas dan Setara Kas */}
                        <CalkExpandableSection 
                          id="3.1"
                          title="3.1. Kas dan Setara Kas"
                          total={getVal(data, "11101") + getVal(data, "11102")}
                          items={data.filter(i => (i.account_code.startsWith('11101') || i.account_code.startsWith('11102')) && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))}
                          isExpanded={expandedCalk["3.1"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 3.2 Investasi Jk. Pendek */}
                        <CalkExpandableSection 
                          id="3.2"
                          title="3.2. Investasi Jk. Pendek"
                          total={getVal(data, "11103")}
                          items={data.filter(i => i.account_code.startsWith('11103') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))}
                          isExpanded={expandedCalk["3.2"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 3.3 Piutang Usaha */}
                        <CalkExpandableSection 
                          id="3.3"
                          title="3.3. Piutang Usaha"
                          total={getVal(data, "11201")}
                          items={data.filter(i => i.account_code.startsWith('11201') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))}
                          isExpanded={expandedCalk["3.3"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 3.4 Piutang Non Usaha */}
                        <CalkExpandableSection 
                          id="3.4"
                          title="3.4. Piutang Non Usaha"
                          total={getVal(data, "11202")}
                          items={data.filter(i => i.account_code.startsWith('11202') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))}
                          isExpanded={expandedCalk["3.4"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 3.5 Persediaan */}
                        <CalkExpandableSection 
                          id="3.5"
                          title="3.5. Persediaan"
                          total={getVal(data, "113")}
                          items={data.filter(i => i.account_code.startsWith('113') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))}
                          isExpanded={expandedCalk["3.5"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 3.6 Biaya Dibayar Dimuka */}
                        <CalkExpandableSection 
                          id="3.6"
                          title="3.6. Biaya Dibayar Dimuka"
                          total={getVal(data, "114") + getVal(data, "115") + getVal(data, "116")}
                          items={data.filter(i => (i.account_code.startsWith('114') || i.account_code.startsWith('115') || i.account_code.startsWith('116')) && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))}
                          isExpanded={expandedCalk["3.6"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 3.7 Aset Tetap */}
                        <CalkExpandableSection 
                          id="3.7"
                          title="3.7. Aset Tetap"
                          total={getVal(data, "121") + getVal(data, "123") + getVal(data, "1220")}
                          items={data.filter(i => (i.account_code.startsWith('121') || i.account_code.startsWith('123') || i.account_code.startsWith('1220')) && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))}
                          isExpanded={expandedCalk["3.7"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 3.8 Aset Tidak Berwujud */}
                        <CalkExpandableSection 
                          id="3.8"
                          title="3.8. Aset Tidak Berwujud"
                          total={getVal(data, "131")}
                          items={data.filter(i => i.account_code.startsWith('131') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))}
                          isExpanded={expandedCalk["3.8"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 3.9 Hutang */}
                        <CalkExpandableSection 
                          id="3.9"
                          title="3.9. Hutang"
                          total={getVal(data, "21", false) + getVal(data, "22", false)}
                          items={data.filter(i => (i.account_code.startsWith('21') || i.account_code.startsWith('22')) && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_credit - i.final_debit }))}
                          isExpanded={expandedCalk["3.9"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 3.10 Ekuitas */}
                        <CalkExpandableSection 
                          id="3.10"
                          title="3.10. Ekuitas"
                          total={getVal(data, "3", false)}
                          items={data.filter(i => i.account_code.startsWith('3') && !isParentAccount(data, i.account_code)).map(i => {
                            // If it's the current year profit account, use the calculated net profit
                            // Usually current year profit is 32001 or similar, but the user wants it to match LR
                            const isCurrentYearProfit = i.account_name.toUpperCase().includes("TAHUN BERJALAN");
                            return { 
                              label: i.account_name, 
                              val: isCurrentYearProfit ? getNetProfit(data) : (i.final_credit - i.final_debit) 
                            };
                          })}
                          isExpanded={expandedCalk["3.10"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />
                      </div>
                    </section>

                    {/* Section 4: Penjelasan Pos Laba Rugi */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">4</span>
                        <h2 className="text-xl font-display font-bold text-slate-900">Penjelasan Pos-Pos Laba Rugi</h2>
                      </div>
                      
                      <div className="space-y-4">
                        {/* 4.1 Pendapatan */}
                        <CalkExpandableSection 
                          id="4.1"
                          title="4.1. Pendapatan"
                          total={getRevenueTotal(data)}
                          subgroups={[
                            { 
                              label: "Pendapatan Operasional Rawat Inap", 
                              items: data.filter(i => i.account_code.startsWith('411') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_credit - i.final_debit }))
                            },
                            { 
                              label: "Pendapatan Operasional Rawat Jalan", 
                              items: data.filter(i => i.account_code.startsWith('412') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_credit - i.final_debit }))
                            },
                            { 
                              label: "Pendapatan Operasional Rawat Darurat", 
                              items: data.filter(i => i.account_code.startsWith('413') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_credit - i.final_debit }))
                            },
                            { 
                              label: "Potongan Pendapatan", 
                              items: data.filter(i => i.account_code.startsWith('414') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_credit - i.final_debit }))
                            },
                            { 
                              label: "Pendapatan Operasional Lain", 
                              items: data.filter(i => i.account_code.startsWith('42') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_credit - i.final_debit }))
                            },
                            { 
                              label: "Pendapatan Non Operasional", 
                              items: data.filter(i => i.account_code.startsWith('43') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_credit - i.final_debit }))
                            },
                          ]}
                          isExpanded={expandedCalk["4.1"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 4.2 HPP & Beban Langsung */}
                        <CalkExpandableSection 
                          id="4.2"
                          title="4.2. HPP & Beban Langsung"
                          total={getHPPAndDirectExpense(data)}
                          subgroups={[
                            { 
                              label: "Harga Pokok Penjualan", 
                              items: data.filter(i => i.account_code.startsWith('511') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))
                            },
                            { 
                              label: "Beban Jasa Medis Dokter", 
                              items: data.filter(i => (i.account_code.startsWith('512') || i.account_code.startsWith('513') || i.account_code.startsWith('514')) && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))
                            },
                          ]}
                          isExpanded={expandedCalk["4.2"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 4.3 Beban Operasional */}
                        <CalkExpandableSection 
                          id="4.3"
                          title="4.3. Beban Operasional"
                          total={getOperationalExpense(data) + getDepreciationAndAmortization(data)}
                          subgroups={[
                            { 
                              label: "Beban Personalia", 
                              items: data.filter(i => i.account_code.startsWith('52101') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))
                            },
                            { 
                              label: "Beban Administrasi", 
                              items: data.filter(i => i.account_code.startsWith('52102') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))
                            },
                            { 
                              label: "Beban Umum", 
                              items: data.filter(i => i.account_code.startsWith('52103') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))
                            },
                            { 
                              label: "Beban Penyusutan & Amortisasi", 
                              items: data.filter(i => i.account_code.startsWith('54') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))
                            },
                          ]}
                          isExpanded={expandedCalk["4.3"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 4.4 Beban Non Operasional */}
                        <CalkExpandableSection 
                          id="4.4"
                          title="4.4. Beban Non Operasional"
                          total={getOtherExpenseTotal(data)}
                          items={data.filter(i => i.account_code.startsWith('53') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))}
                          isExpanded={expandedCalk["4.4"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />
                      </div>
                    </section>
                  </div>

                  <div className="p-12 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                      <h3 className="text-lg font-display font-bold">Pernyataan Tanggung Jawab</h3>
                      <p className="text-xs text-slate-400 max-w-md">
                        Manajemen RSU Muhammadiyah Darul Istiqomah bertanggung jawab atas penyusunan dan penyajian laporan keuangan ini secara wajar.
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-32 h-1 bg-white/20 rounded-full" />
                      <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-widest">Direktur Utama</p>
                        <p className="text-[10px] text-slate-400 mt-1">RSU Muhammadiyah Darul Istiqomah</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "cashflow_dev" && (
              <motion.div
                key="cashflow_dev"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
              >
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wallet className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Cash Flow Management</h2>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Modul manajemen arus kas sedang dalam pengembangan. Fitur ini akan mencakup proyeksi kas harian, mingguan, dan bulanan.
                  </p>
                  <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Dalam Pengembangan
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "report" && (
              <motion.div
                key="report"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-12">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">RSU MUHAMMADIYAH DARUL ISTIQOMAH KALIWUNGU</h2>
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">KABUPATEN KENDAL</h2>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mt-2">NERACA SALDO</h2>
                    <p className="text-slate-900 font-medium">
                      PERIODE {new Date(period + "-01").toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase()}
                    </p>
                    <p className="text-xs italic text-slate-500 mt-1">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
                  </div>

                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                        <TableIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Data Neraca Saldo</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Periode {period}</p>
                      </div>
                    </div>
                    <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200">
                      {data.length} Akun Terdaftar
                    </div>
                  </div>

                  <div className="mb-8 relative max-w-md mx-auto print:hidden">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari akun atau kode..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="overflow-x-auto relative scrollbar-thin scrollbar-thumb-slate-200">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                      <thead>
                        <tr className="bg-slate-50 text-[9px] uppercase tracking-widest font-bold text-slate-500">
                          <th className="px-4 py-3 border-b border-slate-200 sticky left-0 z-20 bg-slate-50 w-28">No. Rek</th>
                          <th className="px-4 py-3 border-b border-slate-200 sticky left-28 z-20 bg-slate-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] min-w-[300px]">Nama Rekening</th>
                          <th className="px-4 py-3 border-b border-slate-200 text-right" colSpan={2}>Neraca Awal</th>
                          <th className="px-4 py-3 border-b border-slate-200 text-right" colSpan={2}>Mutasi</th>
                          <th className="px-4 py-3 border-b border-slate-200 text-right" colSpan={2}>Neraca Akhir</th>
                        </tr>
                        <tr className="bg-slate-50/50 text-[8px] uppercase tracking-widest font-bold text-slate-400">
                          <th className="px-4 py-1 border-b border-slate-200 sticky left-0 z-20 bg-slate-50/80 backdrop-blur-sm w-28"></th>
                          <th className="px-4 py-1 border-b border-slate-200 sticky left-28 z-20 bg-slate-50/80 backdrop-blur-sm shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]"></th>
                          <th className="px-4 py-1 border-b border-slate-200 text-right">Debet</th>
                          <th className="px-4 py-1 border-b border-slate-200 text-right">Kredit</th>
                          <th className="px-4 py-1 border-b border-slate-200 text-right">Debet</th>
                          <th className="px-4 py-1 border-b border-slate-200 text-right">Kredit</th>
                          <th className="px-4 py-1 border-b border-slate-200 text-right">Debet</th>
                          <th className="px-4 py-1 border-b border-slate-200 text-right">Kredit</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {loading ? (
                          <tr>
                            <td colSpan={8} className="px-6 py-24 text-center">
                              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4 opacity-40" />
                              <p className="text-slate-400 font-medium italic">Memuat data...</p>
                            </td>
                          </tr>
                         ) : data.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-6 py-24 text-center opacity-20">
                              <FileText className="w-12 h-12 mx-auto mb-4" />
                              <p className="text-lg font-bold italic">Belum ada data.</p>
                            </td>
                          </tr>
                        ) : (
                          <>
                            {Object.entries(
                              data.reduce((acc, item) => {
                                let groupKey = item.account_code.slice(0, 3);
                                if (item.account_code.startsWith('110')) groupKey = item.account_code.slice(0, 4);
                                else if (item.account_code.startsWith('12')) groupKey = '12';
                                else if (item.account_code.startsWith('13')) groupKey = '13';
                                else if (item.account_code.startsWith('21')) groupKey = '21';
                                else if (item.account_code.startsWith('22')) groupKey = '22';
                                else if (item.account_code.startsWith('3')) groupKey = item.account_code.slice(0, 2);
                                
                                if (!acc[groupKey]) acc[groupKey] = [];
                                acc[groupKey].push(item);
                                return acc;
                              }, {} as Record<string, TrialBalanceItem[]>)
                            ).sort(([a], [b]) => a.localeCompare(b)).map(([groupKey, items]) => {
                              const typedItems = items as TrialBalanceItem[];
                              const parent = data.find(i => i.account_code.startsWith(groupKey) && isParentAccount(data, i.account_code));
                              
                              const subTotals = typedItems.reduce((acc, item) => {
                                acc.initD += item.initial_debit;
                                acc.initK += item.initial_credit;
                                acc.mutD += item.mutation_debit;
                                acc.mutK += item.mutation_credit;
                                acc.finD += item.final_debit;
                                acc.finK += item.final_credit;
                                return acc;
                              }, { initD: 0, initK: 0, mutD: 0, mutK: 0, finD: 0, finK: 0 });

                              return (
                                <React.Fragment key={groupKey}>
                                  {/* Group Header */}
                                  <tr className="bg-slate-100/80 font-bold text-[10px] uppercase tracking-wider text-slate-700">
                                    <td className="px-4 py-1.5 border-y border-slate-200 sticky left-0 z-10 bg-slate-100/80">{groupKey}</td>
                                    <td className="px-4 py-1.5 border-y border-slate-200 sticky left-28 z-10 bg-slate-100/80 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]" colSpan={7}>
                                      {parent ? parent.account_name : `Kategori ${groupKey}`}
                                    </td>
                                  </tr>
                                  
                                  {/* Group Items */}
                                  {typedItems
                                    .filter(i => !isParentAccount(data, i.account_code))
                                    .filter(i => 
                                      !searchTerm || 
                                      i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                      i.account_code.includes(searchTerm)
                                    )
                                    .map((item, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                                      <td className="px-4 py-1 border-b border-slate-100 font-mono text-[10px] sticky left-0 z-10 bg-white group-hover:bg-slate-50 text-slate-600 w-28">
                                        {item.account_code}
                                      </td>
                                      <td className="px-4 py-1 border-b border-slate-100 sticky left-28 z-10 bg-white group-hover:bg-slate-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] text-slate-900 min-w-[300px] text-[11px]">
                                        {item.account_name}
                                      </td>
                                      <td className="px-4 py-1 border-b border-slate-100 text-right font-mono text-[10px] text-slate-500">
                                        {item.initial_debit > 0 ? formatCurrency(item.initial_debit) : "-"}
                                      </td>
                                      <td className="px-4 py-1 border-b border-slate-100 text-right font-mono text-[10px] text-slate-500">
                                        {item.initial_credit > 0 ? formatCurrency(item.initial_credit) : "-"}
                                      </td>
                                      <td className="px-4 py-1 border-b border-slate-100 text-right font-mono text-[10px] text-slate-500">
                                        {item.mutation_debit > 0 ? formatCurrency(item.mutation_debit) : "-"}
                                      </td>
                                      <td className="px-4 py-1 border-b border-slate-100 text-right font-mono text-[10px] text-slate-500">
                                        {item.mutation_credit > 0 ? formatCurrency(item.mutation_credit) : "-"}
                                      </td>
                                      <td className="px-4 py-1 border-b border-slate-100 text-right font-mono text-[10px] text-slate-900 font-bold">
                                        {item.final_debit > 0 ? formatCurrency(item.final_debit) : "-"}
                                      </td>
                                      <td className="px-4 py-1 border-b border-slate-100 text-right font-mono text-[10px] text-slate-900 font-bold">
                                        {item.final_credit > 0 ? formatCurrency(item.final_credit) : "-"}
                                      </td>
                                    </tr>
                                  ))}

                                  {/* Group Subtotal */}
                                  <tr className="bg-emerald-50/30 font-bold text-[10px] text-emerald-800 border-b-2 border-emerald-100">
                                    <td className="px-4 py-1.5 sticky left-0 bg-emerald-50/30" colSpan={1}></td>
                                    <td className="px-4 py-1.5 sticky left-28 bg-emerald-50/30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] italic">
                                      Subtotal {parent ? parent.account_name : groupKey}
                                    </td>
                                    <td className="px-4 py-1.5 text-right font-mono">{formatCurrency(subTotals.initD)}</td>
                                    <td className="px-4 py-1.5 text-right font-mono">{formatCurrency(subTotals.initK)}</td>
                                    <td className="px-4 py-1.5 text-right font-mono">{formatCurrency(subTotals.mutD)}</td>
                                    <td className="px-4 py-1.5 text-right font-mono">{formatCurrency(subTotals.mutK)}</td>
                                    <td className="px-4 py-1.5 text-right font-mono">{formatCurrency(subTotals.finD)}</td>
                                    <td className="px-4 py-1.5 text-right font-mono">{formatCurrency(subTotals.finK)}</td>
                                  </tr>
                                </React.Fragment>
                              );
                            })}
                            <tr className="bg-slate-900 text-white font-bold sticky bottom-0 z-30">
                              <td className="px-4 py-2 sticky left-0 bg-slate-900 w-28" colSpan={1}></td>
                              <td className="px-4 py-2 sticky left-28 bg-slate-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]" colSpan={1}>
                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                  TOTAL
                                </div>
                              </td>
                              <td className="px-4 py-2 text-right font-mono text-[10px]">{formatCurrency(totals.initD)}</td>
                              <td className="px-4 py-2 text-right font-mono text-[10px]">{formatCurrency(totals.initK)}</td>
                              <td className="px-4 py-2 text-right font-mono text-[10px]">{formatCurrency(totals.mutD)}</td>
                              <td className="px-4 py-2 text-right font-mono text-[10px]">{formatCurrency(totals.mutK)}</td>
                              <td className="px-4 py-2 text-right font-mono text-[10px]">{formatCurrency(totals.finD)}</td>
                              <td className="px-4 py-2 text-right font-mono text-[10px]">{formatCurrency(totals.finK)}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-20 text-center text-[10px] italic text-slate-500">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-20 grid grid-cols-2 gap-20 text-center text-xs font-bold">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="mb-20 uppercase">Direktur</p>
                    <p className="underline">dr M. Arif Rida, M.M.R</p>
                    <p className="font-normal">NBM. 1108 7910 1075945</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "profit_loss_summary" && (
              <motion.div
                key="profit_loss_summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-end gap-4 no-print max-w-4xl mx-auto">
                </div>
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">RSU MUHAMMADIYAH DARUL ISTIQOMAH KALIWUNGU</h2>
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">KABUPATEN KENDAL</h2>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mt-2">LAPORAN LABA RUGI</h2>
                  <p className="text-slate-900 font-medium">
                    UNTUK BULAN YANG BERAKHIR {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })().toUpperCase()}
                  </p>
                  <p className="text-xs italic text-slate-500 mt-1">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
                </div>

                <div className="space-y-6 text-sm">
                  <div className="grid grid-cols-[1fr_100px_200px] border-b-2 border-slate-900 pb-2 mb-4 font-bold text-xs uppercase tracking-widest">
                    <div>Uraian</div>
                    <div className="text-center">Catatan</div>
                    <div className="text-right">{(() => {
                      const [year, month] = period.split("-").map(Number);
                      return new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                    })()}</div>
                  </div>

                  {/* PENDAPATAN OPERASIONAL */}
                  <section>
                    <h4 className="font-bold mb-2">PENDAPATAN OPERASIONAL</h4>
                    <div className="pl-4 space-y-1">
                      {[
                        { label: "Pendapatan Rawat Inap", val: getPLVal(data, "411", true) },
                        { label: "Pendapatan Rawat Jalan", val: getPLVal(data, "412", true) },
                        { label: "Pendapatan Rawat Darurat", val: getPLVal(data, "413", true) },
                      ].map(item => (
                        <div key={item.label} className="grid grid-cols-[1fr_100px_200px] items-center">
                          <span>{item.label}</span>
                          <div />
                          <span className="text-right font-mono">{formatCurrency(item.val).replace("Rp", "").trim()}</span>
                        </div>
                      ))}
                      <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold pt-1 border-t border-slate-100">
                        <span>Jumlah Pendapatan Operasional</span>
                        <span className="text-center">4.1.</span>
                        <span className="text-right font-mono">{formatCurrency(getPLVal(data, "411", true) + getPLVal(data, "412", true) + getPLVal(data, "413", true)).replace("Rp", "").trim()}</span>
                      </div>
                      {[
                        { label: "Pendapatan Operasional Lain", val: getPLVal(data, "42", true) },
                        { label: "Pendapatan Non Operasional", val: getPLVal(data, "43", true) },
                      ].map(item => (
                        <div key={item.label} className="grid grid-cols-[1fr_100px_200px] items-center">
                          <span>{item.label}</span>
                          <div />
                          <span className="text-right font-mono">{formatCurrency(item.val).replace("Rp", "").trim()}</span>
                        </div>
                      ))}
                      <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold pt-2 border-t-2 border-slate-900">
                        <span>Jumlah Pendapatan Operasional</span>
                        <div />
                        <span className="text-right font-mono">{formatCurrency(getRevenueTotal(data)).replace("Rp", "").trim()}</span>
                      </div>
                    </div>
                  </section>

                  {/* HARGA POKOK PELAYANAN */}
                  <section>
                    <h4 className="font-bold mb-2">HARGA POKOK PELAYANAN</h4>
                    <div className="pl-4 space-y-1">
                      <div className="grid grid-cols-[1fr_100px_200px] items-center">
                        <span>Harga Pokok Penjualan</span>
                        <div />
                        <span className="text-right font-mono">{formatCurrency(getPLVal(data, "511")).replace("Rp", "").trim()}</span>
                      </div>
                      <div className="grid grid-cols-[1fr_100px_200px] items-center">
                        <span>Beban Jasa Medis Dokter</span>
                        <div />
                        <span className="text-right font-mono">{formatCurrency(getPLVal(data, "512") + getPLVal(data, "513") + getPLVal(data, "514")).replace("Rp", "").trim()}</span>
                      </div>
                      <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold pt-1 border-t border-slate-100">
                        <span>Jumlah Harga Pokok Penjualan</span>
                        <span className="text-center">4.2.</span>
                        <span className="text-right font-mono">{formatCurrency(getHPPAndDirectExpense(data)).replace("Rp", "").trim()}</span>
                      </div>
                    </div>
                  </section>

                  {/* Laba Kotor */}
                  <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold py-2 border-y border-slate-900 bg-slate-50 px-2">
                    <span>Laba Kotor</span>
                    <div />
                    <span className="text-right font-mono">{formatCurrency(getGrossProfit(data)).replace("Rp", "").trim()}</span>
                  </div>

                  {/* BEBAN OPERASIONAL */}
                  <section>
                    <h4 className="font-bold mb-2">BEBAN OPERASIONAL</h4>
                    <div className="pl-4 space-y-1">
                      {[
                        { label: "Beban Personalia", val: getPLVal(data, "52101") },
                        { label: "Beban Administrasi", val: getPLVal(data, "52102") },
                        { label: "Beban Umum", val: getPLVal(data, "52103") },
                        { label: "Beban Penyusutan", val: getDepreciationAndAmortization(data) },
                      ].map(item => (
                        <div key={item.label} className="grid grid-cols-[1fr_100px_200px] items-center">
                          <span>{item.label}</span>
                          <div />
                          <span className="text-right font-mono">{formatCurrency(item.val).replace("Rp", "").trim()}</span>
                        </div>
                      ))}
                      <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold pt-1 border-t border-slate-100">
                        <span>Jumlah Beban Operasional</span>
                        <span className="text-center">4.3.</span>
                        <span className="text-right font-mono">{formatCurrency(getOperationalExpense(data) + getDepreciationAndAmortization(data)).replace("Rp", "").trim()}</span>
                      </div>
                    </div>
                  </section>

                  {/* Laba Operasional */}
                  <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold py-2 border-y border-slate-900 bg-slate-50 px-2">
                    <span>Laba Operasional</span>
                    <div />
                    <span className="text-right font-mono">{formatCurrency(getOperationalProfit(data)).replace("Rp", "").trim()}</span>
                  </div>

                  {/* PENDAPATAN (BEBAN) NON OPERASIONAL */}
                  <section>
                    <h4 className="font-bold mb-2 uppercase">Beban Non Operasional</h4>
                    <div className="pl-4 space-y-1">
                      <div className="grid grid-cols-[1fr_100px_200px] items-center">
                        <span>Beban Non Operasional</span>
                        <span className="text-center">4.4.</span>
                        <span className="text-right font-mono text-red-600">({formatCurrency(getOtherExpenseTotal(data)).replace("Rp", "").trim()})</span>
                      </div>
                      <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold pt-1 border-t border-slate-100">
                        <span>Jumlah Beban Non Operasional</span>
                        <div />
                        <span className="text-right font-mono text-red-600">({formatCurrency(getOtherExpenseTotal(data)).replace("Rp", "").trim()})</span>
                      </div>
                    </div>
                  </section>

                  {/* LABA SEBELUM PAJAK PENGHASILAN */}
                  <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold py-2 border-y border-slate-900 bg-slate-50 px-2">
                    <span>LABA SEBELUM PAJAK PENGHASILAN</span>
                    <div />
                    <span className="text-right font-mono">{formatCurrency(getNetProfitBeforeTax(data)).replace("Rp", "").trim()}</span>
                  </div>

                  {/* Taksiran Pajak Penghasilan */}
                  <div className="grid grid-cols-[1fr_100px_200px] items-center py-2 px-2">
                    <span>Taksiran Pajak Penghasilan</span>
                    <span className="text-center">4.5.</span>
                    <span className="text-right font-mono">{formatCurrency(getTaxEstimation(data)).replace("Rp", "").trim()}</span>
                  </div>

                  {/* LABA SETELAH PAJAK PENGHASILAN */}
                  <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold py-4 border-y-4 border-double border-slate-900 bg-emerald-50 px-2 text-lg">
                    <span>LABA SETELAH PAJAK PENGHASILAN</span>
                    <div />
                    <span className="text-right font-mono">{formatCurrency(getFinalNetProfit(data)).replace("Rp", "").trim()}</span>
                  </div>
                </div>

                <div className="mt-20 text-center text-[10px] italic text-slate-500">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-20 grid grid-cols-2 gap-20 text-center text-xs font-bold">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="mb-20 uppercase">Direktur</p>
                    <p className="underline">dr M. Arif Rida, M.M.R</p>
                    <p className="font-normal">NBM. 1108 7910 1075945</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "profit_loss" && (
              <motion.div
                key="profit_loss"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="flex justify-end gap-4 no-print max-w-5xl mx-auto">
                </div>

                <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-12 print:shadow-none print:border-none print:p-0">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">RSU MUHAMMADIYAH DARUL ISTIQOMAH KALIWUNGU</h2>
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">KABUPATEN KENDAL</h2>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mt-2">LAPORAN LABA RUGI DETAIL</h2>
                    <p className="text-slate-900 font-medium">
                      UNTUK BULAN YANG BERAKHIR {(() => {
                        const [year, month] = period.split("-").map(Number);
                        const lastDay = new Date(year, month, 0).getDate();
                        const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                        return `${lastDay} ${monthName} ${year}`;
                      })().toUpperCase()}
                    </p>
                    <p className="text-xs italic text-slate-500 mt-1">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
                  </div>

                  <div className="mb-8 relative max-w-md mx-auto print:hidden">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari akun atau kode..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {loading ? (
                    <div className="py-24 flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-500 opacity-40" />
                      <p className="text-slate-900 font-medium italic">Menghitung laba rugi...</p>
                    </div>
                  ) : data.length === 0 ? (
                    <div className="py-24 flex flex-col items-center gap-4 opacity-20">
                      <FileText className="w-12 h-12" />
                      <p className="text-lg font-bold italic">Tidak ada data keuangan.</p>
                    </div>
                  ) : (
                    <div className="p-8 space-y-10">
                      {/* PENDAPATAN SECTION */}
                      <section>
                        <h3 className="text-base font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-4">PENDAPATAN</h3>
                        
                        <div className="space-y-6">
                          {/* Pendapatan Operasional */}
                          <div className="pl-4">
                            <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1">PENDAPATAN OPERASIONAL</h4>
                            
                            <div className="pl-4 space-y-6">
                              {/* Rawat Inap */}
                              <div>
                                <h5 className="text-[13px] font-bold text-slate-900 mb-2 flex justify-between">
                                  <span>PENDAPATAN OPERASIONAL RAWAT INAP</span>
                                </h5>
                                <div className="pl-4 space-y-4">
                                  {[
                                    { label: "PENDAPATAN AKOMODASI KAMAR", prefix: "41101" },
                                    { label: "PENDAPATAN VISITE DR. UMUM", prefix: "41102" },
                                    { label: "PENDAPATAN VISITE DR. SPESIALIS", prefix: "41103" },
                                    { label: "PENDAPATAN TINDAKAN RAWAT INAP", prefix: "41104" },
                                    { label: "PENDAPATAN BEDAH SENTRAL", prefix: "41105" },
                                    { label: "PENDAPATAN SEWA ALAT MEDIK", prefix: "41106" },
                                    { label: "PENDAPATAN TINDAKAN PARTUS", prefix: "41107" },
                                    { label: "PENDAPATAN PENUNJANG MEDIS", prefix: "41108" },
                                  ].map(group => (
                                    <div key={group.prefix} className="group">
                                      <p className="text-[12px] font-bold text-slate-700 mb-1 uppercase tracking-tight">{group.label}</p>
                                      <div className="pl-4 space-y-0.5 border-l border-slate-100">
                                        {data.filter(i => i.account_code.startsWith(group.prefix) && !isParentAccount(data, i.account_code))
                                          .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                          .map(item => (
                                          <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 transition-colors px-2 rounded">
                                            <span className="text-slate-600">{item.account_name}</span>
                                            <span className="text-right font-mono text-slate-900">{item.final_credit - item.final_debit !== 0 ? formatCurrency(item.final_credit - item.final_debit).replace("Rp", "").trim() : "-"}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                  <div className="grid grid-cols-[1fr_150px] items-center pt-2 border-t border-slate-300 font-bold text-[13px] bg-slate-50/50 px-2">
                                    <span className="italic">Jumlah Pendapatan Rawat Inap</span>
                                    <span className="text-right font-mono text-slate-900">{formatCurrency(getPLVal(data, "411", true)).replace("Rp", "").trim()}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Rawat Jalan */}
                              <div>
                                <h5 className="text-[13px] font-bold text-slate-900 mb-2">PENDAPATAN RAWAT JALAN</h5>
                                <div className="pl-4 space-y-4">
                                  {[
                                    { label: "PENDAPATAN PEMERIKSAAN/KONSULTASI", prefix: "41201" },
                                    { label: "PENDAPATAN TINDAKAN RAWAT JALAN", prefix: "41202" },
                                    { label: "PENDAPATAN PENUNJANG MEDIS", prefix: "41203" },
                                  ].map(group => (
                                    <div key={group.prefix} className="group">
                                      <p className="text-[12px] font-bold text-slate-700 mb-1 uppercase tracking-tight">{group.label}</p>
                                      <div className="pl-4 space-y-0.5 border-l border-slate-100">
                                        {data.filter(i => i.account_code.startsWith(group.prefix) && !isParentAccount(data, i.account_code))
                                          .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                          .map(item => (
                                          <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 transition-colors px-2 rounded">
                                            <span className="text-slate-600">{item.account_name}</span>
                                            <span className="text-right font-mono text-slate-900">{item.final_credit - item.final_debit !== 0 ? formatCurrency(item.final_credit - item.final_debit).replace("Rp", "").trim() : "-"}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                  <div className="grid grid-cols-[1fr_150px] items-center pt-2 border-t border-slate-300 font-bold text-[13px] bg-slate-50/50 px-2">
                                    <span className="italic">Jumlah Pendapatan Rawat Jalan</span>
                                    <span className="text-right font-mono text-slate-900">{formatCurrency(getPLVal(data, "412", true)).replace("Rp", "").trim()}</span>
                                  </div>
                                </div>
                              </div>

                              {/* UGD */}
                              <div>
                                <h5 className="text-[13px] font-bold text-slate-900 mb-2">PENDAPATAN UGD</h5>
                                <div className="pl-4 space-y-4">
                                  {[
                                    { label: "PENDAPATAN PEMERIKSAAN UGD", prefix: "41301" },
                                    { label: "PENDAPATAN TINDAKAN UGD", prefix: "41302" },
                                  ].map(group => (
                                    <div key={group.prefix} className="group">
                                      <p className="text-[12px] font-bold text-slate-700 mb-1 uppercase tracking-tight">{group.label}</p>
                                      <div className="pl-4 space-y-0.5 border-l border-slate-100">
                                        {data.filter(i => i.account_code.startsWith(group.prefix) && !isParentAccount(data, i.account_code))
                                          .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                          .map(item => (
                                          <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 transition-colors px-2 rounded">
                                            <span className="text-slate-600">{item.account_name}</span>
                                            <span className="text-right font-mono text-slate-900">{item.final_credit - item.final_debit !== 0 ? formatCurrency(item.final_credit - item.final_debit).replace("Rp", "").trim() : "-"}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                  <div className="grid grid-cols-[1fr_150px] items-center pt-2 border-t border-slate-300 font-bold text-[13px] bg-slate-50/50 px-2">
                                    <span className="italic">Jumlah Pendapatan UGD</span>
                                    <span className="text-right font-mono text-slate-900">{formatCurrency(getPLVal(data, "413", true)).replace("Rp", "").trim()}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Discount */}
                              <div className="grid grid-cols-[1fr_150px] items-center font-bold text-[13px] text-slate-900 bg-red-50/30 px-2 py-1 rounded border border-red-100/50">
                                <span>DISCOUNT</span>
                                <span className="text-right font-mono text-red-600">({formatCurrency(Math.abs(getPLVal(data, "414", true))).replace("Rp", "").trim()})</span>
                              </div>

                              {/* Operasional Lainnya */}
                              <div>
                                <h5 className="text-[13px] font-bold text-slate-900 mb-2">PENDAPATAN OPERASIONAL LAINNYA</h5>
                                <div className="pl-4 space-y-1">
                                  {[
                                    { label: "PENDAPATAN ADMINISTRASI", prefix: "421" },
                                    { label: "PENDAPATAN AMBULANCE", prefix: "422" },
                                    { label: "PENDAPATAN PERAWATAN JENAZAH", prefix: "423" },
                                    { label: "PENDAPATAN SELISIH KLAIM (DANA TAAWUN)", prefix: "424" },
                                  ].map(group => (
                                    <div key={group.prefix} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 px-2 rounded">
                                      <span className="text-slate-600">{group.label}</span>
                                      <span className="text-right font-mono text-slate-900">{getPLVal(data, group.prefix, true) !== 0 ? formatCurrency(getPLVal(data, group.prefix, true)).replace("Rp", "").trim() : "-"}</span>
                                    </div>
                                  ))}
                                  <div className="grid grid-cols-[1fr_150px] items-center pt-2 border-t border-slate-300 font-bold text-[13px] bg-slate-50/50 px-2">
                                    <span className="italic">Jumlah Pendapatan Operasional lain</span>
                                    <span className="text-right font-mono text-slate-900">{formatCurrency(getPLVal(data, "42", true)).replace("Rp", "").trim()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Pendapatan Lain-lain */}
                          <div className="pl-4">
                            <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1">PENDAPATAN LAIN-LAIN</h4>
                            <div className="pl-4 space-y-1">
                              {data.filter(i => i.account_code.startsWith('431') && !isParentAccount(data, i.account_code))
                                .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                .map(item => (
                                <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 px-2 rounded">
                                  <span className="text-slate-600">{item.account_name}</span>
                                  <span className="text-right font-mono text-slate-900">{item.final_credit - item.final_debit !== 0 ? formatCurrency(item.final_credit - item.final_debit).replace("Rp", "").trim() : "-"}</span>
                                </div>
                              ))}
                              <div className="grid grid-cols-[1fr_150px] items-center pt-2 border-t border-slate-300 font-bold text-[13px] bg-slate-50/50 px-2">
                                <span className="italic">Jumlah Pendapatan lain-lain</span>
                                <span className="text-right font-mono text-slate-900">{formatCurrency(getPLVal(data, "431", true)).replace("Rp", "").trim()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Total Pendapatan */}
                          <div className="grid grid-cols-[1fr_150px] items-center pt-4 border-t-2 border-slate-900 font-bold text-base uppercase tracking-widest text-slate-900 bg-emerald-50/50 px-4 py-2 rounded-lg border border-emerald-100">
                            <span>TOTAL PENDAPATAN</span>
                            <span className="text-right font-mono">{formatCurrency(getRevenueTotal(data)).replace("Rp", "").trim()}</span>
                          </div>
                        </div>
                      </section>

                      {/* BEBAN USAHA SECTION */}
                      <section>
                        <h3 className="text-base font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-4">BEBAN USAHA</h3>
                        
                        <div className="space-y-6">
                          {/* HPP & Beban Langsung */}
                          <div className="pl-4">
                            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-tight border-b border-slate-200 pb-1">HARGA POKOK PELAYANAN PASIEN DAN BEBAN LANGSUNG</h4>
                            
                            <div className="pl-4 space-y-6">
                              {/* HPP */}
                              <div>
                                <h5 className="text-[13px] font-bold text-slate-900 mb-2 uppercase">HARGA POKOK PELAYANAN</h5>
                                <div className="pl-4 space-y-1 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('511') && !isParentAccount(data, i.account_code))
                                    .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                    .map(item => (
                                    <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 px-2 rounded">
                                      <span className="text-slate-600">{item.account_name}</span>
                                      <span className="text-right font-mono text-slate-900">{formatCurrency(item.final_debit - item.final_credit).replace("Rp", "").trim()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Beban Langsung */}
                              <div>
                                <h5 className="text-[13px] font-bold text-slate-900 mb-2 uppercase">BEBAN LANGSUNG</h5>
                                <div className="pl-4 space-y-1 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('512') && !isParentAccount(data, i.account_code))
                                    .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                    .map(item => (
                                    <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 px-2 rounded">
                                      <span className="text-slate-600">{item.account_name}</span>
                                      <span className="text-right font-mono text-slate-900">{formatCurrency(item.final_debit - item.final_credit).replace("Rp", "").trim()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Beban Jasa Pelayanan */}
                              <div>
                                <h5 className="text-[13px] font-bold text-slate-900 mb-2 uppercase">BEBAN JASA PELAYANAN</h5>
                                <div className="pl-4 space-y-1 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('513') && !isParentAccount(data, i.account_code))
                                    .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                    .map(item => (
                                    <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 px-2 rounded">
                                      <span className="text-slate-600">{item.account_name}</span>
                                      <span className="text-right font-mono text-slate-900">{formatCurrency(item.final_debit - item.final_credit).replace("Rp", "").trim()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Pemeriksaan Keluar */}
                              <div>
                                <h5 className="text-[13px] font-bold text-slate-900 mb-2 uppercase">PEMERIKSAAN KELUAR</h5>
                                <div className="pl-4 space-y-1 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('514') && !isParentAccount(data, i.account_code))
                                    .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                    .map(item => (
                                    <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 px-2 rounded">
                                      <span className="text-slate-600">{item.account_name}</span>
                                      <span className="text-right font-mono text-slate-900">{formatCurrency(item.final_debit - item.final_credit).replace("Rp", "").trim()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-[1fr_150px] items-center pt-2 border-t border-slate-300 font-bold text-[13px] bg-slate-50/50 px-2">
                                <span className="italic">Total HPP dan Beban Langsung</span>
                                <span className="text-right font-mono text-slate-900">{formatCurrency(getHPPAndDirectExpense(data)).replace("Rp", "").trim()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Laba Kotor */}
                          <div className="grid grid-cols-[1fr_150px] items-center py-3 border-y border-slate-900 font-bold text-base uppercase tracking-widest bg-emerald-50/30 px-4 text-slate-900">
                            <span>LABA KOTOR</span>
                            <span className="text-right font-mono">{formatCurrency(getGrossProfit(data)).replace("Rp", "").trim()}</span>
                          </div>

                          {/* Beban Operasional */}
                          <div className="pl-4">
                            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-tight border-b border-slate-200 pb-1">BEBAN OPERASIONAL</h4>
                            
                            <div className="pl-4 space-y-6">
                              {/* Administrasi & Umum */}
                              <div>
                                <h5 className="text-[13px] font-bold text-slate-900 mb-2 uppercase">BEBAN ADMINISTRASI & UMUM</h5>
                                <div className="pl-4 space-y-4">
                                  {[
                                    { label: "BEBAN PERSONALIA", prefix: "52101" },
                                    { label: "BEBAN ADMINISTRASI", prefix: "52102" },
                                    { label: "BEBAN UMUM", prefix: "52103" },
                                  ].map(group => (
                                    <div key={group.prefix} className="group">
                                      <p className="text-[12px] font-bold text-slate-700 mb-1 uppercase tracking-tight">{group.label}</p>
                                      <div className="pl-4 space-y-0.5 border-l border-slate-100">
                                        {data.filter(i => i.account_code.startsWith(group.prefix) && !isParentAccount(data, i.account_code))
                                          .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                          .map(item => (
                                          <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 px-2 rounded">
                                            <span className="text-slate-600">{item.account_name}</span>
                                            <span className="text-right font-mono text-slate-900">{item.final_debit - item.final_credit !== 0 ? formatCurrency(item.final_debit - item.final_credit).replace("Rp", "").trim() : "-"}</span>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="grid grid-cols-[1fr_150px] items-center pt-1 border-t border-slate-200 font-bold text-[12px] text-slate-900 italic px-2">
                                        <span>Jumlah {group.label}</span>
                                        <span className="text-right font-mono text-slate-900">{formatCurrency(getPLVal(data, group.prefix)).replace("Rp", "").trim()}</span>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="grid grid-cols-[1fr_150px] items-center pt-2 border-t border-slate-300 font-bold text-[13px] bg-slate-50/50 px-2">
                                    <span className="italic">Total Beban Operasional</span>
                                    <span className="text-right font-mono text-slate-900">{formatCurrency(getOperationalExpense(data)).replace("Rp", "").trim()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Laba Operasional */}
                          <div className="grid grid-cols-[1fr_150px] items-center py-3 border-y border-slate-900 font-bold text-base uppercase tracking-widest bg-emerald-50/30 px-4 text-slate-900">
                            <span>LABA OPERASIONAL</span>
                            <span className="text-right font-mono">{formatCurrency(getOperationalProfit(data)).replace("Rp", "").trim()}</span>
                          </div>

                          {/* Beban Lain-lain */}
                          <div className="pl-4">
                            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-tight border-b border-slate-200 pb-1">BEBAN LAIN-LAIN</h4>
                            <div className="pl-4 space-y-1">
                              {data.filter(i => i.account_code.startsWith('531') && !isParentAccount(data, i.account_code))
                                .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                .map(item => (
                                <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 px-2 rounded">
                                  <span className="text-slate-600">{item.account_name}</span>
                                  <span className="text-right font-mono text-slate-900">{item.final_debit - item.final_credit !== 0 ? formatCurrency(item.final_debit - item.final_credit).replace("Rp", "").trim() : "-"}</span>
                                </div>
                              ))}
                              <div className="grid grid-cols-[1fr_150px] items-center pt-2 border-t border-slate-300 font-bold text-[13px] bg-slate-50/50 px-2">
                                <span className="italic">Jumlah Beban Lain-lain</span>
                                <span className="text-right font-mono text-slate-900">{formatCurrency(getOtherExpenseTotal(data)).replace("Rp", "").trim()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Penyusutan & Amortisasi */}
                          <div className="pl-4">
                            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-tight border-b border-slate-200 pb-1">BEBAN PENYUSUTAN DAN MARGIN PINJAMAN</h4>
                            <div className="pl-4 space-y-4">
                              <div>
                                <p className="text-[12px] font-bold text-slate-700 mb-1 uppercase tracking-tight">BEBAN PENYUSUTAN</p>
                                <div className="pl-4 space-y-0.5 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('541') && !isParentAccount(data, i.account_code))
                                    .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                    .map(item => (
                                    <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 px-2 rounded">
                                      <span className="text-slate-600">{item.account_name}</span>
                                      <span className="text-right font-mono text-slate-900">{formatCurrency(item.final_debit - item.final_credit).replace("Rp", "").trim()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[12px] font-bold text-slate-700 mb-1 uppercase tracking-tight">BEBAN AMORTISASI</p>
                                <div className="pl-4 space-y-0.5 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('542') && !isParentAccount(data, i.account_code))
                                    .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                                    .map(item => (
                                    <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] hover:bg-slate-50 px-2 rounded">
                                      <span className="text-slate-600">{item.account_name}</span>
                                      <span className="text-right font-mono text-slate-900">{formatCurrency(item.final_debit - item.final_credit).replace("Rp", "").trim()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-[1fr_150px] items-center text-[13px] px-2">
                                <span className="text-slate-700 uppercase font-bold text-[12px]">Margin Pinjaman Kredit Investasi</span>
                                <span className="text-right font-mono text-slate-900">{formatCurrency(getPLVal(data, "543")).replace("Rp", "").trim()}</span>
                              </div>
                              <div className="grid grid-cols-[1fr_150px] items-center pt-2 border-t border-slate-300 font-bold text-[13px] bg-slate-50/50 px-2">
                                <span className="italic">Total beban penyusutan dan Amortisasi</span>
                                <span className="text-right font-mono text-slate-900">{formatCurrency(getDepreciationAndAmortization(data)).replace("Rp", "").trim()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Laba Bersih Sebelum Pajak */}
                          <div className="grid grid-cols-[1fr_150px] items-center py-4 border-y-2 border-slate-900 font-bold text-lg uppercase tracking-widest bg-slate-100 px-4 text-slate-900 shadow-inner">
                            <span>LABA BERSIH SEBELUM PAJAK</span>
                            <span className="text-right font-mono">{formatCurrency(getNetProfitBeforeTax(data)).replace("Rp", "").trim()}</span>
                          </div>

                          {/* Pajak */}
                          <div className="pl-4 space-y-1">
                            {data.filter(i => i.account_code.startsWith('611') && !isParentAccount(data, i.account_code))
                              .filter(i => !searchTerm || i.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.account_code.includes(searchTerm))
                              .map(item => (
                              <div key={item.account_code} className="grid grid-cols-[1fr_150px] items-center text-[13px] font-bold text-slate-900 px-2">
                                <span>{item.account_name}</span>
                                <span className="text-right font-mono">{formatCurrency(item.final_debit - item.final_credit).replace("Rp", "").trim()}</span>
                              </div>
                            ))}
                            <div className="grid grid-cols-[1fr_150px] items-center text-[13px] font-bold text-slate-900 pt-2 border-t border-slate-300 px-2">
                              <span className="italic">Total Taksiran Pajak</span>
                              <span className="text-right font-mono">{formatCurrency(getTaxEstimation(data)).replace("Rp", "").trim()}</span>
                            </div>
                          </div>

                          {/* Laba Bersih Setelah Pajak */}
                          <div className="grid grid-cols-[1fr_150px] items-center py-5 border-y-4 border-double border-slate-900 font-bold text-xl uppercase tracking-widest bg-[#064E3B] text-white px-4 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none" />
                            <span>LABA BERSIH SETELAH PAJAK</span>
                            <span className="text-right font-mono">{formatCurrency(getFinalNetProfit(data)).replace("Rp", "").trim()}</span>
                          </div>
                        </div>
                      </section>
                    </div>
                  )}
                </div>

                <div className="mt-20 text-center text-[10px] italic text-slate-500">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-20 grid grid-cols-2 gap-20 text-center text-xs font-bold">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="mb-20 uppercase">Direktur</p>
                    <p className="underline">dr M. Arif Rida, M.M.R</p>
                    <p className="font-normal">NBM. 1108 7910 1075945</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "neraca" && (
              <motion.div
                key="neraca"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-end gap-4 no-print max-w-4xl mx-auto">
                </div>
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">RSU MUHAMMADIYAH DARUL ISTIQOMAH KALIWUNGU</h2>
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">KABUPATEN KENDAL</h2>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mt-2">NERACA</h2>
                  <p className="text-slate-900 font-medium">
                    PER {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })().toUpperCase()}
                  </p>
                  <p className="text-xs italic text-slate-500 mt-1">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
                </div>

                <div className="mb-8 relative max-w-md mx-auto print:hidden">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari akun atau kode..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[1fr_100px_200px] border-b-2 border-slate-900 pb-2 mb-6 font-bold text-xs uppercase tracking-widest">
                  <div>Keterangan</div>
                  <div className="text-center">Catatan</div>
                  <div className="text-right">{new Date(period + "-01").toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
                </div>

                <div className="space-y-8 text-sm">
                  {/* ASET SECTION */}
                  <section>
                    <h3 className="font-bold mb-2">ASET</h3>
                    <div className="pl-4 space-y-4">
                      {/* Aset Lancar */}
                      <div>
                        <h4 className="font-bold mb-1">Aset Lancar</h4>
                        <div className="pl-4 space-y-1">
                          {[
                            { label: "Kas dan Setara Kas", note: "3.1", val: getVal(data, "11101") + getVal(data, "11102") },
                            { label: "Investasi Jk Pendek", note: "3.2", val: getVal(data, "11103") },
                            { label: "Piutang Usaha", note: "3.3", val: getVal(data, "11201") },
                            { label: "Piutang Non Usaha", note: "3.4", val: getVal(data, "11202") },
                            { label: "Persediaan", note: "3.5", val: getVal(data, "113") },
                            { label: "Beban Dibayar Dimuka", note: "3.6", val: getVal(data, "114") + getVal(data, "115") + getVal(data, "116") },
                          ].filter(item => !searchTerm || item.label.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                            <div key={item.label} className="grid grid-cols-[1fr_100px_200px] items-center">
                              <span className="text-slate-900">{item.label}</span>
                              <span className="text-center text-emerald-600 font-medium underline cursor-pointer">{item.note}</span>
                              <span className="text-right font-mono">{formatCurrency(item.val).replace("Rp", "").trim()}</span>
                            </div>
                          ))}
                          <div className="grid grid-cols-[1fr_100px_200px] items-center pt-2 border-t border-slate-200 font-bold">
                            <span className="text-emerald-800 italic">Jumlah Aset Lancar</span>
                            <div />
                            <span className="text-right font-mono">{formatCurrency(getVal(data, "11")).replace("Rp", "").trim()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Aset Tetap */}
                      <div>
                        <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold">
                          <span>Aset Tetap</span>
                          <span className="text-center">3.7.</span>
                          <div />
                        </div>
                        <div className="pl-4 space-y-1 mt-1">
                          <h5 className="font-bold text-xs uppercase text-slate-900">Harga Perolehan</h5>
                          <div className="pl-4 space-y-1">
                            {[
                              { label: "Tanah", val: getVal(data, "121010000") },
                              { label: "Bangunan/Gedung", val: getVal(data, "121020000") },
                              { label: "Kendaraan", val: getVal(data, "121030000") },
                              { label: "Peralatan Medis", val: getVal(data, "121040000") },
                              { label: "Peralatan Non Medis", val: getVal(data, "121060000") },
                              { label: "Aset Dalam proses", val: getVal(data, "123010000") + getVal(data, "123020000") },
                            ].filter(item => !searchTerm || item.label.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                              <div key={item.label} className="grid grid-cols-[1fr_100px_200px] items-center">
                                <span className="text-slate-900">{item.label}</span>
                                <div />
                                <span className="text-right font-mono">{formatCurrency(item.val).replace("Rp", "").trim()}</span>
                              </div>
                            ))}
                            <div className="grid grid-cols-[1fr_100px_200px] items-center pt-1 border-t border-slate-100 font-bold">
                              <span className="text-slate-900">Jumlah Harga Perolehan</span>
                              <div />
                              <span className="text-right font-mono">{formatCurrency(getVal(data, "121") + getVal(data, "123")).replace("Rp", "").trim()}</span>
                            </div>
                            <div className="grid grid-cols-[1fr_100px_200px] items-center">
                              <span className="text-slate-900">Akumulasi Penyusutan</span>
                              <div />
                              <span className="text-right font-mono text-red-600">({formatCurrency(Math.abs(getVal(data, "1220"))).replace("Rp", "").trim()})</span>
                            </div>
                            <div className="grid grid-cols-[1fr_100px_200px] items-center pt-1 border-t border-slate-900 font-bold">
                              <span className="text-slate-900">Nilai Buku Aset tetap</span>
                              <div />
                              <span className="text-right font-mono">{formatCurrency(getVal(data, "121") + getVal(data, "123") + getVal(data, "1220")).replace("Rp", "").trim()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Aset Tidak Berwujud */}
                      <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold">
                        <span>Aset Tidak Berwujud</span>
                        <span className="text-center">3.8.</span>
                        <span className="text-right font-mono">{formatCurrency(getVal(data, "131")).replace("Rp", "").trim()}</span>
                      </div>

                      {/* Total Aset */}
                      <div className="grid grid-cols-[1fr_100px_200px] items-center pt-4 border-t-2 border-double border-slate-900 font-bold text-base">
                        <span className="uppercase tracking-widest">Jumlah Aset</span>
                        <div />
                        <span className="text-right font-mono border-b-4 border-double border-slate-900">{formatCurrency(getVal(data, "1")).replace("Rp", "").trim()}</span>
                      </div>
                    </div>
                  </section>

                  {/* KEWAJIBAN DAN EKUITAS SECTION */}
                  <section>
                    <h3 className="font-bold mb-2">KEWAJIBAN DAN EKUITAS</h3>
                    <div className="pl-4 space-y-6">
                      {/* Kewajiban */}
                      <div>
                        <h4 className="font-bold mb-2">KEWAJIBAN</h4>
                        <div className="pl-4 space-y-1">
                          {[
                            { label: "Kewajiban Jangka Pendek", note: "3.9.", val: getVal(data, "21", false) },
                            { label: "Kewajiban Jangka Panjang", note: "3.9.", val: getVal(data, "22", false) },
                          ].map(item => (
                            <div key={item.label} className="grid grid-cols-[1fr_100px_200px] items-center">
                              <span className="text-slate-900">{item.label}</span>
                              <span className="text-center">{item.note}</span>
                              <span className="text-right font-mono">{formatCurrency(item.val).replace("Rp", "").trim()}</span>
                            </div>
                          ))}
                          <div className="grid grid-cols-[1fr_100px_200px] items-center pt-2 border-t border-slate-200 font-bold">
                            <span className="italic">Jumlah Kewajiban</span>
                            <div />
                            <span className="text-right font-mono">{formatCurrency(getVal(data, "2", false)).replace("Rp", "").trim()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Ekuitas */}
                      <div>
                        <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold">
                          <span>EKUITAS</span>
                          <span className="text-center">3.10.</span>
                          <div />
                        </div>
                        <div className="pl-4 space-y-1 mt-1">
                          {[
                            { label: "Modal Persyarikatan", val: getVal(data, "311000000", false) },
                            { label: "Modal Wakaf", val: getVal(data, "312000000", false) },
                            { label: "Laba Tahun Lalu", val: getVal(data, "331000000", false) },
                            { label: "Laba Tahun Berjalan", val: getFinalNetProfit(data) },
                          ].map(item => (
                            <div key={item.label} className="grid grid-cols-[1fr_100px_200px] items-center">
                              <span className="text-slate-900">{item.label}</span>
                              <div />
                              <span className="text-right font-mono">{formatCurrency(item.val).replace("Rp", "").trim()}</span>
                            </div>
                          ))}
                          <div className="grid grid-cols-[1fr_100px_200px] items-center pt-2 border-t border-slate-200 font-bold">
                            <span className="italic">Jumlah Ekuitas</span>
                            <div />
                            <span className="text-right font-mono">{formatCurrency(getVal(data, "31", false) + getVal(data, "331000000", false) + getFinalNetProfit(data)).replace("Rp", "").trim()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Total Kewajiban & Ekuitas */}
                      <div className="grid grid-cols-[1fr_100px_200px] items-center pt-4 border-t-2 border-double border-slate-900 font-bold text-base">
                        <span className="uppercase tracking-widest">Jumlah Kewajiban dan Ekuitas</span>
                        <div />
                        <span className="text-right font-mono border-b-4 border-double border-slate-900">{formatCurrency(getVal(data, "2", false) + getVal(data, "31", false) + getVal(data, "331000000", false) + getFinalNetProfit(data)).replace("Rp", "").trim()}</span>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="mt-20 text-center text-[10px] italic text-slate-500">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-20 grid grid-cols-2 gap-20 text-center text-xs font-bold">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="mb-20 uppercase">Direktur</p>
                    <p className="underline">dr M. Arif Rida, M.M.R</p>
                    <p className="font-normal">NBM. 1108 7910 1075945</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "arus_kas" && (
              <motion.div
                key="arus_kas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-end gap-4 no-print max-w-4xl mx-auto">
                </div>
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">RSU MUHAMMADIYAH DARUL ISTIQOMAH KALIWUNGU</h2>
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">KABUPATEN KENDAL</h2>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mt-2">LAPORAN ARUS KAS</h2>
                  <p className="text-slate-900 font-medium">
                    UNTUK BULAN YANG BERAKHIR {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })().toUpperCase()}
                  </p>
                  <p className="text-xs italic text-slate-500 mt-1">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
                </div>

                <div className="mb-8 relative max-w-md mx-auto print:hidden">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari item arus kas..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-8 text-sm">
                  {/* Aktivitas Operasional */}
                  <section>
                    <h3 className="font-bold mb-4">Arus Kas dari Aktivitas Operasional :</h3>
                      <div className="pl-4 space-y-2">
                        {(!searchTerm || "laba tahun berjalan".includes(searchTerm.toLowerCase())) && (
                          <div className="grid grid-cols-[1fr_200px] items-center">
                            <span>Laba Tahun Berjalan</span>
                            <span className="text-right font-mono">{formatCurrency(getFinalNetProfit(data)).replace("Rp", "").trim()}</span>
                          </div>
                        )}
                        
                        <div className="pl-4 space-y-1">
                          {(!searchTerm || "penyusutan aset tetap".includes(searchTerm.toLowerCase())) && (
                            <>
                              <p className="italic text-xs">Penyesuaian untuk :</p>
                              <div className="grid grid-cols-[1fr_200px] items-center">
                                <span>Penyusutan Aset Tetap</span>
                                <span className="text-right font-mono">{formatCurrency(getPLVal(data, "541")).replace("Rp", "").trim()}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {(!searchTerm || "laba sebelum perubahan modal kerja".includes(searchTerm.toLowerCase())) && (
                          <div className="grid grid-cols-[1fr_200px] items-center font-bold pt-2 border-t border-slate-200">
                            <span>Laba sebelum perubahan modal Kerja</span>
                            <span className="text-right font-mono">{formatCurrency(getFinalNetProfit(data) + getPLVal(data, "541")).replace("Rp", "").trim()}</span>
                          </div>
                        )}

                        <div className="pl-4 space-y-1">
                          {[
                            { label: "Penurunan (Kenaikan) piutang usaha", val: getPrevVal("11201") - getVal(data, "11201") },
                            { label: "Penurunan (Kenaikan) piutang lain", val: getPrevVal("11202") - getVal(data, "11202") },
                            { label: "Penurunan (kenaikan) persediaan", val: getPrevVal("113") - getVal(data, "113") },
                            { label: "Penurunan (kenaikan) beban dibayar dimuka", val: (getPrevVal("114") + getPrevVal("115") + getPrevVal("116")) - (getVal(data, "114") + getVal(data, "115") + getVal(data, "116")) },
                            { label: "Penurunan (Kenaikan) kewajiban jangka pendek", val: getVal(data, "21", false) - getPrevVal("21", false) },
                          ].filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                            <div key={item.label} className="grid grid-cols-[1fr_200px] items-center">
                              <span>{item.label}</span>
                              <span className={cn("text-right font-mono", item.val < 0 && "text-red-600")}>
                                {item.val < 0 ? `(${formatCurrency(Math.abs(item.val)).replace("Rp", "").trim()})` : formatCurrency(item.val).replace("Rp", "").trim()}
                              </span>
                            </div>
                          ))}
                        </div>

                      <div className="grid grid-cols-[1fr_200px] items-center font-bold pt-2 border-t border-slate-900">
                        <span>Arus Kas Bersih dari Aktivitas Operasi</span>
                        {(() => {
                          const val = getFinalNetProfit(data) + getPLVal(data, "541") + 
                                    (getPrevVal("11201") - getVal(data, "11201")) +
                                    (getPrevVal("11202") - getVal(data, "11202")) +
                                    (getPrevVal("113") - getVal(data, "113")) +
                                    ((getPrevVal("114") + getPrevVal("115") + getPrevVal("116")) - (getVal(data, "114") + getVal(data, "115") + getVal(data, "116"))) +
                                    (getVal(data, "21", false) - getPrevVal("21", false));
                          return (
                            <span className={cn("text-right font-mono", val < 0 && "text-red-600")}>
                              {val < 0 ? `(${formatCurrency(Math.abs(val)).replace("Rp", "").trim()})` : formatCurrency(val).replace("Rp", "").trim()}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </section>

                  {/* Aktivitas Investasi */}
                  <section>
                    <h3 className="font-bold mb-4">Arus Kas dari Aktivitas Investasi :</h3>
                    <div className="pl-4 space-y-2">
                      {[
                        { label: "Penurunan (Kenaikan) investasi jangka pendek", val: getPrevVal("11103") - getVal(data, "11103") },
                        { label: "Penurunan (Kenaikan) gedung dan bangunan", val: getPrevVal("12102") - getVal(data, "12102") },
                        { label: "Penurunan (Kenaikan) peralatan medis", val: getPrevVal("12104") - getVal(data, "12104") },
                        { label: "Penurunan (Kenaikan) peralatan non medis", val: getPrevVal("12106") - getVal(data, "12106") },
                        { label: "Penurunan (Kenaikan) kendaraan", val: getPrevVal("12103") - getVal(data, "12103") },
                        { label: "Penurunan (Kenaikan) aset tidak berwujud", val: getPrevVal("131") - getVal(data, "131") },
                        { label: "Pengurangan (penambahan )aset lain-lain", val: (getPrevVal("123010000") - getVal(data, "123010000")) + (getPrevVal("123020000") - getVal(data, "123020000")) + (getPrevVal("12101") - getVal(data, "12101")) },
                      ].filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                        <div key={item.label} className="grid grid-cols-[1fr_200px] items-center">
                          <span>{item.label}</span>
                          <span className={cn("text-right font-mono", item.val < 0 && "text-red-600")}>
                            {item.val === 0 ? "-" : (item.val < 0 ? `(${formatCurrency(Math.abs(item.val)).replace("Rp", "").trim()})` : formatCurrency(item.val).replace("Rp", "").trim())}
                          </span>
                        </div>
                      ))}
                      <div className="grid grid-cols-[1fr_200px] items-center font-bold pt-2 border-t border-slate-900">
                        <span>Arus Kas Bersih dari Aktivitas Investasi</span>
                        {(() => {
                          const val = (getPrevVal("11103") - getVal(data, "11103")) +
                                    (getPrevVal("12102") - getVal(data, "12102")) +
                                    (getPrevVal("12104") - getVal(data, "12104")) +
                                    (getPrevVal("12106") - getVal(data, "12106")) +
                                    (getPrevVal("12103") - getVal(data, "12103")) +
                                    (getPrevVal("131") - getVal(data, "131")) +
                                    (getPrevVal("123010000") - getVal(data, "123010000")) + (getPrevVal("123020000") - getVal(data, "123020000")) + (getPrevVal("12101") - getVal(data, "12101"));
                          return (
                            <span className={cn("text-right font-mono", val < 0 && "text-red-600")}>
                              {val < 0 ? `(${formatCurrency(Math.abs(val)).replace("Rp", "").trim()})` : formatCurrency(val).replace("Rp", "").trim()}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </section>

                  {/* Aktivitas Pendanaan */}
                  <section>
                    <h3 className="font-bold mb-4">Arus Kas dari Aktivitas Pendanaan :</h3>
                    <div className="pl-4 space-y-2">
                      {[
                        { label: "Penurunan (Kenaikan) kewajiban jangka panjang", val: getVal(data, "22", false) - getPrevVal("22", false) },
                        { label: "Penurunan (Kenaikan) ekuitas", val: getVal(data, "331", false) - getPrevVal("331", false) },
                      ].filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                        <div key={item.label} className="grid grid-cols-[1fr_200px] items-center">
                          <span>{item.label}</span>
                          <span className={cn("text-right font-mono", item.val < 0 && "text-red-600")}>
                            {item.val === 0 ? "-" : (item.val < 0 ? `(${formatCurrency(Math.abs(item.val)).replace("Rp", "").trim()})` : formatCurrency(item.val).replace("Rp", "").trim())}
                          </span>
                        </div>
                      ))}
                      <div className="grid grid-cols-[1fr_200px] items-center font-bold pt-2 border-t border-slate-900">
                        <span>Arus Kas Bersih dari Aktivitas Pendanaan</span>
                        {(() => {
                          const val = (getVal(data, "22", false) - getPrevVal("22", false)) +
                                    (getVal(data, "331", false) - getPrevVal("331", false));
                          return (
                            <span className={cn("text-right font-mono", val < 0 && "text-red-600")}>
                              {val < 0 ? `(${formatCurrency(Math.abs(val)).replace("Rp", "").trim()})` : formatCurrency(val).replace("Rp", "").trim()}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </section>

                  {/* Summary */}
                  <section className="pt-6 border-t-2 border-slate-900 space-y-2">
                    {(() => {
                      const op = getFinalNetProfit(data) + getPLVal(data, "541") + 
                                (getPrevVal("11201") - getVal(data, "11201")) +
                                (getPrevVal("11202") - getVal(data, "11202")) +
                                (getPrevVal("113") - getVal(data, "113")) +
                                ((getPrevVal("114") + getPrevVal("115") + getPrevVal("116")) - (getVal(data, "114") + getVal(data, "115") + getVal(data, "116"))) +
                                (getVal(data, "21", false) - getPrevVal("21", false));
                      const inv = (getPrevVal("11103") - getVal(data, "11103")) +
                                (getPrevVal("12102") - getVal(data, "12102")) +
                                (getPrevVal("12104") - getVal(data, "12104")) +
                                (getPrevVal("12106") - getVal(data, "12106")) +
                                (getPrevVal("12103") - getVal(data, "12103")) +
                                (getPrevVal("131") - getVal(data, "131")) +
                                (getPrevVal("123010000") - getVal(data, "123010000")) + (getPrevVal("123020000") - getVal(data, "123020000")) + (getPrevVal("12101") - getVal(data, "12101"));
                      const fin = (getVal(data, "22", false) - getPrevVal("22", false)) +
                                (getVal(data, "331", false) - getPrevVal("331", false));
                      const totalChange = op + inv + fin;
                      const awal = getPrevVal("11101") + getPrevVal("11102");
                      const akhir = awal + totalChange;

                      return (
                        <>
                          <div className="grid grid-cols-[1fr_200px] items-center font-bold">
                            <span>Kenaikan (Penurunan) Kas dan Setara Kas</span>
                            <span className={cn("text-right font-mono border-b-2 border-slate-900", totalChange < 0 && "text-red-600")}>
                              {totalChange < 0 ? `(${formatCurrency(Math.abs(totalChange)).replace("Rp", "").trim()})` : formatCurrency(totalChange).replace("Rp", "").trim()}
                            </span>
                          </div>
                          <div className="grid grid-cols-[1fr_200px] items-center">
                            <span>Kas dan Setara Kas Awal Periode</span>
                            <span className="text-right font-mono">{formatCurrency(awal).replace("Rp", "").trim()}</span>
                          </div>
                          <div className="grid grid-cols-[1fr_200px] items-center font-bold">
                            <span>Kas dan Setara Kas Akhir Periode</span>
                            <span className={cn("text-right font-mono border-b-4 border-double border-slate-900", akhir < 0 && "text-red-600")}>
                              {akhir < 0 ? `(${formatCurrency(Math.abs(akhir)).replace("Rp", "").trim()})` : formatCurrency(akhir).replace("Rp", "").trim()}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </section>
                </div>

                <div className="mt-20 text-center text-[10px] italic text-slate-500">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-20 grid grid-cols-2 gap-20 text-center text-xs font-bold">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="mb-20 uppercase">Direktur</p>
                    <p className="underline">dr M. Arif Rida, M.M.R</p>
                    <p className="font-normal">NBM. 1108 7910 1075945</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "p_ekuitas" && (
              <motion.div
                key="p_ekuitas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-end gap-4 no-print max-w-6xl mx-auto">
                </div>
                <div className="max-w-6xl mx-auto bg-white p-12 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">RSU MUHAMMADIYAH DARUL ISTIQOMAH KALIWUNGU</h2>
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">KABUPATEN KENDAL</h2>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mt-2">LAPORAN PERUBAHAN EKUITAS</h2>
                  <p className="text-slate-900 font-medium">
                    UNTUK BULAN YANG BERAKHIR {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })().toUpperCase()} DAN {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year - 1, month, 0).getDate();
                      const monthName = new Date(year - 1, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year - 1}`;
                    })().toUpperCase()}
                  </p>
                  <p className="text-xs italic text-slate-500 mt-1">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-y-2 border-slate-900">
                        <th className="py-4 px-2 text-left w-1/4">Uraian</th>
                        <th className="py-4 px-2 text-center">Modal Persyarikatan</th>
                        <th className="py-4 px-2 text-center">Modal Wakaf</th>
                        <th className="py-4 px-2 text-center">SHU Yang Belum Ditentukan Penggunaanya</th>
                        <th className="py-4 px-2 text-right">Jumlah Ekuitas Bersih</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* Section 2025 (Previous Year) */}
                      {(() => {
                        // Logic to derive 2025 values
                        // In a real app, we'd fetch the full 2025 data. 
                        // Here we use the initial balances of the current year (Jan 2026) as the end of 2025.
                        const isJan = period.endsWith("-01");
                        
                        // Modal Persyarikatan
                        const modalPersyarikatanFinal2025 = data.find(i => i.account_code === "311000000")?.initial_credit || 0;
                        const modalPersyarikatanInitial2025 = modalPersyarikatanFinal2025; // Assuming no change in 2025 for simplicity if not available
                        
                        // Modal Wakaf
                        const modalWakafFinal2025 = data.find(i => i.account_code === "312000000")?.initial_credit || 0;
                        const modalWakafInitial2025 = modalWakafFinal2025;
                        
                        // SHU
                        const shuFinal2025 = data.find(i => i.account_code === "331000000")?.initial_credit || 0;
                        // We don't easily have the breakdown of 2025 without the 2025 TB.
                        // For display purposes, we'll show the current year's movement clearly.
                        
                        return (
                          <>
                            <tr className="font-bold bg-slate-50/50">
                              <td className="py-3 px-2">Saldo 01 Januari {parseInt(period.split("-")[0]) - 1}</td>
                              <td className="py-3 px-2 text-center font-mono">-</td>
                              <td className="py-3 px-2 text-center font-mono">-</td>
                              <td className="py-3 px-2 text-center font-mono">-</td>
                              <td className="py-3 px-2 text-right font-mono">-</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Koreksi Laba Tahun Lalu</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-right font-mono">-</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Pembagian SHU</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-right font-mono">-</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Laba Tahun Berjalan</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-right font-mono">-</td>
                            </tr>
                            <tr className="font-bold border-y border-slate-900">
                              <td className="py-3 px-2">Saldo 31 Desember {parseInt(period.split("-")[0]) - 1}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(modalPersyarikatanFinal2025).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(modalWakafFinal2025).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(shuFinal2025).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-right font-mono">{formatCurrency(modalPersyarikatanFinal2025 + modalWakafFinal2025 + shuFinal2025).replace("Rp", "").trim()}</td>
                            </tr>

                            {/* Section Current Year */}
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Koreksi Laba tahun Lalu</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-right font-mono">-</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Pembagian SHU</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono text-red-600">
                                {(() => {
                                  // Find mutation in 331 (Pembagian SHU usually goes here or a specific account)
                                  const val = getMutationVal(data, "331", false);
                                  return val < 0 ? `(${formatCurrency(Math.abs(val)).replace("Rp", "").trim()})` : (val === 0 ? "-" : formatCurrency(val).replace("Rp", "").trim());
                                })()}
                              </td>
                              <td className="py-2 px-2 text-right font-mono text-red-600">
                                {(() => {
                                  const val = getMutationVal(data, "331", false);
                                  return val < 0 ? `(${formatCurrency(Math.abs(val)).replace("Rp", "").trim()})` : (val === 0 ? "-" : formatCurrency(val).replace("Rp", "").trim());
                                })()}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Laba Tahun Berjalan</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">{formatCurrency(getFinalNetProfit(data)).replace("Rp", "").trim()}</td>
                              <td className="py-2 px-2 text-right font-mono">{formatCurrency(getFinalNetProfit(data)).replace("Rp", "").trim()}</td>
                            </tr>
                            <tr className="font-bold border-y-2 border-slate-900 bg-emerald-50">
                              <td className="py-3 px-2">Saldo 31 {(() => {
                                const [year, month] = period.split("-").map(Number);
                                return new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                              })()} {period.split("-")[0]}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(getVal(data, "311000000", false)).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(getVal(data, "312000000", false)).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(getVal(data, "331000000", false) + getFinalNetProfit(data)).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-right font-mono">{formatCurrency(getVal(data, "31", false) + getVal(data, "331000000", false) + getFinalNetProfit(data)).replace("Rp", "").trim()}</td>
                            </tr>
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="mt-20 text-center text-[10px] italic text-slate-500">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-20 grid grid-cols-2 gap-20 text-center text-xs font-bold">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="mb-20 uppercase">Direktur</p>
                    <p className="underline">dr M. Arif Rida, M.M.R</p>
                    <p className="font-normal">NBM. 1108 7910 1075945</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "rkapb_comparison" && (
            <motion.div
              key="rkapb_comparison"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                {/* Header */}
                <div className="text-center mb-12">
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">RSU MUHAMMADIYAH DARUL ISTIQOMAH KALIWUNGU</h2>
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">KABUPATEN KENDAL</h2>
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mt-2">LAPORAN REALISASI VS ANGGARAN (RKAPB)</h2>
                  <p className="text-slate-900 font-medium">
                    PERIODE {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${monthName} ${year}`.toUpperCase();
                    })()}
                  </p>
                </div>

                {loading ? (
                  <div className="py-24 flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 opacity-40" />
                    <p className="text-slate-900 font-medium italic">Menghitung perbandingan...</p>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg">
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-800 text-white border-b border-slate-900">
                          <th rowSpan={2} className="py-3 px-2 text-left font-bold border-r border-slate-700 min-w-[250px] sticky top-[92px] left-0 bg-slate-800 z-40">URAIAN</th>
                          <th colSpan={4} className="py-2 px-2 text-center font-bold border-r border-slate-700 border-b border-slate-700 sticky top-[92px] bg-slate-800 z-30">BULAN INI</th>
                          <th colSpan={4} className="py-2 px-2 text-center font-bold border-b border-slate-700 sticky top-[92px] bg-slate-800 z-30">YEAR TO DATE (YTD)</th>
                        </tr>
                        <tr className="bg-slate-100 text-slate-900 border-b-2 border-slate-300">
                          <th className="py-2 px-2 text-right font-bold border-r border-slate-200 bg-blue-50/50 sticky top-[130px] z-30">REALISASI</th>
                          <th className="py-2 px-2 text-right font-bold border-r border-slate-200 bg-emerald-50/50 sticky top-[130px] z-30">ANGGARAN</th>
                          <th className="py-2 px-2 text-right font-bold border-r border-slate-200 sticky top-[130px] bg-slate-100 z-30">SELISIH</th>
                          <th className="py-2 px-2 text-right font-bold border-r border-slate-200 sticky top-[130px] bg-slate-100 z-30">%</th>
                          <th className="py-2 px-2 text-right font-bold border-r border-slate-200 bg-blue-50/50 sticky top-[130px] z-30">REALISASI</th>
                          <th className="py-2 px-2 text-right font-bold border-r border-slate-200 bg-emerald-50/50 sticky top-[130px] z-30">ANGGARAN</th>
                          <th className="py-2 px-2 text-right font-bold border-r border-slate-200 sticky top-[130px] bg-slate-100 z-30">SELISIH</th>
                          <th className="py-2 px-2 text-right font-bold sticky top-[130px] bg-slate-100 z-30">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* PENDAPATAN SECTION */}
                        <tr 
                          className="bg-slate-50 font-bold cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => setExpandedGroups(prev => ({ ...prev, pendapatan: !prev.pendapatan }))}
                        >
                          <td colSpan={9} className="py-2 px-2 uppercase tracking-wider text-slate-700 text-[11px] flex items-center gap-2 sticky left-0 bg-slate-50 z-10">
                            {expandedGroups.pendapatan ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            PENDAPATAN
                          </td>
                        </tr>
                        {expandedGroups.pendapatan && (() => {
                          const month = parseInt(period.split("-")[1]);
                          const rows = [
                            { label: "PENDAPATAN RAWAT INAP", code: "411" },
                            { label: "PENDAPATAN RAWAT JALAN", code: "412" },
                            { label: "PENDAPATAN IGD", code: "413" },
                            { label: "PENDAPATAN PENUNJANG MEDIS", code: "414" },
                            { label: "PENDAPATAN NON MEDIS", code: "415" },
                            { label: "PENDAPATAN LAIN-LAIN", code: "42" },
                          ];
                          
                          return rows.map(r => {
                            const real = getPLVal(data, r.code, true);
                            const budget = getBudgetVal(r.code, month);
                            const diff = real - budget;
                            const pct = budget !== 0 ? (real / budget) * 100 : 0;

                            const realYtd = getPLVal(data, r.code, true); 
                            const budgetYtd = Array.from({length: month}, (_, i) => getBudgetVal(r.code, i + 1)).reduce((a, b) => a + b, 0);
                            const diffYtd = realYtd - budgetYtd;
                            const pctYtd = budgetYtd !== 0 ? (realYtd / budgetYtd) * 100 : 0;

                            const children = data.filter(item => item.account_code.startsWith(r.code) && item.account_code !== r.code && !isParentAccount(data, item.account_code));

                            return (
                              <React.Fragment key={r.code}>
                                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setExpandedGroups(prev => ({ ...prev, [r.code]: !prev[r.code] }))}>
                                  <td className="py-2 px-2 pl-8 text-slate-700 font-medium sticky left-0 bg-white z-10 flex items-center gap-2">
                                    {expandedGroups[r.code] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                    {r.label}
                                  </td>
                                  <td className="py-2 px-2 text-right font-mono bg-blue-50/10">{formatCurrency(real).replace("Rp", "").trim()}</td>
                                  <td className="py-2 px-2 text-right font-mono bg-emerald-50/10">{formatCurrency(budget).replace("Rp", "").trim()}</td>
                                  <td className={cn("py-2 px-2 text-right font-mono", diff < 0 ? "text-red-600" : "text-emerald-600")}>{formatCurrency(diff).replace("Rp", "").trim()}</td>
                                  <td className="py-2 px-2 text-right font-mono border-r border-slate-100">{pct.toFixed(1)}%</td>
                                  <td className="py-2 px-2 text-right font-mono bg-blue-50/10">{formatCurrency(realYtd).replace("Rp", "").trim()}</td>
                                  <td className="py-2 px-2 text-right font-mono bg-emerald-50/10">{formatCurrency(budgetYtd).replace("Rp", "").trim()}</td>
                                  <td className={cn("py-2 px-2 text-right font-mono", diffYtd < 0 ? "text-red-600" : "text-emerald-600")}>{formatCurrency(diffYtd).replace("Rp", "").trim()}</td>
                                  <td className="py-2 px-2 text-right font-mono">{pctYtd.toFixed(1)}%</td>
                                </tr>
                                {expandedGroups[r.code] && children.map(child => {
                                  const cReal = child.final_credit - child.final_debit;
                                  const cBudget = getBudgetVal(child.account_code, month);
                                  const cDiff = cReal - cBudget;
                                  const cPct = cBudget !== 0 ? (cReal / cBudget) * 100 : 0;

                                  const cRealYtd = cReal; // Simplified
                                  const cBudgetYtd = Array.from({length: month}, (_, i) => getBudgetVal(child.account_code, i + 1)).reduce((a, b) => a + b, 0);
                                  const cDiffYtd = cRealYtd - cBudgetYtd;
                                  const cPctYtd = cBudgetYtd !== 0 ? (cRealYtd / cBudgetYtd) * 100 : 0;

                                  return (
                                    <tr key={child.account_code} className="border-b border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors text-[10px]">
                                      <td className="py-1.5 px-2 pl-14 text-slate-500 italic sticky left-0 bg-slate-50/30 z-10">{child.account_name}</td>
                                      <td className="py-1.5 px-2 text-right font-mono opacity-70">{formatCurrency(cReal).replace("Rp", "").trim()}</td>
                                      <td className="py-1.5 px-2 text-right font-mono opacity-70">{formatCurrency(cBudget).replace("Rp", "").trim()}</td>
                                      <td className={cn("py-1.5 px-2 text-right font-mono opacity-70", cDiff < 0 ? "text-red-400" : "text-emerald-400")}>{formatCurrency(cDiff).replace("Rp", "").trim()}</td>
                                      <td className="py-1.5 px-2 text-right font-mono border-r border-slate-100 opacity-70">{cPct.toFixed(1)}%</td>
                                      <td className="py-1.5 px-2 text-right font-mono opacity-70">{formatCurrency(cRealYtd).replace("Rp", "").trim()}</td>
                                      <td className="py-1.5 px-2 text-right font-mono opacity-70">{formatCurrency(cBudgetYtd).replace("Rp", "").trim()}</td>
                                      <td className={cn("py-1.5 px-2 text-right font-mono opacity-70", cDiffYtd < 0 ? "text-red-400" : "text-emerald-400")}>{formatCurrency(cDiffYtd).replace("Rp", "").trim()}</td>
                                      <td className="py-1.5 px-2 text-right font-mono opacity-70">{cPctYtd.toFixed(1)}%</td>
                                    </tr>
                                  );
                                })}
                              </React.Fragment>
                            );
                          });
                        })()}
                        {(() => {
                          const month = parseInt(period.split("-")[1]);
                          const real = getRevenueTotal(data);
                          const budget = getBudgetTotal("4", month);
                          const diff = real - budget;
                          const pct = budget !== 0 ? (real / budget) * 100 : 0;

                          const realYtd = getRevenueTotal(data);
                          const budgetYtd = Array.from({length: month}, (_, i) => getBudgetTotal("4", i + 1)).reduce((a, b) => a + b, 0);
                          const diffYtd = realYtd - budgetYtd;
                          const pctYtd = budgetYtd !== 0 ? (realYtd / budgetYtd) * 100 : 0;

                          return (
                            <tr className="bg-emerald-50 font-bold border-y border-slate-200">
                              <td className="py-2 px-2 pl-4 sticky left-0 bg-emerald-50 z-10">TOTAL PENDAPATAN</td>
                              <td className="py-2 px-2 text-right font-mono">{formatCurrency(real).replace("Rp", "").trim()}</td>
                              <td className="py-2 px-2 text-right font-mono">{formatCurrency(budget).replace("Rp", "").trim()}</td>
                              <td className={cn("py-2 px-2 text-right font-mono", diff < 0 ? "text-red-600" : "text-emerald-600")}>{formatCurrency(diff).replace("Rp", "").trim()}</td>
                              <td className="py-2 px-2 text-right font-mono border-r border-slate-200">{pct.toFixed(1)}%</td>
                              <td className="py-2 px-2 text-right font-mono">{formatCurrency(realYtd).replace("Rp", "").trim()}</td>
                              <td className="py-2 px-2 text-right font-mono">{formatCurrency(budgetYtd).replace("Rp", "").trim()}</td>
                              <td className={cn("py-2 px-2 text-right font-mono", diffYtd < 0 ? "text-red-600" : "text-emerald-600")}>{formatCurrency(diffYtd).replace("Rp", "").trim()}</td>
                              <td className="py-2 px-2 text-right font-mono">{pctYtd.toFixed(1)}%</td>
                            </tr>
                          );
                        })()}

                        {/* BEBAN SECTION */}
                        <tr 
                          className="bg-slate-50 font-bold cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => setExpandedGroups(prev => ({ ...prev, beban: !prev.beban }))}
                        >
                          <td colSpan={9} className="py-2 px-2 uppercase tracking-wider text-slate-700 text-[11px] flex items-center gap-2 mt-4 sticky left-0 bg-slate-50 z-10">
                            {expandedGroups.beban ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            BEBAN USAHA
                          </td>
                        </tr>
                        {expandedGroups.beban && (() => {
                          const month = parseInt(period.split("-")[1]);
                          const rows = [
                            { label: "BEBAN PEGAWAI", code: "52101" },
                            { label: "BEBAN ADMINISTRASI", code: "52102" },
                            { label: "BEBAN UMUM", code: "52103" },
                            { label: "BEBAN LAIN-LAIN", code: "531" },
                            { label: "BEBAN PENYUSUTAN", code: "541" },
                          ];
                          
                          return rows.map(r => {
                            const real = getPLVal(data, r.code, false);
                            const budget = getBudgetVal(r.code, month);
                            const diff = budget - real;
                            const pct = budget !== 0 ? (real / budget) * 100 : 0;

                            const realYtd = getPLVal(data, r.code, false);
                            const budgetYtd = Array.from({length: month}, (_, i) => getBudgetVal(r.code, i + 1)).reduce((a, b) => a + b, 0);
                            const diffYtd = budgetYtd - realYtd;
                            const pctYtd = budgetYtd !== 0 ? (realYtd / budgetYtd) * 100 : 0;

                            const children = data.filter(item => item.account_code.startsWith(r.code) && item.account_code !== r.code && !isParentAccount(data, item.account_code));

                            return (
                              <React.Fragment key={r.code}>
                                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setExpandedGroups(prev => ({ ...prev, [r.code]: !prev[r.code] }))}>
                                  <td className="py-2 px-2 pl-8 text-slate-700 font-medium sticky left-0 bg-white z-10 flex items-center gap-2">
                                    {expandedGroups[r.code] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                    {r.label}
                                  </td>
                                  <td className="py-2 px-2 text-right font-mono bg-blue-50/10">{formatCurrency(real).replace("Rp", "").trim()}</td>
                                  <td className="py-2 px-2 text-right font-mono bg-emerald-50/10">{formatCurrency(budget).replace("Rp", "").trim()}</td>
                                  <td className={cn("py-2 px-2 text-right font-mono", diff < 0 ? "text-red-600" : "text-emerald-600")}>{formatCurrency(diff).replace("Rp", "").trim()}</td>
                                  <td className="py-2 px-2 text-right font-mono border-r border-slate-100">{pct.toFixed(1)}%</td>
                                  <td className="py-2 px-2 text-right font-mono bg-blue-50/10">{formatCurrency(realYtd).replace("Rp", "").trim()}</td>
                                  <td className="py-2 px-2 text-right font-mono bg-emerald-50/10">{formatCurrency(budgetYtd).replace("Rp", "").trim()}</td>
                                  <td className={cn("py-2 px-2 text-right font-mono", diffYtd < 0 ? "text-red-600" : "text-emerald-600")}>{formatCurrency(diffYtd).replace("Rp", "").trim()}</td>
                                  <td className="py-2 px-2 text-right font-mono">{pctYtd.toFixed(1)}%</td>
                                </tr>
                                {expandedGroups[r.code] && children.map(child => {
                                  const cReal = child.final_debit - child.final_credit;
                                  const cBudget = getBudgetVal(child.account_code, month);
                                  const cDiff = cBudget - cReal;
                                  const cPct = cBudget !== 0 ? (cReal / cBudget) * 100 : 0;

                                  const cRealYtd = cReal;
                                  const cBudgetYtd = Array.from({length: month}, (_, i) => getBudgetVal(child.account_code, i + 1)).reduce((a, b) => a + b, 0);
                                  const cDiffYtd = cBudgetYtd - cRealYtd;
                                  const cPctYtd = cBudgetYtd !== 0 ? (cRealYtd / cBudgetYtd) * 100 : 0;

                                  return (
                                    <tr key={child.account_code} className="border-b border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors text-[10px]">
                                      <td className="py-1.5 px-2 pl-14 text-slate-500 italic sticky left-0 bg-slate-50/30 z-10">{child.account_name}</td>
                                      <td className="py-1.5 px-2 text-right font-mono opacity-70">{formatCurrency(cReal).replace("Rp", "").trim()}</td>
                                      <td className="py-1.5 px-2 text-right font-mono opacity-70">{formatCurrency(cBudget).replace("Rp", "").trim()}</td>
                                      <td className={cn("py-1.5 px-2 text-right font-mono opacity-70", cDiff < 0 ? "text-red-400" : "text-emerald-400")}>{formatCurrency(cDiff).replace("Rp", "").trim()}</td>
                                      <td className="py-1.5 px-2 text-right font-mono border-r border-slate-100 opacity-70">{cPct.toFixed(1)}%</td>
                                      <td className="py-1.5 px-2 text-right font-mono opacity-70">{formatCurrency(cRealYtd).replace("Rp", "").trim()}</td>
                                      <td className="py-1.5 px-2 text-right font-mono opacity-70">{formatCurrency(cBudgetYtd).replace("Rp", "").trim()}</td>
                                      <td className={cn("py-1.5 px-2 text-right font-mono opacity-70", cDiffYtd < 0 ? "text-red-400" : "text-emerald-400")}>{formatCurrency(cDiffYtd).replace("Rp", "").trim()}</td>
                                      <td className="py-1.5 px-2 text-right font-mono opacity-70">{cPctYtd.toFixed(1)}%</td>
                                    </tr>
                                  );
                                })}
                              </React.Fragment>
                            );
                          });
                        })()}
                        {(() => {
                          const month = parseInt(period.split("-")[1]);
                          const real = getExpenseTotal(data);
                          const budget = getBudgetTotal("5", month);
                          const diff = budget - real;
                          const pct = budget !== 0 ? (real / budget) * 100 : 0;

                          const realYtd = getExpenseTotal(data);
                          const budgetYtd = Array.from({length: month}, (_, i) => getBudgetTotal("5", i + 1)).reduce((a, b) => a + b, 0);
                          const diffYtd = budgetYtd - realYtd;
                          const pctYtd = budgetYtd !== 0 ? (realYtd / budgetYtd) * 100 : 0;

                          return (
                            <tr className="bg-red-50 font-bold border-y border-slate-200">
                              <td className="py-2 px-2 pl-4 sticky left-0 bg-red-50 z-10">TOTAL BEBAN USAHA</td>
                              <td className="py-2 px-2 text-right font-mono">{formatCurrency(real).replace("Rp", "").trim()}</td>
                              <td className="py-2 px-2 text-right font-mono">{formatCurrency(budget).replace("Rp", "").trim()}</td>
                              <td className={cn("py-2 px-2 text-right font-mono", diff < 0 ? "text-red-600" : "text-emerald-600")}>{formatCurrency(diff).replace("Rp", "").trim()}</td>
                              <td className="py-2 px-2 text-right font-mono border-r border-slate-200">{pct.toFixed(1)}%</td>
                              <td className="py-2 px-2 text-right font-mono">{formatCurrency(realYtd).replace("Rp", "").trim()}</td>
                              <td className="py-2 px-2 text-right font-mono">{formatCurrency(budgetYtd).replace("Rp", "").trim()}</td>
                              <td className={cn("py-2 px-2 text-right font-mono", diffYtd < 0 ? "text-red-600" : "text-emerald-600")}>{formatCurrency(diffYtd).replace("Rp", "").trim()}</td>
                              <td className="py-2 px-2 text-right font-mono">{pctYtd.toFixed(1)}%</td>
                            </tr>
                          );
                        })()}

                        {/* LABA BERSIH SEBELUM PAJAK */}
                        <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                          <td className="py-2.5 px-2 pl-4 sticky left-0 bg-slate-100 z-10">LABA BERSIH SEBELUM PAJAK</td>
                          <td className="py-2.5 px-2 text-right font-mono">{formatCurrency(getNetProfitBeforeTax(data)).replace("Rp", "").trim()}</td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              return formatCurrency(getBudgetNetProfitBeforeTax(month)).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const real = getNetProfitBeforeTax(data);
                              const budget = getBudgetNetProfitBeforeTax(month);
                              return formatCurrency(real - budget).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono border-r border-slate-200">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const real = getNetProfitBeforeTax(data);
                              const budget = getBudgetNetProfitBeforeTax(month);
                              return budget !== 0 ? ((real / budget) * 100).toFixed(1) : "0";
                            })()}%
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">{formatCurrency(getNetProfitBeforeTax(data)).replace("Rp", "").trim()}</td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitBeforeTax(i + 1)).reduce((a, b) => a + b, 0);
                              return formatCurrency(budgetYtd).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitBeforeTax(i + 1)).reduce((a, b) => a + b, 0);
                              const realYtd = getNetProfitBeforeTax(data);
                              const diffYtd = realYtd - budgetYtd;
                              return formatCurrency(diffYtd).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitBeforeTax(i + 1)).reduce((a, b) => a + b, 0);
                              const realYtd = getNetProfitBeforeTax(data);
                              return budgetYtd !== 0 ? ((realYtd / budgetYtd) * 100).toFixed(1) : "0";
                            })()}%
                          </td>
                        </tr>

                        {/* TAKSIRAN PAJAK PENGHASILAN */}
                        <tr className="bg-white border-b border-slate-200">
                          <td className="py-2.5 px-2 pl-4 sticky left-0 bg-white z-10">TAKSIRAN PAJAK PENGHASILAN (22%)</td>
                          <td className="py-2.5 px-2 text-right font-mono">{formatCurrency(getTaxEstimation(data)).replace("Rp", "").trim()}</td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              return formatCurrency(getBudgetNetProfitBeforeTax(month) * 0.22).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const real = getTaxEstimation(data);
                              const budget = getBudgetNetProfitBeforeTax(month) * 0.22;
                              return formatCurrency(real - budget).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono border-r border-slate-200">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const real = getTaxEstimation(data);
                              const budget = getBudgetNetProfitBeforeTax(month) * 0.22;
                              return budget !== 0 ? ((real / budget) * 100).toFixed(1) : "0";
                            })()}%
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">{formatCurrency(getTaxEstimation(data)).replace("Rp", "").trim()}</td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitBeforeTax(i + 1) * 0.22).reduce((a, b) => a + b, 0);
                              return formatCurrency(budgetYtd).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitBeforeTax(i + 1) * 0.22).reduce((a, b) => a + b, 0);
                              const realYtd = getTaxEstimation(data);
                              const diffYtd = realYtd - budgetYtd;
                              return formatCurrency(diffYtd).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitBeforeTax(i + 1) * 0.22).reduce((a, b) => a + b, 0);
                              const realYtd = getTaxEstimation(data);
                              return budgetYtd !== 0 ? ((realYtd / budgetYtd) * 100).toFixed(1) : "0";
                            })()}%
                          </td>
                        </tr>

                        {/* LABA BERSIH SETELAH PAJAK */}
                        <tr className="bg-slate-900 text-white font-bold border-y-2 border-slate-900">
                          <td className="py-3 px-2 pl-4 sticky left-0 bg-slate-900 z-10 uppercase">LABA (RUGI) SETELAH PAJAK</td>
                          <td className="py-3 px-2 text-right font-mono">{formatCurrency(getNetProfit(data)).replace("Rp", "").trim()}</td>
                          <td className="py-3 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              return formatCurrency(getBudgetNetProfitAfterTax(month)).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-3 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const diff = getNetProfit(data) - getBudgetNetProfitAfterTax(month);
                              return formatCurrency(diff).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-3 px-2 text-right font-mono border-r border-slate-700">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budget = getBudgetNetProfitAfterTax(month);
                              const real = getNetProfit(data);
                              return budget !== 0 ? ((real / budget) * 100).toFixed(1) : "0";
                            })()}%
                          </td>
                          <td className="py-3 px-2 text-right font-mono">{formatCurrency(getNetProfit(data)).replace("Rp", "").trim()}</td>
                          <td className="py-3 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitAfterTax(i + 1)).reduce((a, b) => a + b, 0);
                              return formatCurrency(budgetYtd).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-3 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitAfterTax(i + 1)).reduce((a, b) => a + b, 0);
                              const diffYtd = getNetProfit(data) - budgetYtd;
                              return formatCurrency(diffYtd).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-3 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitAfterTax(i + 1)).reduce((a, b) => a + b, 0);
                              const realYtd = getNetProfit(data);
                              return budgetYtd !== 0 ? ((realYtd / budgetYtd) * 100).toFixed(1) : "0";
                            })()}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

            {activeTab === "ebitda_eat" && (
              <motion.div
                key="ebitda_eat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-display font-bold text-slate-900">Perhitungan EBITDA & EAT</h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Analisis Profitabilitas • {getTargetSheetName(period)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 no-print">
                    </div>
                  </div>
                </div>

                <div className="p-8 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-widest rounded-tl-xl border-r border-white/10">Keterangan</th>
                        <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-widest border-r border-white/10">Realisasi {getTargetSheetName(period).split(' ')[0]}</th>
                        <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-widest rounded-tr-xl">RKAPB {getTargetSheetName(period).split(' ')[0]}</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {(() => {
                        const month = parseInt(period.split("-")[1]);
                        
                        // Realisasi
                        const realRevenue = getRevenueTotal(data);
                        const realOpCosts = getHPPAndDirectExpense(data) + getOperationalExpense(data) + getOtherExpenseTotal(data);
                        const realEbitda = realRevenue - realOpCosts;
                        const realDepr = getDepreciationAndAmortization(data);
                        const realTax = getTaxEstimation(data);
                        const realEat = realEbitda - realDepr - realTax;
                        
                        // RKAPB
                        const budRevenue = getBudgetTotal('4', month);
                        const budOpCosts = getBudgetTotal('51', month) + getBudgetTotal('52101', month) + getBudgetTotal('52102', month) + getBudgetTotal('52103', month) + getBudgetTotal('531', month);
                        const budEbitda = budRevenue - budOpCosts;
                        const budDepr = getBudgetTotal('541', month) + getBudgetTotal('542', month) + getBudgetTotal('543', month);
                        const budTax = getBudgetNetProfitBeforeTax(month) * 0.22;
                        const budEat = budEbitda - budDepr - budTax;

                        const rows = [
                          { label: "Total Pendapatan", real: realRevenue, bud: budRevenue, isBold: false },
                          { label: "Total Biaya (Operasional)", real: realOpCosts, bud: budOpCosts, isBold: false },
                          { label: "SHU (EBITDA)", real: realEbitda, bud: budEbitda, isBold: true, isHighlight: true },
                          { label: "Penyusutan & Amortisasi", real: realDepr, bud: budDepr, isBold: false },
                          { label: "Taksiran Pajak Penghasilan", real: realTax, bud: budTax, isBold: false },
                          { label: "SHU Bersih (EAT)", real: realEat, bud: budEat, isBold: true, isHighlight: true },
                          { 
                            label: "Prosentase EBITDA Atas Pendapatan", 
                            real: realRevenue !== 0 ? (realEbitda / realRevenue) * 100 : 0, 
                            bud: budRevenue !== 0 ? (budEbitda / budRevenue) * 100 : 0, 
                            isPct: true 
                          },
                          { 
                            label: "Prosentase EAT Atas Pendapatan", 
                            real: realRevenue !== 0 ? (realEat / realRevenue) * 100 : 0, 
                            bud: budRevenue !== 0 ? (budEat / budRevenue) * 100 : 0, 
                            isPct: true 
                          },
                        ];

                        return rows.map((row, idx) => (
                          <tr 
                            key={idx} 
                            className={cn(
                              "border-b border-slate-100 hover:bg-slate-50/50 transition-colors",
                              row.isHighlight && "bg-emerald-50/30"
                            )}
                          >
                            <td className={cn("py-4 px-6 font-medium text-slate-700", row.isBold && "font-bold text-slate-900")}>
                              {row.label}
                            </td>
                            <td className={cn("py-4 px-6 text-right font-mono text-slate-600", row.isBold && "font-bold text-emerald-700")}>
                              {row.isPct ? `${row.real.toFixed(1)}%` : formatCurrency(row.real)}
                            </td>
                            <td className={cn("py-4 px-6 text-right font-mono text-slate-600", row.isBold && "font-bold text-blue-700")}>
                              {row.isPct ? `${row.bud.toFixed(1)}%` : formatCurrency(row.bud)}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analisis EBITDA</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) memberikan gambaran tentang kemampuan operasional rumah sakit dalam menghasilkan kas sebelum dipengaruhi oleh kebijakan akuntansi (penyusutan) dan kewajiban pajak.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analisis EAT</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        EAT (Earnings After Tax) atau SHU Bersih mencerminkan profitabilitas akhir yang dapat digunakan untuk pengembangan rumah sakit atau pembagian jasa produksi setelah memperhitungkan seluruh beban operasional, penyusutan, dan pajak.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "rkapb_ratios" && (
            <motion.div
              key="rkapb_ratios"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="text-center mb-12">
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">ANALISA RASIO KEUANGAN</h2>
                  <p className="text-slate-500 font-medium">PERIODE {period}</p>
                </div>

                {(() => {
                  const totalAssets = data.filter(i => i.account_code.startsWith('1') && !isParentAccount(data, i.account_code)).reduce((acc, i) => acc + (i.final_debit - i.final_credit), 0);
                  const totalLiabilities = data.filter(i => i.account_code.startsWith('2') && !isParentAccount(data, i.account_code)).reduce((acc, i) => acc + (i.final_credit - i.final_debit), 0);
                  const totalEquity = data.filter(i => i.account_code.startsWith('3') && !isParentAccount(data, i.account_code)).reduce((acc, i) => acc + (i.final_credit - i.final_debit), 0);
                  const revenue = getRevenueTotal(data);
                  const netProfit = getNetProfit(data);
                  const currentAssets = data.filter(i => i.account_code.startsWith('11') && !isParentAccount(data, i.account_code)).reduce((acc, i) => acc + (i.final_debit - i.final_credit), 0);
                  const currentLiabilities = data.filter(i => i.account_code.startsWith('21') && !isParentAccount(data, i.account_code)).reduce((acc, i) => acc + (i.final_credit - i.final_debit), 0);
                  const inventory = data.filter(i => i.account_code.startsWith('114') && !isParentAccount(data, i.account_code)).reduce((acc, i) => acc + (i.final_debit - i.final_credit), 0);
                  const cashAndBank = data.filter(i => i.account_code.startsWith('111') && !isParentAccount(data, i.account_code)).reduce((acc, i) => acc + (i.final_debit - i.final_credit), 0);
                  
                  const getStatus = (val: number, thresholds: { sangat: number, sehat: number, kurang: number }) => {
                    if (val > thresholds.sangat) return { label: "SANGAT SEHAT", color: "bg-emerald-500" };
                    if (val >= thresholds.sehat) return { label: "SEHAT", color: "bg-blue-500" };
                    if (val >= thresholds.kurang) return { label: "KURANG SEHAT", color: "bg-amber-500" };
                    return { label: "TIDAK SEHAT", color: "bg-red-500" };
                  };

                  const profitability = [
                    { name: "Gross Profit Margin", val: revenue !== 0 ? ((revenue - getPLVal(data, '51', false)) / revenue) * 100 : 0 },
                    { name: "Net Profit Margin", val: revenue !== 0 ? (netProfit / revenue) * 100 : 0 },
                    { name: "Operating Profit Margin", val: revenue !== 0 ? ((revenue - getExpenseTotal(data)) / revenue) * 100 : 0 },
                    { name: "Return On Investment (ROI)", val: totalAssets !== 0 ? (netProfit / totalAssets) * 100 : 0 },
                    { name: "Return On Assets (ROA)", val: totalAssets !== 0 ? (netProfit / totalAssets) * 100 : 0 },
                    { name: "Return On Equity (ROE)", val: totalEquity !== 0 ? (netProfit / totalEquity) * 100 : 0 },
                  ];

                  const liquidity = [
                    { name: "Current Ratio", val: currentLiabilities !== 0 ? (currentAssets / currentLiabilities) * 100 : 0 },
                    { name: "Quick Ratio", val: currentLiabilities !== 0 ? ((currentAssets - inventory) / currentLiabilities) * 100 : 0 },
                    { name: "Cash Ratio", val: currentLiabilities !== 0 ? (cashAndBank / currentLiabilities) * 100 : 0 },
                  ];

                  const solvability = [
                    { name: "Debt to Total Asset Ratio", val: totalLiabilities !== 0 ? (totalAssets / totalLiabilities) * 100 : 0 },
                    { name: "Debt to Total Equity Ratio", val: totalLiabilities !== 0 ? (totalEquity / totalLiabilities) * 100 : 0 },
                  ];

                  const renderSection = (title: string, ratios: any[], thresholds: any) => (
                    <div className="mb-10">
                      <h3 className="text-sm font-bold text-slate-700 mb-4 border-l-4 border-emerald-500 pl-3 uppercase tracking-wider">{title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ratios.map(r => {
                          const status = getStatus(r.val, thresholds);
                          return (
                            <div key={r.name} className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:shadow-md transition-all">
                              <p className="text-xs text-slate-500 font-medium mb-1">{r.name}</p>
                              <div className="flex items-end justify-between">
                                <p className="text-2xl font-bold text-slate-900">{r.val.toFixed(2)}%</p>
                                <span className={cn("text-[10px] font-bold text-white px-2 py-1 rounded-full", status.color)}>{status.label}</span>
                              </div>
                              <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className={cn("h-full transition-all duration-1000", status.color)} style={{ width: `${Math.min(r.val, 100)}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );

                  return (
                    <>
                      {renderSection("PROFITABILITAS", profitability, { sangat: 12, sehat: 8, kurang: 5 })}
                      {renderSection("LIKUIDITAS", liquidity, { sangat: 150, sehat: 100, kurang: 75 })}
                      {renderSection("SOLVABILITAS", solvability, { sangat: 200, sehat: 150, kurang: 100 })}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {activeTab === "budget_2026" && (
              <motion.div
                key="budget_2026"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex-1 text-center">
                      <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">RSU MUHAMMADIYAH DARUL ISTIQOMAH KALIWUNGU</h2>
                      <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">KABUPATEN KENDAL</h2>
                      <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mt-2">Rencana Kerja Anggaran Pendapatan dan Belanja (RKAPB)</h2>
                      <p className="text-slate-900 font-medium uppercase">PERIODE JANUARI - DESEMBER 2026</p>
                      <p className="text-xs italic text-slate-500 mt-1">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
                    </div>
                    <button 
                      onClick={exportRKAPBToExcel}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm no-print"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Excel</span>
                    </button>
                  </div>

                  {loading ? (
                    <div className="py-24 flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-500 opacity-40" />
                      <p className="text-slate-900 font-medium italic">Memuat data anggaran...</p>
                    </div>
                  ) : budgetData.length === 0 ? (
                    <div className="py-24 flex flex-col items-center gap-4 opacity-20">
                      <FileText className="w-12 h-12" />
                      <p className="text-lg font-bold italic">Tidak ada data anggaran 2026.</p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => fetchBudget(2026)}
                          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Refresh Data</span>
                        </button>
                        <button 
                          onClick={handleSyncAllSheets}
                          disabled={syncingAll}
                          className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                          {syncingAll ? "Sinkronisasi..." : "Sinkronisasi RKAPB 2026 sekarang"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-lg">
                      <table id="rkapb-table" className="w-full text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-300">
                            <th className="py-3 px-2 text-left font-bold sticky top-[92px] left-0 bg-slate-100 z-30 border-r border-slate-300 min-w-[300px]">URAIAN</th>
                            {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"].map(m => (
                              <th key={m} className="py-3 px-2 text-right font-bold w-24 border-r border-slate-300 sticky top-[92px] bg-slate-100 z-20">{m}</th>
                            ))}
                            <th className="py-3 px-2 text-right font-bold w-32 bg-slate-200 sticky top-[92px] z-20">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-slate-50 font-bold"><td colSpan={14} className="py-2 px-2">PENDAPATAN</td></tr>
                          <tr className="font-bold"><td colSpan={14} className="py-2 px-4">PENDAPATAN OPERASIONAL</td></tr>
                          
                          <tr className="font-bold italic text-slate-700"><td colSpan={14} className="py-2 px-8">PENDAPATAN OPERASIONAL RAWAT INAP</td></tr>
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN AKOMODASI KAMAR</td></tr>
                          <BudgetDetailRows prefix="41101" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN VISITE DR. UMUM</td></tr>
                          <BudgetDetailRows prefix="41102" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN VISITE DR. SPESIALIS</td></tr>
                          <BudgetDetailRows prefix="41103" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN TINDAKAN RAWAT INAP</td></tr>
                          <BudgetDetailRows prefix="41104" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN BEDAH SENTRAL</td></tr>
                          <BudgetDetailRows prefix="41105" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN SEWA ALAT MEDIK</td></tr>
                          <BudgetDetailRows prefix="41106" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN TINDAKAN PARTUS</td></tr>
                          <BudgetDetailRows prefix="41107" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN PENUNJANG MEDIS</td></tr>
                          <BudgetDetailRows prefix="41108" pl={3} />
                          <BudgetRow label="Jumlah Pendapatan Rawat Inap" code="411" isSubTotal pl={2} />

                          <tr className="font-bold italic text-slate-700 mt-4"><td colSpan={14} className="py-2 px-8">PENDAPATAN RAWAT JALAN</td></tr>
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN PEMERIKSAAN/KONSULTASI</td></tr>
                          <BudgetDetailRows prefix="41201" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN TINDAKAN RAWAT JALAN</td></tr>
                          <BudgetDetailRows prefix="41202" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN PENUNJANG MEDIS</td></tr>
                          <BudgetDetailRows prefix="41203" pl={3} />
                          <BudgetRow label="Jumlah Pendapatan Rawat Jalan" code="412" isSubTotal pl={2} />

                          <tr className="font-bold italic text-slate-700 mt-4"><td colSpan={14} className="py-2 px-8">PENDAPATAN UGD</td></tr>
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN PEMERIKSAAN UGD</td></tr>
                          <BudgetDetailRows prefix="41301" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN TINDAKAN UGD</td></tr>
                          <BudgetDetailRows prefix="41302" pl={3} />
                          <BudgetRow label="Jumlah Pendapatan UGD" code="413" isSubTotal pl={2} />

                          <BudgetRow label="DISCOUNT" code="414" pl={1} />
                          
                          <tr className="font-bold italic text-slate-700 mt-4"><td colSpan={14} className="py-2 px-8">PENDAPATAN OPERASIONAL LAINNYA</td></tr>
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN ADMINISTRASI</td></tr>
                          <BudgetDetailRows prefix="421" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN AMBULANCE</td></tr>
                          <BudgetDetailRows prefix="422" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN PERAWATAN JENAZAH</td></tr>
                          <BudgetDetailRows prefix="423" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-10 text-[10px] uppercase">PENDAPATAN SELISIH KLAIM (DANA TAAWUN)</td></tr>
                          <BudgetDetailRows prefix="424" pl={3} />
                          <BudgetRow label="Jumlah Pendapatan Operasional lain" code="42" isSubTotal pl={2} />

                          <tr className="font-bold text-slate-700"><td colSpan={14} className="py-1 px-4 uppercase">PENDAPATAN LAIN-LAIN</td></tr>
                          <BudgetDetailRows prefix="431" pl={2} />
                          <BudgetRow label="TOTAL PENDAPATAN" code="4" isTotal />

                          <tr className="h-8"></tr>
                          <tr className="bg-slate-50 font-bold"><td colSpan={14} className="py-2 px-2">BEBAN USAHA</td></tr>
                          <tr className="font-bold text-slate-700"><td colSpan={14} className="py-2 px-4 uppercase">HARGA POKOK PELAYANAN PASIEN DAN BEBAN LANGSUNG</td></tr>
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-8 text-[10px] uppercase">HARGA POKOK PELAYANAN</td></tr>
                          <BudgetDetailRows prefix="511" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-8 text-[10px] uppercase">BEBAN LANGSUNG</td></tr>
                          <BudgetDetailRows prefix="512" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-8 text-[10px] uppercase">BEBAN JASA PELAYANAN</td></tr>
                          <BudgetDetailRows prefix="513" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-8 text-[10px] uppercase">PEMERIKSAAN KELUAR</td></tr>
                          <BudgetDetailRows prefix="514" pl={3} />
                          <BudgetRow label="Total HPP dan Beban Langsung" code="51" isSubTotal pl={1} />

                          <BudgetSummaryRow label="LABA KOTOR" valFunc={getBudgetGrossProfit} yearValFunc={getBudgetYearGrossProfit} />
                          
                          <tr className="font-bold text-slate-700"><td colSpan={14} className="py-2 px-4 uppercase">BEBAN OPERASIONAL</td></tr>
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-8 text-[10px] uppercase">BEBAN PERSONALIA</td></tr>
                          <BudgetDetailRows prefix="52101" pl={3} />
                          <BudgetRow label="Jumlah Beban Personalia" code="52101" isSubTotal pl={2} />
                          
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-8 text-[10px] uppercase">BEBAN ADMINISTRASI</td></tr>
                          <BudgetDetailRows prefix="52102" pl={3} />
                          <BudgetRow label="Jumlah Beban Administrasi" code="52102" isSubTotal pl={2} />
                          
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-8 text-[10px] uppercase">BEBAN UMUM</td></tr>
                          <BudgetDetailRows prefix="52103" pl={3} />
                          <BudgetRow label="Jumlah Beban Umum" code="52103" isSubTotal pl={2} />
                          
                          <BudgetSummaryRow label="Total Beban Operasional" valFunc={getBudgetTotalBebanOperasional} yearValFunc={getBudgetYearTotalBebanOperasional} isTotal={false} />

                          <BudgetSummaryRow label="LABA OPERASIONAL" valFunc={getBudgetOperationalProfit} yearValFunc={getBudgetYearOperationalProfit} />

                          <tr className="font-bold text-slate-700"><td colSpan={14} className="py-1 px-4 uppercase">BEBAN LAIN-LAIN</td></tr>
                          <BudgetDetailRows prefix="531" pl={2} />
                          
                          <tr className="font-bold text-slate-700"><td colSpan={14} className="py-2 px-4 uppercase">BEBAN PENYUSUTAN DAN MARGIN PINJAMAN</td></tr>
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-8 text-[10px] uppercase">BEBAN PENYUSUTAN</td></tr>
                          <BudgetDetailRows prefix="541" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-8 text-[10px] uppercase">BEBAN AMORTISASI</td></tr>
                          <BudgetDetailRows prefix="542" pl={3} />
                          <tr className="font-bold text-slate-600"><td colSpan={14} className="py-1 px-8 text-[10px] uppercase">Margin Pinjaman Kredit Investasi</td></tr>
                          <BudgetDetailRows prefix="543" pl={3} />
                          <BudgetRow label="Total beban penyusutan dan Amortisasi" code="54" isSubTotal pl={1} />

                          <BudgetSummaryRow label="LABA BERSIH SEBELUM PAJAK" valFunc={getBudgetNetProfitBeforeTax} yearValFunc={getBudgetYearNetProfitBeforeTax} />
                          <BudgetRow label="PAJAK PENGHASILAN" code="611" pl={1} />
                          <BudgetSummaryRow label="LABA BERSIH SETELAH PAJAK" valFunc={getBudgetNetProfitAfterTax} yearValFunc={getBudgetYearNetProfitAfterTax} />
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-20 text-center text-[10px] italic text-slate-500">
                    Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                  </div>

                  {/* Footer Signatures */}
                  <div className="mt-20 grid grid-cols-2 gap-20 text-center text-xs font-bold">
                    <div />
                    <div>
                      <p className="mb-1">Kendal, 31 Desember 2026</p>
                      <p className="mb-20 uppercase">Direktur</p>
                      <p className="underline">dr M. Arif Rida, M.M.R</p>
                      <p className="font-normal">NBM. 1108 7910 1075945</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isSettingsOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                >
                  <div className="bg-[#064E3B] p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-lg font-bold">Pengaturan API</h3>
                    </div>
                    <button onClick={() => setIsSettingsOpen(false)} className="text-white/60 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Google Apps Script API URL</label>
                      <input 
                        type="text" 
                        value={apiUrl}
                        onChange={(e) => {
                          setApiUrl(e.target.value);
                          localStorage.setItem("apiUrl", e.target.value);
                        }}
                        placeholder="https://script.google.com/macros/s/.../exec"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                      <p className="mt-2 text-[10px] text-slate-400 leading-relaxed">
                        Masukkan URL Web App dari Google Apps Script yang telah Anda deploy.
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={() => setIsSettingsOpen(false)}
                        className="px-6 py-2.5 bg-[#064E3B] text-white rounded-xl text-sm font-bold hover:bg-[#053F30] transition-all shadow-lg shadow-emerald-900/20"
                      >
                        Simpan & Tutup
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
