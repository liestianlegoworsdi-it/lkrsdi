import React, { useState, useEffect } from "react";
import { 
  Upload, FileText, Table as TableIcon, Calendar, CheckCircle, 
  AlertCircle, Loader2, Link as LinkIcon, RefreshCw, Info,
  Menu, ChevronLeft, ChevronRight, ChevronDown, Gem, LogOut, Settings,
  LayoutDashboard, TrendingUp, TrendingDown, ArrowUpRight,
  ArrowDownRight, DollarSign, PieChart, Activity, Download, BarChart3,
  Zap, Globe, X, BookOpen, Wallet, ShieldCheck, AlertTriangle, ArrowRight, Printer,
  ArrowUpDown, ArrowUp, ArrowDown
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

const LOGO_URL = "https://lh3.googleusercontent.com/d/13bPOT6XafYOtxK6acPiDY6wKKUhkGvul";
const LOGIN_IMAGE_URL = "https://lh3.googleusercontent.com/d/1yH9CHAXWe3AByrUGnqAVXNzhQuDaRbno";

const Login = ({ onLogin }: { onLogin: (username: string) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === "dir1" && password === "2026") || (username === "keu1" && password === "1928")) {
      onLogin(username);
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#064e3b] relative overflow-hidden p-4 font-display">
      {/* Lighting Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/50 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-emerald-500/5 blur-[150px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[22rem] p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative z-10"
      >
        <div className="flex flex-col items-center mb-4">
          <div className="w-44 h-44 mb-[-2.5rem] relative">
            <div className="absolute inset-0 bg-emerald-400/10 blur-3xl rounded-full animate-pulse" />
            <img src={LOGIN_IMAGE_URL} alt="Login Illustration" className="w-full h-full object-contain relative z-10" referrerPolicy="no-referrer" />
          </div>
          <h2 className="text-white text-lg font-bold tracking-[0.3em] uppercase text-center">LK RSDI</h2>
          <div className="h-0.5 w-12 bg-emerald-500/30 mt-2 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute left-0 bottom-3 text-emerald-400/50 group-focus-within:text-emerald-400 transition-colors">
              <Globe className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-transparent border-b border-white/10 py-3 pl-7 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-400 transition-all text-sm"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute left-0 bottom-3 text-emerald-400/50 group-focus-within:text-emerald-400 transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border-b border-white/10 py-3 pl-7 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-400 transition-all text-sm"
              required
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-[10px] text-center font-medium bg-red-400/10 py-2 rounded-lg border border-red-400/20"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            className="w-full py-3.5 bg-emerald-500 text-[#064e3b] rounded-2xl font-bold tracking-widest transition-all duration-300 uppercase text-[10px] shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]"
          >
            Masuk Sistem
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-[9px] text-white/20 font-mono tracking-[0.2em] uppercase">LK V1.27 - IT.RSDI</span>
        </div>
      </motion.div>
    </div>
  );
};

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
    <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 calk-expandable-section">
      <button 
        onClick={() => onToggle(id)}
        className={cn(
          "w-full flex items-center justify-between p-6 transition-colors",
          isExpanded ? "bg-emerald-50/50" : "bg-white hover:bg-slate-50"
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-all print:hidden",
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
      
      <div className={cn("border-t border-slate-100 print:block", isExpanded ? "block" : "hidden")}>
        <div className="p-6 bg-white space-y-6 print:p-2">
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
      </div>
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
  period: string;
}

interface BudgetItem {
  id: number;
  year: number;
  month: number;
  account_code: string;
  account_name: string;
  amount: number;
}

const LoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#064e3b] text-white p-4 font-display">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <div className="w-48 h-48 mx-auto mb-8">
           <img src={LOGIN_IMAGE_URL} alt="Loading" className="w-full h-full object-contain animate-pulse" referrerPolicy="no-referrer" />
        </div>
        <h2 className="text-2xl font-bold mb-2 tracking-widest uppercase">Mohon Tunggu Sejenak</h2>
        <p className="text-emerald-200/60 text-sm mb-8">Sedang menyiapkan data laporan keuangan...</p>
        
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
          <motion.div 
            className="bg-emerald-400 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-4xl font-black text-emerald-400 tabular-nums">
          {Math.round(progress)}%
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Auto Logout after 5 minutes of inactivity
  useEffect(() => {
    if (!user) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
      }, 5 * 60 * 1000); // 5 minutes
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);

  const [activeTab, setActiveTab] = useState<"dashboard" | "report" | "profit_loss" | "neraca" | "arus_kas" | "p_ekuitas" | "profit_loss_summary" | "budget_2026" | "rkapb_comparison" | "budget_absorption" | "rkapb_ratios" | "calk" | "cashflow_dev" | "ebitda_eat" | "earning_akumulatif" | "penjelasan_lk" | "profit_loss_monthly">("dashboard");
  const [monthlyPLData, setMonthlyPLData] = useState<Record<string, TrialBalanceItem[]>>({});
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [comparisonPeriod, setComparisonPeriod] = useState<string>("");
  const [data, setData] = useState<TrialBalanceItem[]>([]);
  const [ytdData, setYtdData] = useState<TrialBalanceItem[]>([]);
  const [absorptionData, setAbsorptionData] = useState<TrialBalanceItem[]>([]);
  const [comparisonData, setComparisonData] = useState<TrialBalanceItem[]>([]);
  const [prevPeriodData, setPrevPeriodData] = useState<TrialBalanceItem[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [absorptionSort, setAbsorptionSort] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'account_code', direction: 'asc' });
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
    'hpp': true,
    'beban': true,
    '411': false,
    '412': false,
    '413': false,
    '414': false,
    '415': false,
    '42': false,
    '511': false,
    '512': false,
    '513': false,
    '514': false,
    '52101': false,
    '52102': false,
    '52103': false,
    '531': false,
    '541': false
  });
  const renderPLDetailRow = (item: TrialBalanceItem, isComparison: boolean = false) => {
    const val = item.final_credit - item.final_debit;
    const compVal = isComparison ? (comparisonData.find(c => c.account_code === item.account_code)?.final_credit - comparisonData.find(c => c.account_code === item.account_code)?.final_debit || 0) : 0;
    const diff = val - compVal;
    const pct = compVal !== 0 ? (diff / Math.abs(compVal)) * 100 : 0;

    return (
      <div key={item.account_code} className={cn("grid items-center text-[11px] hover:bg-slate-50 transition-colors px-2 py-0.5 rounded", isComparison ? "grid-cols-[1fr_100px_100px_100px_60px]" : "grid-cols-[1fr_120px]")}>
        <span className="text-slate-600 truncate pr-2" title={`${item.account_code} - ${item.account_name}`}>{item.account_name}</span>
        <span className="text-right font-mono text-slate-900">{val !== 0 ? formatCurrency(val).replace("Rp", "").trim() : "-"}</span>
        {isComparison && (
          <>
            <span className="text-right font-mono text-slate-500">{compVal !== 0 ? formatCurrency(compVal).replace("Rp", "").trim() : "-"}</span>
            <span className={cn("text-right font-mono", diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-slate-400")}>
              {diff !== 0 ? formatCurrency(diff).replace("Rp", "").trim() : "-"}
            </span>
            <span className={cn("text-right font-mono text-[9px]", diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-slate-400")}>
              {compVal !== 0 ? `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%` : "-"}
            </span>
          </>
        )}
      </div>
    );
  };

  const renderAbsorptionTable = (accounts: TrialBalanceItem[]) => {
    const handleSort = (key: string) => {
      setAbsorptionSort(prev => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    };

    const sortedAccounts = [...accounts].map(acc => {
      const isRevenue = acc.account_code.startsWith('4');
      const realYtd = isRevenue ? (acc.final_credit - acc.final_debit) : (acc.final_debit - acc.final_credit);
      const budgetFullYear = Array.from({length: 12}, (_, i) => getBudgetVal(acc.account_code, i + 1)).reduce((a, b) => a + b, 0);
      const sisa = budgetFullYear - realYtd;
      const pct = budgetFullYear !== 0 ? (realYtd / budgetFullYear) * 100 : 0;
      return { ...acc, realYtd, budgetFullYear, sisa, pct };
    }).filter(acc => acc.realYtd !== 0 || acc.budgetFullYear !== 0)
    .sort((a, b) => {
      const { key, direction } = absorptionSort;
      let valA: any = a[key as keyof typeof a];
      let valB: any = b[key as keyof typeof b];
      
      if (typeof valA === 'string') {
        return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return direction === 'asc' ? valA - valB : valB - valA;
    });

    const SortIcon = ({ column }: { column: string }) => {
      if (absorptionSort.key !== column) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
      return absorptionSort.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-400" /> : <ArrowDown className="w-3 h-3 text-emerald-400" />;
    };

    return (
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="bg-slate-800 text-white border-b border-slate-900">
            <th onClick={() => handleSort('account_code')} className="py-3 px-4 text-left font-bold border-r border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-2">NO. REKENING <SortIcon column="account_code" /></div>
            </th>
            <th onClick={() => handleSort('account_name')} className="py-3 px-4 text-left font-bold border-r border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-2">NAMA AKUN <SortIcon column="account_name" /></div>
            </th>
            <th onClick={() => handleSort('realYtd')} className="py-3 px-4 text-right font-bold border-r border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-end gap-2">REALISASI SETAHUN <SortIcon column="realYtd" /></div>
            </th>
            <th onClick={() => handleSort('budgetFullYear')} className="py-3 px-4 text-right font-bold border-r border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-end gap-2">ANGGARAN SETAHUN <SortIcon column="budgetFullYear" /></div>
            </th>
            <th onClick={() => handleSort('sisa')} className="py-3 px-4 text-right font-bold border-r border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-end gap-2">SISA ANGGARAN <SortIcon column="sisa" /></div>
            </th>
            <th onClick={() => handleSort('pct')} className="py-3 px-4 text-right font-bold cursor-pointer hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-end gap-2">% SERAPAN <SortIcon column="pct" /></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedAccounts.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-slate-400 italic">Tidak ada data.</td>
            </tr>
          ) : (
            sortedAccounts.map(acc => {
              const isRevenue = acc.account_code.startsWith('4');
              // Revenue: low = red, high = green
              // Expense: low = green, high = red
              let barColor = "bg-emerald-500";
              if (isRevenue) {
                barColor = acc.pct < 50 ? "bg-red-500" : acc.pct < 80 ? "bg-orange-500" : "bg-emerald-500";
              } else {
                barColor = acc.pct > 100 ? "bg-red-500" : acc.pct > 80 ? "bg-orange-500" : "bg-emerald-500";
              }

              return (
                <tr key={acc.account_code} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-4 font-mono text-slate-500 border-r border-slate-100">{acc.account_code}</td>
                  <td className="py-2 px-4 font-medium text-slate-700 border-r border-slate-100">{acc.account_name}</td>
                  <td className="py-2 px-4 text-right font-mono bg-blue-50/10 border-r border-slate-100">{formatCurrency(acc.realYtd).replace("Rp", "").trim()}</td>
                  <td className="py-2 px-4 text-right font-mono bg-emerald-50/10 border-r border-slate-100">{formatCurrency(acc.budgetFullYear).replace("Rp", "").trim()}</td>
                  <td className={cn("py-2 px-4 text-right font-mono border-r border-slate-100", 
                    isRevenue 
                      ? (acc.sisa < 0 ? "text-emerald-600" : "text-red-600") 
                      : (acc.sisa < 0 ? "text-red-600" : "text-emerald-600")
                  )}>
                    {formatCurrency(acc.sisa).replace("Rp", "").trim()}
                  </td>
                  <td className="py-2 px-4 text-right font-mono">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={cn("h-full", barColor)}
                          style={{ width: `${Math.min(acc.pct, 100)}%` }}
                        />
                      </div>
                      <span className={cn("font-bold", isRevenue ? (acc.pct < 50 ? "text-red-600" : "text-slate-700") : (acc.pct > 100 ? "text-red-600" : "text-slate-700"))}>
                        {acc.pct.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    );
  };

  const getMonthlyDataset = (month: number) => {
    const [year] = period.split("-");
    const p = `${year}-${month.toString().padStart(2, '0')}`;
    return monthlyPLData[p] || [];
  };

  const MonthlyPLSummaryRow = ({ label, valFunc, isTotal = true }: { label: string, valFunc: (dataset: TrialBalanceItem[]) => number, isTotal?: boolean }) => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const values = months.map(m => valFunc(getMonthlyDataset(m)));
    const total = values.reduce((a, b) => a + b, 0);

    return (
      <tr className={cn(
        isTotal && "bg-emerald-50 font-bold border-y-2 border-slate-900",
      )}>
        <td className={cn("py-2 px-2 sticky left-0 bg-white z-10 border-r border-slate-100 min-w-[250px]", isTotal && "bg-emerald-50")}>
          {label}
        </td>
        {values.map((val, i) => (
          <td key={i} className="py-2 px-2 text-right font-mono border-r border-slate-100">
            {val !== 0 ? formatCurrency(val).replace("Rp", "").trim() : "-"}
          </td>
        ))}
        <td className="py-2 px-2 text-right font-mono font-bold bg-slate-50">
          {total !== 0 ? formatCurrency(total).replace("Rp", "").trim() : "-"}
        </td>
      </tr>
    );
  };

  const getMonthlyPLVal = (prefix: string, month: number, isRevenue: boolean = true) => {
    const [year] = period.split("-");
    const p = `${year}-${month.toString().padStart(2, '0')}`;
    const monthData = monthlyPLData[p] || [];
    return monthData
      .filter(i => i.account_code.startsWith(prefix) && !isParentAccount(monthData, i.account_code))
      .reduce((acc, i) => acc + (isRevenue ? (i.final_credit - i.final_debit) : (i.final_debit - i.final_credit)), 0);
  };

  const MonthlyPLRow = ({ label, prefix, isRevenue = true, isTotal = false, isSubTotal = false, pl = 0 }: { label: string, prefix?: string, isRevenue?: boolean, isTotal?: boolean, isSubTotal?: boolean, pl?: number }) => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const values = prefix ? months.map(m => getMonthlyPLVal(prefix, m, isRevenue)) : months.map(() => 0);
    const total = values.reduce((a, b) => a + b, 0);

    return (
      <tr className={cn(
        isTotal && "bg-emerald-50 font-bold border-y-2 border-slate-900",
        isSubTotal && "font-bold italic bg-slate-50/50"
      )}>
        <td className={cn("py-2 px-2 sticky left-0 bg-white z-10 border-r border-slate-100 min-w-[250px]", pl === 1 && "pl-4", pl === 2 && "pl-8", pl === 3 && "pl-12", isTotal && "bg-emerald-50")}>
          {label}
        </td>
        {values.map((val, i) => (
          <td key={i} className="py-2 px-2 text-right font-mono border-r border-slate-100">
            {val !== 0 ? formatCurrency(val).replace("Rp", "").trim() : "-"}
          </td>
        ))}
        <td className="py-2 px-2 text-right font-mono font-bold bg-slate-50">
          {total !== 0 ? formatCurrency(total).replace("Rp", "").trim() : "-"}
        </td>
      </tr>
    );
  };

  const renderPLDetailGroupTotal = (label: string, prefix: string, isRevenue: boolean = true, isComparison: boolean = false) => {
    const val = getPLVal(data, prefix, isRevenue);
    const compVal = isComparison ? getPLVal(comparisonData, prefix, isRevenue) : 0;
    const diff = val - compVal;
    const pct = compVal !== 0 ? (diff / Math.abs(compVal)) * 100 : 0;

    return (
      <div className={cn("grid items-center pt-1 border-t border-slate-300 font-bold text-[11px] bg-slate-50/50 px-2 mt-1", isComparison ? "grid-cols-[1fr_100px_100px_100px_60px]" : "grid-cols-[1fr_120px]")}>
        <span className="italic">{label}</span>
        <span className="text-right font-mono text-slate-900">{formatCurrency(val).replace("Rp", "").trim()}</span>
        {isComparison && (
          <>
            <span className="text-right font-mono text-slate-500">{formatCurrency(compVal).replace("Rp", "").trim()}</span>
            <span className={cn("text-right font-mono", diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-slate-400")}>
              {formatCurrency(diff).replace("Rp", "").trim()}
            </span>
            <span className={cn("text-right font-mono text-[9px]", diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-slate-400")}>
              {compVal !== 0 ? `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%` : "-"}
            </span>
          </>
        )}
      </div>
    );
  };

  const [expandedCalk, setExpandedCalk] = useState<Record<string, boolean>>({});

  const toggleCalk = (id: string) => {
    setExpandedCalk(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  // Simple Sheets State
  const [apiUrl, setApiUrl] = useState(localStorage.getItem("apiUrl") || ((import.meta as any).env.VITE_GAS_API_URL as string) || "https://script.google.com/macros/s/AKfycbzFaQeASp3y3mFM2QGfM6OA3_2YcP3-TcY4QjtxxViaj7j-Wxm7nLYeC0MfhagInHMR/exec");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [balanceDiscrepancies, setBalanceDiscrepancies] = useState<any[]>([]);
  const [isBalanceCheckOpen, setIsBalanceCheckOpen] = useState(false);
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "28101928") {
      setIsPinModalOpen(false);
      setIsSettingsOpen(true);
      setPinInput("");
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const fetchBalanceCheck = async (targetPeriod?: string, showModal: boolean = true) => {
    setCheckingBalance(true);
    try {
      const p = targetPeriod || period;
      const res = await fetch(`/api/balance-check?period=${p}`);
      const result = await res.json();
      if (result.success) {
        const discrepancies = [...result.discrepancies];
        
        // Add Asset vs Liability + Equity Check
        const totalAssets = getVal(data, "1");
        const totalLiabilities = getVal(data, "2", false);
        const totalEquity = getVal(data, "31", false) + getVal(data, "331000000", false) + getFinalNetProfit(ytdData);
        const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
        
        const diff = Math.abs(totalAssets - totalLiabilitiesAndEquity);
        if (diff > 1) { // Allow for small rounding differences if any
          discrepancies.push({
            type: "Balance Sheet Check",
            period: p,
            val1: totalAssets,
            val2: totalLiabilitiesAndEquity,
            gap: totalAssets - totalLiabilitiesAndEquity,
            note: "Jumlah Aset tidak sama dengan Jumlah Kewajiban dan Ekuitas"
          });
        }

        setBalanceDiscrepancies(discrepancies);
        if (showModal) setIsBalanceCheckOpen(true);
      }
    } catch (err) {
      console.error("Failed to fetch balance check", err);
    } finally {
      setCheckingBalance(false);
    }
  };

  const handlePrint = (elementId: string) => {
    const printContent = document.getElementById(elementId);
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan popup untuk mencetak laporan');
      return;
    }
    
    // Get all styles from the current document
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML)
      .join('');
      
    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Laporan - RSDI Kendal</title>
          ${styles}
          <style>
            @media print {
              @page { size: A4 portrait; margin: 5mm; }
              body { background: white !important; font-size: 10pt !important; line-height: 0.65 !important; color: black !important; font-family: 'Poppins', sans-serif !important; }
              .no-print { display: none !important; }
              .print-report { 
                width: 100% !important; 
                max-width: none !important; 
                margin: 0 !important; 
                padding: 0 !important; 
                box-shadow: none !important; 
                border: none !important; 
                font-family: 'Poppins', sans-serif !important;
                line-height: 0.65 !important;
              }
              
              .report-footer-note { font-size: 6pt !important; line-height: 0.65 !important; }
              .report-note-col { font-size: 6pt !important; line-height: 0.65 !important; }
              .disajikan-label { font-size: 6pt !important; line-height: 0.65 !important; }
              
              /* Ultra Compact Spacing */
              .mb-12 { margin-bottom: 0.2rem !important; }
              .mb-8 { margin-bottom: 0.15rem !important; }
              .mb-6 { margin-bottom: 0.1rem !important; }
              .mb-4 { margin-bottom: 0.08rem !important; }
              .mt-12 { margin-top: 0.2rem !important; }
              .mt-8 { margin-top: 0.15rem !important; }
              .mt-20 { margin-top: 0.4rem !important; }
              .mb-20 { margin-bottom: 0.4rem !important; }
              .mb-24 { margin-bottom: 0.5rem !important; }
              
              /* Signature Box */
              .signature-box { margin-top: 1px !important; }
              .signature-space { margin-bottom: 0.8rem !important; }
              
              /* Neraca Specific Print Adjustments */
              .neraca-print-note { margin-top: 1.5rem !important; }
              .neraca-print-signature { margin-top: 1rem !important; }
              .neraca-signature-space { margin-bottom: 2.5rem !important; }
              
              /* Equity Report Line Height Override */
              #ekuitas-report, #ekuitas-report * { line-height: 1.2 !important; }
              
              /* Space-y overrides */
              .space-y-12 > * + * { margin-top: 0.2rem !important; }
              .space-y-8 > * + * { margin-top: 0.15rem !important; }
              .space-y-6 > * + * { margin-top: 0.1rem !important; }
              .space-y-4 > * + * { margin-top: 0.08rem !important; }
              .space-y-2 > * + * { margin-top: 0.04rem !important; }
              .space-y-1 > * + * { margin-top: 0.02rem !important; }
              
              /* Padding overrides */
              .p-12 { padding: 0 !important; }
              .p-8 { padding: 0.15rem !important; }
              .p-6 { padding: 0.1rem !important; }
              .py-12 { padding-top: 0.4rem !important; padding-bottom: 0.4rem !important; }
              .py-8 { padding-top: 0.3rem !important; padding-bottom: 0.3rem !important; }
              .py-6 { padding-top: 0.2rem !important; padding-bottom: 0.2rem !important; }
              .py-4 { padding-top: 0.1rem !important; padding-bottom: 0.1rem !important; }
              .py-3 { padding-top: 0.05rem !important; padding-bottom: 0.05rem !important; }
              .py-2 { padding-top: 0.02rem !important; padding-bottom: 0.02rem !important; }
              .py-1 { padding-top: 0 !important; padding-bottom: 0 !important; }
              
              /* CALK Specific Print Adjustments */
              .calk-expandable-section { page-break-inside: avoid !important; margin-bottom: 0.5rem !important; }
              .calk-expandable-section button { 
                background: #f8fafc !important; 
                padding: 0.4rem 0.8rem !important;
                border-bottom: 1px solid #e2e8f0 !important;
              }
              .calk-expandable-section h3 { font-size: 9pt !important; color: #0f172a !important; }
              .calk-expandable-section .text-right { line-height: 1 !important; }
              .calk-expandable-section .text-sm { font-size: 8pt !important; }
              .calk-expandable-section .text-\[10px\] { font-size: 6pt !important; }
              
              /* Force display of CALK details */
              .print-report .hidden.print\:block { display: block !important; }
              .print-report .p-6.bg-white.space-y-6.print\:p-2 { padding: 0.4rem !important; }
              .print-report .bg-slate-50\/30.print\:bg-white { background: white !important; padding: 0.4rem !important; }
              .pt-4 { padding-top: 0.2rem !important; }
              .pt-2 { padding-top: 0.1rem !important; }
              
              /* Table & Grid Adjustments */
              table td, table th { padding-top: 0.5px !important; padding-bottom: 0.5px !important; }
              .grid { gap: 0.05rem !important; }
              
              /* Neraca Specific Tightening */
              #neraca-report .space-y-4 > * + * { margin-top: 0.1rem !important; }
              #neraca-report .space-y-6 > * + * { margin-top: 0.15rem !important; }
              #neraca-report .pl-4 { padding-left: 0.75rem !important; }
              #neraca-report .mb-2 { margin-bottom: 0.1rem !important; }
              #neraca-report .mb-1 { margin-bottom: 0.05rem !important; }
              #neraca-report .mt-1 { margin-top: 0.05rem !important; }
              #neraca-report .pb-2 { padding-bottom: 0.1rem !important; }
              #neraca-report .mb-6 { margin-bottom: 0.2rem !important; }
              #neraca-report .mt-8 { margin-top: 0.3rem !important; }
              #neraca-report .mb-12 { margin-bottom: 0.3rem !important; }
              
              /* Font Size Adjustments for specific elements */
              h2 { font-size: 12pt !important; }
              h3 { font-size: 11pt !important; }
              h4 { font-size: 10pt !important; }
              .text-xl { font-size: 12pt !important; }
              .text-lg { font-size: 11pt !important; }
              .text-base { font-size: 10pt !important; }
              .text-sm { font-size: 9pt !important; }
              .text-xs { font-size: 8pt !important; }
              .font-mono { font-size: 10pt !important; font-family: 'Poppins', sans-serif !important; }
              
              /* Ensure all elements inside print-report use Poppins */
              .print-report * { font-family: 'Poppins', sans-serif !important; }
              
              /* Section breaks */
              section { page-break-inside: avoid; }
              .break-after-page { page-break-after: always; }
            }
            body { font-family: sans-serif; padding: 20px; }
            .print-report { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; border: none !important; }
          </style>
        </head>
        <body>
          <div class="print-report">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.onafterprint = () => window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    if (period) {
      fetchBalanceCheck(period, false);
    }
  }, [period]);

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
      setPeriods(data.sort((a: string, b: string) => b.localeCompare(a)));
    } catch (err: any) {
      console.error("Failed to fetch periods", err);
    }
  };

  const fetchMonthlyData = async (year: string) => {
    setLoadingMonthly(true);
    try {
      const res = await fetch(`/api/neraca-saldo-year?year=${year}`);
      if (!res.ok) throw new Error("Failed to fetch monthly data");
      const result = await res.json();
      
      const grouped: Record<string, TrialBalanceItem[]> = {};
      result.forEach((item: TrialBalanceItem) => {
        if (!grouped[item.period]) grouped[item.period] = [];
        grouped[item.period].push(item);
      });
      setMonthlyPLData(grouped);
    } catch (err) {
      console.error("Failed to fetch monthly data", err);
    } finally {
      setLoadingMonthly(false);
    }
  };

  const fetchData = async (selectedPeriod: string, type: 'current' | 'comparison' | 'prev' | 'ytd' | 'absorption' = 'current') => {
    if (type === 'current') setLoading(true);
    try {
      const endpoint = (type === 'ytd' || type === 'absorption') ? `/api/neraca-saldo-ytd?period=${selectedPeriod}` : `/api/neraca-saldo?period=${selectedPeriod}`;
      const res = await fetch(endpoint);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status}. ${text.slice(0, 100)}`);
      }
      const result = await res.json();
      if (type === 'comparison') {
        setComparisonData(result);
      } else if (type === 'prev') {
        setPrevPeriodData(result);
      } else if (type === 'ytd') {
        setYtdData(result);
      } else if (type === 'absorption') {
        setAbsorptionData(result);
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
    if (periods.length > 0) {
      const latestPeriod = periods[0]; // Assuming periods are sorted descending
      fetchData(latestPeriod, 'absorption');
    }
  }, [periods]);

  useEffect(() => {
    if (comparisonPeriod) {
      fetchData(comparisonPeriod, 'comparison');
    }
  }, [comparisonPeriod]);

  useEffect(() => {
    if (activeTab === "profit_loss_monthly" || activeTab === "earning_akumulatif") {
      const [year] = period.split("-");
      fetchMonthlyData(year);
      if (activeTab === "earning_akumulatif") fetchBudget(parseInt(year));
    }
    
    if (activeTab === "budget_2026" || activeTab === "rkapb_comparison" || activeTab === "arus_kas" || activeTab === "neraca" || activeTab === "p_ekuitas") {
      if (activeTab !== "arus_kas") fetchBudget(2026);
      fetchData(period);
      fetchData(period, 'ytd');
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

  const handleSyncAllSheets = async (isInitial = false) => {
    if (!isInitial) setSyncingAll(true);
    setSyncProgress(0);
    setSyncStatus("Menghubungkan ke Spreadsheet...");
    setMessage(null);
    try {
      // 1. Get list of sheets
      const listRes = await fetch(`/api/sync-list?url=${encodeURIComponent(apiUrl)}`);
      if (!listRes.ok) throw new Error("Gagal mengambil daftar sheet dari Spreadsheet.");
      const listData = await listRes.json();
      
      if (!listData.available_sheets || !Array.isArray(listData.available_sheets)) {
        throw new Error("Spreadsheet tidak memiliki sheet yang valid.");
      }

      const sheets = listData.available_sheets;
      const results = [];
      let totalCount = 0;

      // 2. Sync each sheet one by one
      for (let i = 0; i < sheets.length; i++) {
        const sheetName = sheets[i];
        setSyncStatus(`Sinkronisasi sheet: ${sheetName} (${i + 1}/${sheets.length})`);
        setSyncProgress(Math.round(((i) / sheets.length) * 100));

        try {
          // Add a small delay between requests to avoid rate limits
          if (i > 0) await new Promise(resolve => setTimeout(resolve, 500));

          const res = await fetch("/api/fetch-api-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: apiUrl, period: "", syncAll: false, customSheet: sheetName }),
          });
          
          if (res.ok) {
            const data = await res.json();
            results.push({ sheet: sheetName, count: data.count || 0 });
            totalCount += (data.count || 0);
          } else {
            console.error(`Gagal sinkronisasi sheet ${sheetName}`);
          }
        } catch (e) {
          console.error(`Error syncing sheet ${sheetName}:`, e);
        }
      }

      setSyncProgress(100);
      setSyncStatus("Sinkronisasi Selesai!");

      if (!isInitial) {
        setMessage({ 
          type: "success", 
          text: `Berhasil memperbarui ${totalCount} baris data dari ${results.length} sheet.` 
        });
      }
      
      await Promise.all([
        fetchData(period),
        fetchPeriods(),
        fetchBudget(2026)
      ]);
      return true;
    } catch (error: any) {
      if (!isInitial) setMessage({ type: "error", text: error.message });
      throw error;
    } finally {
      if (!isInitial) {
        setTimeout(() => setSyncingAll(false), 1000);
      }
    }
  };

  const handleInitialSync = async () => {
    setIsInitialLoading(true);
    setLoadingProgress(0);
    
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev + (98 - prev) * 0.05;
        return prev + (90 - prev) * 0.1;
      });
    }, 300);

    try {
      await handleSyncAllSheets(true);
      setLoadingProgress(100);
      setTimeout(() => {
        setIsInitialLoading(false);
      }, 800);
    } catch (error) {
      console.error("Initial sync failed", error);
      setIsInitialLoading(false);
    } finally {
      clearInterval(progressInterval);
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

  const getInitialYearVal = (prefix: string, isDebit = true) => {
    const cleanPrefix = prefix.replace(/[.\s-]/g, '');
    return ytdData.filter(i => i.account_code.startsWith(cleanPrefix))
      .reduce((acc, curr) => {
        const val = isDebit ? ((curr.initial_debit || 0) - (curr.initial_credit || 0)) : ((curr.initial_credit || 0) - (curr.initial_debit || 0));
        return acc + val;
      }, 0);
  };

  const getFinalNetProfit = (dataset: TrialBalanceItem[]) => {
    return getNetProfitBeforeTax(dataset) - getTaxEstimation(dataset);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (isInitialLoading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  if (!user) {
    return <Login onLogin={(username) => {
      setUser(username);
      localStorage.setItem("user", username);
      handleInitialSync();
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {syncingAll && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * syncProgress) / 100}
                  className="text-emerald-500 transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-slate-900">
                {syncProgress}%
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Sinkronisasi Data</h3>
            <p className="text-slate-500 text-sm animate-pulse">{syncStatus}</p>
          </div>
        </div>
      )}
      {/* Top Navigation Bar - Excel Style */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm no-print">
        {/* Top Branding Bar */}
        <div className="bg-[#064E3B] text-white px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg group overflow-hidden">
              <img src={LOGO_URL} alt="Logo RSDI" className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
            </div>
            <h1 className="text-lg font-display font-bold tracking-tight">
              RSDI <span className="text-emerald-400">Kendal</span> <span className="text-white/40 font-normal text-sm ml-2">| Laporan Keuangan 2026</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100/80">{user === 'dir1' ? 'Direktur' : 'Keuangan'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-100/60">
              Periode: {period}
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            
            <button 
              onClick={() => handleSyncAllSheets()}
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
              onClick={() => setIsPinModalOpen(true)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button 
              onClick={handleLogout}
              className="text-white/60 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
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
                  ["neraca", "report", "profit_loss_summary", "profit_loss", "profit_loss_monthly", "arus_kas", "p_ekuitas", "calk"].includes(activeTab) ? "text-[#064E3B] bg-emerald-50/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <FileText className={cn("w-4 h-4", ["neraca", "report", "profit_loss_summary", "profit_loss", "profit_loss_monthly", "arus_kas", "p_ekuitas", "calk"].includes(activeTab) ? "text-emerald-600" : "text-slate-400")} />
                LK
                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                {["neraca", "report", "profit_loss_summary", "profit_loss", "profit_loss_monthly", "arus_kas", "p_ekuitas", "calk"].includes(activeTab) && (
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
                  <button
                    onClick={() => { setActiveTab("profit_loss_monthly"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    LR bulanan
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
                  <button
                    onClick={() => { setActiveTab("penjelasan_lk"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Penjelasan LK
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
                  (activeTab === "budget_2026" || activeTab === "rkapb_comparison" || activeTab === "budget_absorption" || activeTab === "rkapb_ratios" || activeTab === "ebitda_eat") ? "text-[#064E3B] bg-emerald-50/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <BarChart3 className={cn("w-4 h-4", (activeTab === "budget_2026" || activeTab === "rkapb_comparison" || activeTab === "budget_absorption" || activeTab === "rkapb_ratios" || activeTab === "ebitda_eat") ? "text-emerald-600" : "text-slate-400")} />
                Analisa
                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                {(activeTab === "budget_2026" || activeTab === "rkapb_comparison" || activeTab === "budget_absorption" || activeTab === "rkapb_ratios" || activeTab === "ebitda_eat" || activeTab === "earning_akumulatif") && (
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
                    onClick={() => { setActiveTab("budget_absorption"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    Serapan Anggaran
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
                  <button
                    onClick={() => { setActiveTab("earning_akumulatif"); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Earning Akumulatif
                  </button>
                </div>
              )}
            </div>

            {/* Cashflow Menu */}
            <button
              onClick={() => { setActiveTab("cashflow_dev"); setOpenMenu(null); }}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative",
                activeTab === "cashflow_dev" ? "text-[#064E3B] bg-emerald-50/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Wallet className={cn("w-4 h-4", activeTab === "cashflow_dev" ? "text-emerald-600" : "text-slate-400")} />
              Cashflow
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
            {["neraca", "report", "profit_loss", "profit_loss_summary", "arus_kas", "p_ekuitas", "calk", "rkapb_comparison", "ebitda_eat"].includes(activeTab) && (
              <button
                onClick={() => {
                  const reportIdMap: Record<string, string> = {
                    "neraca": "neraca-report",
                    "report": "report-report",
                    "profit_loss": "profit-loss-report",
                    "profit_loss_summary": "profit-loss-summary-report",
                    "arus_kas": "arus-kas-report",
                    "p_ekuitas": "ekuitas-report",
                    "calk": "calk-report",
                    "rkapb_comparison": "rkapb-report",
                    "ebitda_eat": "ebitda-report"
                  };
                  handlePrint(reportIdMap[activeTab]);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
                title="Cetak Laporan"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => fetchBalanceCheck(period, true)}
              disabled={checkingBalance}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                checkingBalance 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : balanceDiscrepancies.length > 0 
                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm"
              )}
              title={balanceDiscrepancies.length > 0 ? `Ditemukan ${balanceDiscrepancies.length} selisih saldo!` : "Error Proofing"}
            >
              <ShieldCheck className={cn("w-4 h-4", checkingBalance && "animate-pulse")} />
            </button>
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

          {/* Balance Control Modal */}
          {isBalanceCheckOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-200"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-slate-900">Error Proofing</h3>
                      <p className="text-xs text-slate-500">Memeriksa sinkronisasi antar laporan keuangan dan konsistensi saldo</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsBalanceCheckOpen(false)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-auto p-6">
                  {balanceDiscrepancies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">Semua Saldo Sinkron</h4>
                      <p className="text-sm text-slate-500 max-w-md">Tidak ditemukan selisih antara saldo akhir periode sebelumnya dengan saldo awal periode saat ini di seluruh database.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-amber-900">Ditemukan {balanceDiscrepancies.length} Selisih Saldo</h4>
                          <p className="text-xs text-amber-700">Silakan periksa kembali data input pada periode-periode berikut untuk memastikan konsistensi laporan keuangan.</p>
                        </div>
                      </div>
                      
                      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                            <tr>
                              <th className="px-4 py-3">Tipe / Akun</th>
                              <th className="px-4 py-3">Periode</th>
                              <th className="px-4 py-3 text-right">Nilai 1</th>
                              <th className="px-4 py-3 text-right">Nilai 2</th>
                              <th className="px-4 py-3 text-right">Selisih (Gap)</th>
                              <th className="px-4 py-3">Keterangan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {balanceDiscrepancies.map((d, idx) => {
                              const isSyncCheck = d.type === "Cash Flow Sync" || d.type === "Tax Calculation Sync";
                              
                              return (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-4 py-3">
                                    <div className="font-bold text-slate-900">{d.type}</div>
                                    {d.account_code && (
                                      <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                                        {d.account_code} - {d.account_name}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {isSyncCheck ? (
                                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-mono font-bold">{d.curr_period}</span>
                                    ) : (
                                      <div className="flex items-center gap-1.5">
                                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono">{d.prev_period}</span>
                                        <ArrowRight className="w-3 h-3 text-slate-300" />
                                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-mono font-bold">{d.curr_period}</span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-right font-mono">
                                    {isSyncCheck ? (
                                      <div className="text-slate-600">{formatCurrency(d.val1).replace("Rp", "").trim()}</div>
                                    ) : (
                                      <>
                                        <div className="text-slate-600">D: {formatCurrency(d.prev_final_debit).replace("Rp", "").trim()}</div>
                                        <div className="text-slate-600">K: {formatCurrency(d.prev_final_credit).replace("Rp", "").trim()}</div>
                                      </>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-right font-mono">
                                    {isSyncCheck ? (
                                      <div className="text-slate-900 font-bold">{formatCurrency(d.val2).replace("Rp", "").trim()}</div>
                                    ) : (
                                      <>
                                        <div className="text-slate-900 font-bold">D: {formatCurrency(d.curr_initial_debit).replace("Rp", "").trim()}</div>
                                        <div className="text-slate-900 font-bold">K: {formatCurrency(d.curr_initial_credit).replace("Rp", "").trim()}</div>
                                      </>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-right font-mono">
                                    {isSyncCheck ? (
                                      <div className={cn("font-bold", Math.abs(d.gap) > 0.01 ? "text-red-600" : "text-slate-400")}>
                                        {formatCurrency(d.gap).replace("Rp", "").trim()}
                                      </div>
                                    ) : (
                                      <>
                                        <div className={cn("font-bold", Math.abs(d.gap_debit) > 0.01 ? "text-red-600" : "text-slate-400")}>
                                          {d.gap_debit !== 0 ? formatCurrency(d.gap_debit).replace("Rp", "").trim() : "-"}
                                        </div>
                                        <div className={cn("font-bold", Math.abs(d.gap_credit) > 0.01 ? "text-red-600" : "text-slate-400")}>
                                          {d.gap_credit !== 0 ? formatCurrency(d.gap_credit).replace("Rp", "").trim() : "-"}
                                        </div>
                                      </>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="text-[10px] text-red-500 italic">{d.message || "Selisih Saldo"}</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                  <button 
                    onClick={() => setIsBalanceCheckOpen(false)}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </div>
          )}

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
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print-report">
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
                  </div>

                  <div id="calk-report" className="p-12 space-y-12 print:px-[1.5cm] print:py-8 print-report">
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
                          total={getOperationalExpense(data)}
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

                        {/* 4.5 Beban Penyusutan & Amortisasi */}
                        <CalkExpandableSection 
                          id="4.5"
                          title="4.5. Beban Penyusutan & Amortisasi"
                          total={getDepreciationAndAmortization(data)}
                          items={data.filter(i => i.account_code.startsWith('54') && !isParentAccount(data, i.account_code)).map(i => ({ label: i.account_name, val: i.final_debit - i.final_credit }))}
                          isExpanded={expandedCalk["4.5"]}
                          onToggle={toggleCalk}
                          formatCurrency={formatCurrency}
                        />

                        {/* 4.6 Taksiran Pajak Penghasilan */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden calk-expandable-section">
                          <button 
                            onClick={() => toggleCalk("4.6")}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <span className="text-emerald-700 font-bold text-xs">4.6</span>
                              </div>
                              <h3 className="font-display font-bold text-slate-900">4.6. Taksiran Pajak Penghasilan</h3>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="text-sm font-mono font-bold text-emerald-600">{formatCurrency(getTaxEstimation(data))}</span>
                              <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform print:hidden", expandedCalk["4.6"] && "rotate-180")} />
                            </div>
                          </button>
                          
                          <div className={cn("overflow-hidden border-t border-slate-100 print:block", expandedCalk["4.6"] ? "block" : "hidden")}>
                            <div className="p-6 bg-slate-50/30 print:p-2 print:bg-white">
                              {(() => {
                                    const ebt = getNetProfitBeforeTax(data);
                                    const sumbangan = getPLVal(data, '531040000');
                                    const bebanPajak = getPLVal(data, '521021700');
                                    const bebanPajakBungaBank = getPLVal(data, '531010000');
                                    const totalKoreksiPositif = sumbangan + bebanPajak + bebanPajakBungaBank;
                                    
                                    const pendapatanBungaBank = getPLVal(data, '431010100', true) + 
                                                              getPLVal(data, '431010200', true) + 
                                                              getPLVal(data, '431010300', true) + 
                                                              getPLVal(data, '431010400', true);
                                    
                                    const labaSetelahKoreksi = ebt + totalKoreksiPositif - pendapatanBungaBank;
                                    const pembulatan = labaSetelahKoreksi % 1000;
                                    const labaKenaPajak = labaSetelahKoreksi - pembulatan;
                                    
                                    const taksiranPajak = labaKenaPajak * 0.22;
                                    const angsuranPPh25 = data.find(i => i.account_code === '116010001')?.final_debit || 0;
                                    const kurangBayar = taksiranPajak - angsuranPPh25;

                                    return (
                                      <div className="space-y-4">
                                        <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                                          <span>Rincian Perhitungan</span>
                                          <span>{new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(period + "-01"))}</span>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Laba Bersih Sebelum Pajak</span>
                                            <span className="font-mono font-bold">{formatCurrency(ebt).replace("Rp", "").trim()}</span>
                                          </div>
                                          
                                          <div className="pt-2">
                                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-tight">Koreksi Fiskal Positif</span>
                                            <div className="pl-4 space-y-1 mt-1">
                                              <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Sumbangan</span>
                                                <span className="font-mono">{sumbangan !== 0 ? formatCurrency(sumbangan).replace("Rp", "").trim() : "-"}</span>
                                              </div>
                                              <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Beban Pajak</span>
                                                <span className="font-mono">{bebanPajak !== 0 ? formatCurrency(bebanPajak).replace("Rp", "").trim() : "-"}</span>
                                              </div>
                                              <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Beban Pajak Bunga Bank</span>
                                                <span className="font-mono">{bebanPajakBungaBank !== 0 ? formatCurrency(bebanPajakBungaBank).replace("Rp", "").trim() : "-"}</span>
                                              </div>
                                              <div className="flex justify-between text-xs font-bold border-t border-slate-200 pt-1 mt-1">
                                                <span className="text-slate-700">Total Koreksi Positif</span>
                                                <span className="font-mono">{formatCurrency(totalKoreksiPositif).replace("Rp", "").trim()}</span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="pt-2">
                                            <span className="text-xs font-bold text-red-600 uppercase tracking-tight">Koreksi Negatif</span>
                                            <div className="pl-4 space-y-1 mt-1">
                                              <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Pendapatan Bunga bank</span>
                                                <span className="font-mono">{formatCurrency(pendapatanBungaBank).replace("Rp", "").trim()}</span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="pt-4 border-t border-slate-200 space-y-2">
                                            <div className="flex justify-between text-sm font-bold">
                                              <span className="text-slate-900">Laba Bersih setelah Koreksi Fiskal</span>
                                              <span className="font-mono">{formatCurrency(labaSetelahKoreksi).replace("Rp", "").trim()}</span>
                                            </div>
                                            <div className="flex justify-between text-xs italic text-slate-500">
                                              <span>Pembulatan Kebawah</span>
                                              <span className="font-mono">({formatCurrency(pembulatan).replace("Rp", "").trim()})</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-bold border-t-2 border-slate-900 pt-1">
                                              <span className="text-slate-900 uppercase tracking-tight">Laba Kena Pajak</span>
                                              <span className="font-mono">{formatCurrency(labaKenaPajak).replace("Rp", "").trim()}</span>
                                            </div>
                                          </div>

                                          <div className="pt-6 space-y-3">
                                            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                              <span className="text-sm font-bold text-emerald-900">Taksiran Pajak Penghasilan (22%)</span>
                                              <span className="text-lg font-mono font-bold text-emerald-700">{formatCurrency(taksiranPajak).replace("Rp", "").trim()}</span>
                                            </div>
                                            
                                            <div className="space-y-1 px-3">
                                              <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Angsuran PPh 25</span>
                                                <span className="font-mono">{angsuranPPh25 !== 0 ? formatCurrency(angsuranPPh25).replace("Rp", "").trim() : "-"}</span>
                                              </div>
                                              <div className="flex justify-between text-sm font-bold text-red-600 pt-2 border-t border-slate-100">
                                                <span>Kurang Bayar</span>
                                                <span className="font-mono">{formatCurrency(kurangBayar).replace("Rp", "").trim()}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>

                        {/* 4.7 Laba (Rugi) Setelah Pajak */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden calk-expandable-section">
                          <button 
                            onClick={() => toggleCalk("4.7")}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <span className="text-emerald-700 font-bold text-xs">4.7</span>
                              </div>
                              <h3 className="font-display font-bold text-slate-900">4.7. Laba (Rugi) Setelah Pajak</h3>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="text-sm font-mono font-bold text-emerald-600">{formatCurrency(getFinalNetProfit(data))}</span>
                              <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform print:hidden", expandedCalk["4.7"] && "rotate-180")} />
                            </div>
                          </button>
                          
                          <div className={cn("overflow-hidden border-t border-slate-100 print:block", expandedCalk["4.7"] ? "block" : "hidden")}>
                            <div className="p-6 bg-slate-50/30 print:p-2 print:bg-white">
                              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border border-emerald-100 print:bg-white print:border-slate-200">
                                <span className="text-sm font-bold text-emerald-900">Laba (Rugi) Setelah Pajak</span>
                                <span className="text-xl font-mono font-bold text-emerald-700">{formatCurrency(getFinalNetProfit(data))}</span>
                              </div>
                              <p className="mt-4 text-xs text-slate-500 italic print:mt-1">
                                Nilai ini merupakan hasil akhir dari Laporan Laba Rugi setelah memperhitungkan seluruh pendapatan, beban, dan taksiran pajak penghasilan.
                              </p>
                            </div>
                          </div>
                        </div>
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

            {activeTab === "penjelasan_lk" && (
              <motion.div
                key="penjelasan_lk"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-[210mm] mx-auto bg-white shadow-2xl p-[10mm] min-h-[297mm] print:shadow-none print:p-0"
              >
                {/* Print Button */}
                <div className="flex justify-end mb-4 print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Cetak Laporan
                  </button>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">PENJELASAN ATAS LAPORAN KEUANGAN BULAN {(() => {
                    const [year, month] = period.split("-").map(Number);
                    return new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                  })()} {period.split("-")[0]}</h2>
                  <div className="h-1 w-24 bg-emerald-600 mx-auto mt-2" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-2 text-left" rowSpan={2}>LABA RUGI</th>
                        <th className="border border-slate-300 p-2 text-center" colSpan={2}>REALISASI</th>
                        <th className="border border-slate-300 p-2 text-center" rowSpan={2}>RKAPBP {(() => {
                          const [year, month] = period.split("-").map(Number);
                          const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'short' });
                          return `${monthName} ${year}`;
                        })()}</th>
                        <th className="border border-slate-300 p-2 text-center" rowSpan={2}>KETERANGAN</th>
                      </tr>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-2 text-center">{(() => {
                          const [year, month] = period.split("-").map(Number);
                          const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'short' });
                          return `${monthName}-${year.toString().slice(-2)}`;
                        })()}</th>
                        <th className="border border-slate-300 p-2 text-center">{(() => {
                          const [year, month] = period.split("-").map(Number);
                          const prevMonthDate = new Date(year, month - 2, 1);
                          const monthName = prevMonthDate.toLocaleDateString('id-ID', { month: 'short' });
                          return `${monthName}-${prevMonthDate.getFullYear().toString().slice(-2)}`;
                        })()}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const [year, month] = period.split("-").map(Number);
                        const monthNameFull = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                        const prevMonthDate = new Date(year, month - 2, 1);
                        const prevMonthNameFull = prevMonthDate.toLocaleDateString('id-ID', { month: 'long' });
                        const currentYear = period.split("-")[0];

                        const renderRow = (label: string, curr: number, prev: number, budget: number, isHeader = false, isBold = false, indent = false) => {
                          const attainment = budget !== 0 ? (curr / budget) * 100 : 0;
                          const diff = curr - prev;
                          const diffPercent = prev !== 0 ? (Math.abs(diff) / Math.abs(prev)) * 100 : 0;
                          const trend = diff > 0 ? "kenaikan" : "penurunan";

                          let analysis = `Ketercapaian ${label} atas RKAPBP ${monthNameFull} ${currentYear} sebesar ${attainment.toFixed(2)}%`;
                          if (prev !== 0) {
                            analysis += `, sedangkan dengan realisasi ${prevMonthNameFull} ${currentYear} terjadi ${trend} sebesar Rp. ${formatCurrency(Math.abs(diff)).replace("Rp", "").trim()} (${diffPercent.toFixed(0)}%)`;
                          }

                          return (
                            <tr key={label} className={cn(isHeader && "bg-slate-50 font-bold", isBold && "font-bold")}>
                              <td className={cn("border border-slate-300 p-2", indent && "pl-6")}>{label}</td>
                              <td className="border border-slate-300 p-2 text-right font-mono">{formatCurrency(curr).replace("Rp", "").trim()}</td>
                              <td className="border border-slate-300 p-2 text-right font-mono">{formatCurrency(prev).replace("Rp", "").trim()}</td>
                              <td className="border border-slate-300 p-2 text-right font-mono">{formatCurrency(budget).replace("Rp", "").trim()}</td>
                              <td className="border border-slate-300 p-2 text-[9px] leading-tight text-slate-600 italic">
                                {!isHeader && analysis}
                              </td>
                            </tr>
                          );
                        };

                        // Data calculation
                        const riCurr = getPLVal(data, '411', true);
                        const riPrev = getPLVal(prevPeriodData, '411', true);
                        const riBudget = getBudgetTotal('411', month);

                        const rjCurr = getPLVal(data, '412', true);
                        const rjPrev = getPLVal(prevPeriodData, '412', true);
                        const rjBudget = getBudgetTotal('412', month);

                        const rdCurr = getPLVal(data, '413', true);
                        const rdPrev = getPLVal(prevPeriodData, '413', true);
                        const rdBudget = getBudgetTotal('413', month);

                        const opRevenueSubCurr = riCurr + rjCurr + rdCurr;
                        const opRevenueSubPrev = riPrev + rjPrev + rdPrev;
                        const opRevenueSubBudget = riBudget + rjBudget + rdBudget;

                        const otherOpCurr = getPLVal(data, '42', true);
                        const otherOpPrev = getPLVal(prevPeriodData, '42', true);
                        const otherOpBudget = getBudgetTotal('42', month);

                        const nonOpCurr = getPLVal(data, '43', true);
                        const nonOpPrev = getPLVal(prevPeriodData, '43', true);
                        const nonOpBudget = getBudgetTotal('43', month);

                        const totalOpCurr = opRevenueSubCurr + otherOpCurr + nonOpCurr;
                        const totalOpPrev = opRevenueSubPrev + otherOpPrev + nonOpPrev;
                        const totalOpBudget = opRevenueSubBudget + otherOpBudget + nonOpBudget;

                        // HPP
                        const hppCurr = getHPPAndDirectExpense(data);
                        const hppPrev = getHPPAndDirectExpense(prevPeriodData);
                        const hppBudget = getBudgetTotal('51', month);

                        const grossProfitCurr = totalOpCurr - hppCurr;
                        const grossProfitPrev = totalOpPrev - hppPrev;
                        const grossProfitBudget = totalOpBudget - hppBudget;

                        // Beban Operasional
                        const persCurr = getPLVal(data, '52101');
                        const persPrev = getPLVal(prevPeriodData, '52101');
                        const persBudget = getBudgetTotal('52101', month);

                        const admCurr = getPLVal(data, '52102');
                        const admPrev = getPLVal(prevPeriodData, '52102');
                        const admBudget = getBudgetTotal('52102', month);

                        const umumCurr = getPLVal(data, '52103');
                        const umumPrev = getPLVal(prevPeriodData, '52103');
                        const umumBudget = getBudgetTotal('52103', month);

                        const penyCurr = getPLVal(data, '54');
                        const penyPrev = getPLVal(prevPeriodData, '54');
                        const penyBudget = getBudgetTotal('54', month);

                        const nonOpExpCurr = getPLVal(data, '53');
                        const nonOpExpPrev = getPLVal(prevPeriodData, '53');
                        const nonOpExpBudget = getBudgetTotal('53', month);

                        const totalExpCurr = persCurr + admCurr + umumCurr + penyCurr + nonOpExpCurr;
                        const totalExpPrev = persPrev + admPrev + umumPrev + penyPrev + nonOpExpPrev;
                        const totalExpBudget = persBudget + admBudget + umumBudget + penyBudget + nonOpExpBudget;

                        const opProfitCurr = grossProfitCurr - totalExpCurr;
                        const opProfitPrev = grossProfitPrev - totalExpPrev;
                        const opProfitBudget = grossProfitBudget - totalExpBudget;

                        const taxCurr = getTaxEstimation(data);
                        const taxPrev = getTaxEstimation(prevPeriodData);
                        const taxBudget = opProfitBudget * 0.22; // Approximation

                        const netProfitCurr = opProfitCurr - taxCurr;
                        const netProfitPrev = opProfitPrev - taxPrev;
                        const netProfitBudget = opProfitBudget - taxBudget;

                        return (
                          <>
                            {renderRow("PENDAPATAN OPERASIONAL", 0, 0, 0, true)}
                            {renderRow("Pendapatan Rawat Inap", riCurr, riPrev, riBudget, false, false, true)}
                            {renderRow("Pendapatan Rawat Jalan", rjCurr, rjPrev, rjBudget, false, false, true)}
                            {renderRow("Pendapatan Rawat Darurat", rdCurr, rdPrev, rdBudget, false, false, true)}
                            {renderRow("Jumlah Pendapatan Operasional", opRevenueSubCurr, opRevenueSubPrev, opRevenueSubBudget, false, true, false)}
                            {renderRow("Pendapatan Operasional Lain", otherOpCurr, otherOpPrev, otherOpBudget, false, false, true)}
                            {renderRow("Pendapatan Non Operasional", nonOpCurr, nonOpPrev, nonOpBudget, false, false, true)}
                            {renderRow("Jumlah Pendapatan Operasional", totalOpCurr, totalOpPrev, totalOpBudget, false, true, false)}

                            {renderRow("HARGA POKOK PELAYANAN", 0, 0, 0, true)}
                            {renderRow("Harga Pokok Penjualan dan Beban langsung", hppCurr, hppPrev, hppBudget, false, false, true)}
                            {renderRow("Jumlah Harga Pokok Pelayanan", hppCurr, hppPrev, hppBudget, false, true, false)}
                            {renderRow("Laba Kotor", grossProfitCurr, grossProfitPrev, grossProfitBudget, false, true, false)}

                            {renderRow("BEBAN OPERASIONAL", 0, 0, 0, true)}
                            {renderRow("Beban Personalia", persCurr, persPrev, persBudget, false, false, true)}
                            {renderRow("Beban Administrasi", admCurr, admPrev, admBudget, false, false, true)}
                            {renderRow("Beban Umum", umumCurr, umumPrev, umumBudget, false, false, true)}
                            {renderRow("Beban Penyusutan", penyCurr, penyPrev, penyBudget, false, false, true)}
                            {renderRow("Beban Non Operasional", nonOpExpCurr, nonOpExpPrev, nonOpExpBudget, false, false, true)}
                            {renderRow("Jumlah Beban Operasional", totalExpCurr, totalExpPrev, totalExpBudget, false, true, false)}

                            {renderRow("Laba Operasional", opProfitCurr, opProfitPrev, opProfitBudget, false, true, false)}
                            {renderRow("LABA SEBELUM PAJAK PENGHASILAN", opProfitCurr, opProfitPrev, opProfitBudget, false, true, false)}
                            {renderRow("Taksiran Pajak Penghasilan", taxCurr, taxPrev, taxBudget, false, false, true)}
                            {renderRow("LABA SETELAH PAJAK PENGHASILAN", netProfitCurr, netProfitPrev, netProfitBudget, false, true, false)}
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Footer Signatures */}
                <div className="mt-8 grid grid-cols-2 gap-20 text-center text-xs font-bold signature-box">
                  <div>
                    <p className="uppercase signature-space">Direktur Utama</p>
                    <p className="underline">dr M. Arif Rida, M.M.R</p>
                  </div>
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="signature-space">Direktur Keuangan, Umum dan SDI</p>
                    <p className="underline">Miftachul Izah, SE. M. Kes</p>
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
                  <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Cashflow Management</h2>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Modul Cashflow Management sedang dalam pengembangan. Fitur ini akan menampilkan pengelolaan cashflow secara berkesinambungan
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
                    <p className="italic text-slate-500 mt-1 disajikan-label">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
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

                <div className="mt-20 text-center italic text-slate-500 report-footer-note">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-8 grid grid-cols-2 gap-20 text-center text-xs font-bold signature-box">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="uppercase signature-space">Direktur</p>
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
                <div id="profit-loss-summary-report" className="max-w-4xl mx-auto bg-white p-12 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:px-[1.5cm] print:py-8 print-report">
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
                  <p className="italic text-slate-500 mt-1 disajikan-label">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
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
                        <span className="text-center report-note-col">4.1.</span>
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
                        <span className="text-center report-note-col">4.2.</span>
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
                        <span className="text-center report-note-col">4.3.</span>
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
                        <span className="text-center report-note-col">4.4.</span>
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
                    <span className="text-center report-note-col">4.5.</span>
                    <span className="text-right font-mono">{formatCurrency(getTaxEstimation(data)).replace("Rp", "").trim()}</span>
                  </div>

                  {/* LABA SETELAH PAJAK PENGHASILAN */}
                  <div className="grid grid-cols-[1fr_100px_200px] items-center font-bold py-4 border-y-4 border-double border-slate-900 bg-emerald-50 px-2 text-lg">
                    <span>LABA SETELAH PAJAK PENGHASILAN</span>
                    <div />
                    <span className="text-right font-mono">{formatCurrency(getFinalNetProfit(data)).replace("Rp", "").trim()}</span>
                  </div>
                </div>

                <div className="mt-20 text-center italic text-slate-500 report-footer-note">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-8 grid grid-cols-2 gap-20 text-center text-xs font-bold signature-box">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="uppercase signature-space">Direktur</p>
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
                <div id="profit-loss-detail-report" className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-12 print:shadow-none print:border-none print:px-[1.5cm] print:py-8 print-report">
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
                    <p className="italic text-slate-500 mt-1 disajikan-label">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
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
                    <div className="p-4 space-y-6">
                      {/* Header Row for Comparison */}
                      {comparisonPeriod && (
                        <div className="grid grid-cols-[1fr_100px_100px_100px_60px] items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2 px-2 sticky top-0 bg-white z-20">
                          <span>Keterangan</span>
                          <span className="text-right">{period}</span>
                          <span className="text-right">{comparisonPeriod}</span>
                          <span className="text-right">Variance</span>
                          <span className="text-right">%</span>
                        </div>
                      )}

                      {/* PENDAPATAN SECTION */}
                      <section>
                        <h3 className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-2 uppercase">PENDAPATAN</h3>
                        
                        <div className="space-y-6">
                          {/* Pendapatan Operasional */}
                          <div className="pl-4">
                            <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1">PENDAPATAN OPERASIONAL</h4>
                            
                            <div className="pl-2 space-y-4">
                              {/* Rawat Inap */}
                              <div>
                                <h5 className="text-[11px] font-bold text-slate-800 mb-1">PENDAPATAN OPERASIONAL RAWAT INAP</h5>
                                <div className="pl-2 space-y-2">
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
                                      <p className="text-[10px] font-bold text-slate-600 mb-0.5 uppercase tracking-tight">{group.label}</p>
                                      <div className="pl-2 space-y-0 border-l border-slate-100">
                                        {data.filter(i => i.account_code.startsWith(group.prefix) && !isParentAccount(data, i.account_code))
                                          .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                                      </div>
                                    </div>
                                  ))}
                                  {renderPLDetailGroupTotal("Jumlah Pendapatan Rawat Inap", "411", true, !!comparisonPeriod)}
                                </div>
                              </div>

                              {/* Rawat Jalan */}
                              <div>
                                <h5 className="text-[11px] font-bold text-slate-800 mb-1">PENDAPATAN RAWAT JALAN</h5>
                                <div className="pl-2 space-y-2">
                                  {[
                                    { label: "PENDAPATAN PEMERIKSAAN/KONSULTASI", prefix: "41201" },
                                    { label: "PENDAPATAN TINDAKAN RAWAT JALAN", prefix: "41202" },
                                    { label: "PENDAPATAN PENUNJANG MEDIS", prefix: "41203" },
                                  ].map(group => (
                                    <div key={group.prefix} className="group">
                                      <p className="text-[10px] font-bold text-slate-600 mb-0.5 uppercase tracking-tight">{group.label}</p>
                                      <div className="pl-2 space-y-0 border-l border-slate-100">
                                        {data.filter(i => i.account_code.startsWith(group.prefix) && !isParentAccount(data, i.account_code))
                                          .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                                      </div>
                                    </div>
                                  ))}
                                  {renderPLDetailGroupTotal("Jumlah Pendapatan Rawat Jalan", "412", true, !!comparisonPeriod)}
                                </div>
                              </div>

                              {/* UGD */}
                              <div>
                                <h5 className="text-[11px] font-bold text-slate-800 mb-1">PENDAPATAN UGD</h5>
                                <div className="pl-2 space-y-2">
                                  {[
                                    { label: "PENDAPATAN PEMERIKSAAN UGD", prefix: "41301" },
                                    { label: "PENDAPATAN TINDAKAN UGD", prefix: "41302" },
                                  ].map(group => (
                                    <div key={group.prefix} className="group">
                                      <p className="text-[10px] font-bold text-slate-600 mb-0.5 uppercase tracking-tight">{group.label}</p>
                                      <div className="pl-2 space-y-0 border-l border-slate-100">
                                        {data.filter(i => i.account_code.startsWith(group.prefix) && !isParentAccount(data, i.account_code))
                                          .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                                      </div>
                                    </div>
                                  ))}
                                  {renderPLDetailGroupTotal("Jumlah Pendapatan UGD", "413", true, !!comparisonPeriod)}
                                </div>
                              </div>

                              {/* Discount */}
                              {(() => {
                                const val = getPLVal(data, "414", true);
                                const compVal = comparisonPeriod ? getPLVal(comparisonData, "414", true) : 0;
                                const diff = val - compVal;
                                const pct = compVal !== 0 ? (diff / Math.abs(compVal)) * 100 : 0;
                                return (
                                  <div className={cn("grid items-center font-bold text-[11px] text-slate-900 bg-red-50/30 px-2 py-1 rounded border border-red-100/50", comparisonPeriod ? "grid-cols-[1fr_100px_100px_100px_60px]" : "grid-cols-[1fr_120px]")}>
                                    <span>DISCOUNT</span>
                                    <span className="text-right font-mono text-red-600">({formatCurrency(Math.abs(val)).replace("Rp", "").trim()})</span>
                                    {comparisonPeriod && (
                                      <>
                                        <span className="text-right font-mono text-slate-500">({formatCurrency(Math.abs(compVal)).replace("Rp", "").trim()})</span>
                                        <span className={cn("text-right font-mono", diff < 0 ? "text-emerald-600" : diff > 0 ? "text-red-600" : "text-slate-400")}>
                                          {formatCurrency(Math.abs(diff)).replace("Rp", "").trim()}
                                        </span>
                                        <span className={cn("text-right font-mono text-[9px]", diff < 0 ? "text-emerald-500" : diff > 0 ? "text-red-500" : "text-slate-400")}>
                                          {compVal !== 0 ? `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%` : "-"}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                );
                              })()}

                              {/* Operasional Lainnya */}
                              <div>
                                <h5 className="text-[11px] font-bold text-slate-800 mb-1">PENDAPATAN OPERASIONAL LAINNYA</h5>
                                <div className="pl-2 space-y-0">
                                  {[
                                    { label: "PENDAPATAN ADMINISTRASI", prefix: "421" },
                                    { label: "PENDAPATAN AMBULANCE", prefix: "422" },
                                    { label: "PENDAPATAN PERAWATAN JENAZAH", prefix: "423" },
                                    { label: "PENDAPATAN SELISIH KLAIM (DANA TAAWUN)", prefix: "424" },
                                  ].map(group => {
                                    const val = getPLVal(data, group.prefix, true);
                                    const compVal = comparisonPeriod ? getPLVal(comparisonData, group.prefix, true) : 0;
                                    const diff = val - compVal;
                                    const pct = compVal !== 0 ? (diff / Math.abs(compVal)) * 100 : 0;
                                    return (
                                      <div key={group.prefix} className={cn("grid items-center text-[11px] hover:bg-slate-50 px-2 py-0.5 rounded", comparisonPeriod ? "grid-cols-[1fr_100px_100px_100px_60px]" : "grid-cols-[1fr_120px]")}>
                                        <span className="text-slate-600">{group.label}</span>
                                        <span className="text-right font-mono text-slate-900">{val !== 0 ? formatCurrency(val).replace("Rp", "").trim() : "-"}</span>
                                        {comparisonPeriod && (
                                          <>
                                            <span className="text-right font-mono text-slate-500">{compVal !== 0 ? formatCurrency(compVal).replace("Rp", "").trim() : "-"}</span>
                                            <span className={cn("text-right font-mono", diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-slate-400")}>
                                              {diff !== 0 ? formatCurrency(diff).replace("Rp", "").trim() : "-"}
                                            </span>
                                            <span className={cn("text-right font-mono text-[9px]", diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-slate-400")}>
                                              {compVal !== 0 ? `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%` : "-"}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                  {renderPLDetailGroupTotal("Jumlah Pendapatan Operasional lain", "42", true, !!comparisonPeriod)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Pendapatan Lain-lain */}
                          <div className="pl-2">
                            <h4 className="text-[12px] font-bold text-slate-900 mb-2 border-b border-slate-200 pb-0.5">PENDAPATAN LAIN-LAIN</h4>
                            <div className="pl-2 space-y-0">
                              {data.filter(i => i.account_code.startsWith('431') && !isParentAccount(data, i.account_code))
                                .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                              {renderPLDetailGroupTotal("Jumlah Pendapatan lain-lain", "431", true, !!comparisonPeriod)}
                            </div>
                          </div>

                          {/* Total Pendapatan */}
                          {(() => {
                            const val = getRevenueTotal(data);
                            const compVal = comparisonPeriod ? getRevenueTotal(comparisonData) : 0;
                            const diff = val - compVal;
                            const pct = compVal !== 0 ? (diff / Math.abs(compVal)) * 100 : 0;
                            return (
                              <div className={cn("grid items-center pt-2 border-t-2 border-slate-900 font-bold text-[12px] uppercase tracking-wider text-slate-900 bg-emerald-50/50 px-2 py-1 rounded border border-emerald-100", comparisonPeriod ? "grid-cols-[1fr_100px_100px_100px_60px]" : "grid-cols-[1fr_120px]")}>
                                <span>TOTAL PENDAPATAN</span>
                                <span className="text-right font-mono">{formatCurrency(val).replace("Rp", "").trim()}</span>
                                {comparisonPeriod && (
                                  <>
                                    <span className="text-right font-mono text-slate-500">{formatCurrency(compVal).replace("Rp", "").trim()}</span>
                                    <span className={cn("text-right font-mono", diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-slate-400")}>
                                      {formatCurrency(diff).replace("Rp", "").trim()}
                                    </span>
                                    <span className={cn("text-right font-mono text-[9px]", diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-slate-400")}>
                                      {compVal !== 0 ? `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%` : "-"}
                                    </span>
                                  </>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </section>

                      {/* BEBAN USAHA SECTION */}
                      <section>
                        <h3 className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-1 mb-2 uppercase">BEBAN USAHA</h3>
                        
                        <div className="space-y-4">
                          {/* HPP & Beban Langsung */}
                          <div className="pl-2">
                            <h4 className="text-[12px] font-bold text-slate-900 mb-2 uppercase tracking-tight border-b border-slate-200 pb-0.5">HARGA POKOK PELAYANAN PASIEN DAN BEBAN LANGSUNG</h4>
                            
                            <div className="pl-2 space-y-4">
                              {/* HPP */}
                              <div>
                                <h5 className="text-[11px] font-bold text-slate-800 mb-1 uppercase">HARGA POKOK PELAYANAN</h5>
                                <div className="pl-2 space-y-0 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('511') && !isParentAccount(data, i.account_code))
                                    .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                                </div>
                              </div>

                              {/* Beban Langsung */}
                              <div>
                                <h5 className="text-[11px] font-bold text-slate-800 mb-1 uppercase">BEBAN LANGSUNG</h5>
                                <div className="pl-2 space-y-0 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('512') && !isParentAccount(data, i.account_code))
                                    .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                                </div>
                              </div>

                              {/* Beban Jasa Pelayanan */}
                              <div>
                                <h5 className="text-[11px] font-bold text-slate-800 mb-1 uppercase">BEBAN JASA PELAYANAN</h5>
                                <div className="pl-2 space-y-0 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('513') && !isParentAccount(data, i.account_code))
                                    .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                                </div>
                              </div>

                              {/* Pemeriksaan Keluar */}
                              <div>
                                <h5 className="text-[11px] font-bold text-slate-800 mb-1 uppercase">PEMERIKSAAN KELUAR</h5>
                                <div className="pl-2 space-y-0 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('514') && !isParentAccount(data, i.account_code))
                                    .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                                </div>
                              </div>

                              {renderPLDetailGroupTotal("Total HPP dan Beban Langsung", "51", false, !!comparisonPeriod)}
                            </div>
                          </div>

                          {/* Laba Kotor */}
                          {(() => {
                            const val = getGrossProfit(data);
                            const compVal = comparisonPeriod ? getGrossProfit(comparisonData) : 0;
                            const diff = val - compVal;
                            const pct = compVal !== 0 ? (diff / Math.abs(compVal)) * 100 : 0;
                            return (
                              <div className={cn("grid items-center py-2 border-y border-slate-900 font-bold text-[12px] uppercase tracking-wider bg-emerald-50/30 px-2 text-slate-900", comparisonPeriod ? "grid-cols-[1fr_100px_100px_100px_60px]" : "grid-cols-[1fr_120px]")}>
                                <span>LABA KOTOR</span>
                                <span className="text-right font-mono">{formatCurrency(val).replace("Rp", "").trim()}</span>
                                {comparisonPeriod && (
                                  <>
                                    <span className="text-right font-mono text-slate-500">{formatCurrency(compVal).replace("Rp", "").trim()}</span>
                                    <span className={cn("text-right font-mono", diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-slate-400")}>
                                      {formatCurrency(diff).replace("Rp", "").trim()}
                                    </span>
                                    <span className={cn("text-right font-mono text-[9px]", diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-slate-400")}>
                                      {compVal !== 0 ? `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%` : "-"}
                                    </span>
                                  </>
                                )}
                              </div>
                            );
                          })()}

                          {/* Beban Operasional */}
                          <div className="pl-2">
                            <h4 className="text-[12px] font-bold text-slate-900 mb-2 uppercase tracking-tight border-b border-slate-200 pb-0.5">BEBAN OPERASIONAL</h4>
                            
                            <div className="pl-2 space-y-4">
                              {/* Administrasi & Umum */}
                              <div>
                                <h5 className="text-[11px] font-bold text-slate-800 mb-1 uppercase">BEBAN ADMINISTRASI & UMUM</h5>
                                <div className="pl-2 space-y-4">
                                  {[
                                    { label: "BEBAN PERSONALIA", prefix: "52101" },
                                    { label: "BEBAN ADMINISTRASI", prefix: "52102" },
                                    { label: "BEBAN UMUM", prefix: "52103" },
                                  ].map(group => (
                                    <div key={group.prefix} className="group">
                                      <p className="text-[10px] font-bold text-slate-600 mb-0.5 uppercase tracking-tight">{group.label}</p>
                                      <div className="pl-2 space-y-0 border-l border-slate-100">
                                        {data.filter(i => i.account_code.startsWith(group.prefix) && !isParentAccount(data, i.account_code))
                                          .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                                      </div>
                                      {renderPLDetailGroupTotal(`Jumlah ${group.label}`, group.prefix, false, !!comparisonPeriod)}
                                    </div>
                                  ))}
                                  {renderPLDetailGroupTotal("Total Beban Operasional", "52", false, !!comparisonPeriod)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Laba Operasional */}
                          {(() => {
                            const val = getOperationalProfit(data);
                            const compVal = comparisonPeriod ? getOperationalProfit(comparisonData) : 0;
                            const diff = val - compVal;
                            const pct = compVal !== 0 ? (diff / Math.abs(compVal)) * 100 : 0;
                            return (
                              <div className={cn("grid items-center py-2 border-y border-slate-900 font-bold text-[12px] uppercase tracking-wider bg-emerald-50/30 px-2 text-slate-900", comparisonPeriod ? "grid-cols-[1fr_100px_100px_100px_60px]" : "grid-cols-[1fr_120px]")}>
                                <span>LABA OPERASIONAL</span>
                                <span className="text-right font-mono">{formatCurrency(val).replace("Rp", "").trim()}</span>
                                {comparisonPeriod && (
                                  <>
                                    <span className="text-right font-mono text-slate-500">{formatCurrency(compVal).replace("Rp", "").trim()}</span>
                                    <span className={cn("text-right font-mono", diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-slate-400")}>
                                      {formatCurrency(diff).replace("Rp", "").trim()}
                                    </span>
                                    <span className={cn("text-right font-mono text-[9px]", diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-slate-400")}>
                                      {compVal !== 0 ? `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%` : "-"}
                                    </span>
                                  </>
                                )}
                              </div>
                            );
                          })()}

                          {/* Beban Lain-lain */}
                          <div className="pl-2">
                            <h4 className="text-[12px] font-bold text-slate-900 mb-2 uppercase tracking-tight border-b border-slate-200 pb-0.5">BEBAN LAIN-LAIN</h4>
                            <div className="pl-2 space-y-0">
                              {data.filter(i => i.account_code.startsWith('531') && !isParentAccount(data, i.account_code))
                                .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                              {renderPLDetailGroupTotal("Jumlah Beban Lain-lain", "531", false, !!comparisonPeriod)}
                            </div>
                          </div>

                          {/* Penyusutan & Amortisasi */}
                          <div className="pl-2">
                            <h4 className="text-[12px] font-bold text-slate-900 mb-2 uppercase tracking-tight border-b border-slate-200 pb-0.5">BEBAN PENYUSUTAN DAN MARGIN PINJAMAN</h4>
                            <div className="pl-2 space-y-4">
                              <div>
                                <p className="text-[10px] font-bold text-slate-600 mb-0.5 uppercase tracking-tight">BEBAN PENYUSUTAN</p>
                                <div className="pl-2 space-y-0 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('541') && !isParentAccount(data, i.account_code))
                                    .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-600 mb-0.5 uppercase tracking-tight">BEBAN AMORTISASI</p>
                                <div className="pl-2 space-y-0 border-l border-slate-100">
                                  {data.filter(i => i.account_code.startsWith('542') && !isParentAccount(data, i.account_code))
                                    .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                                </div>
                              </div>
                              {(() => {
                                const val = getPLVal(data, "543");
                                const compVal = comparisonPeriod ? getPLVal(comparisonData, "543") : 0;
                                const diff = val - compVal;
                                const pct = compVal !== 0 ? (diff / Math.abs(compVal)) * 100 : 0;
                                return (
                                  <div className={cn("grid items-center text-[11px] px-2", comparisonPeriod ? "grid-cols-[1fr_100px_100px_100px_60px]" : "grid-cols-[1fr_120px]")}>
                                    <span className="text-slate-700 uppercase font-bold text-[10px]">Margin Pinjaman Kredit Investasi</span>
                                    <span className="text-right font-mono text-slate-900">{formatCurrency(val).replace("Rp", "").trim()}</span>
                                    {comparisonPeriod && (
                                      <>
                                        <span className="text-right font-mono text-slate-500">{formatCurrency(compVal).replace("Rp", "").trim()}</span>
                                        <span className={cn("text-right font-mono", diff < 0 ? "text-emerald-600" : diff > 0 ? "text-red-600" : "text-slate-400")}>
                                          {formatCurrency(diff).replace("Rp", "").trim()}
                                        </span>
                                        <span className={cn("text-right font-mono text-[9px]", diff < 0 ? "text-emerald-500" : diff > 0 ? "text-red-500" : "text-slate-400")}>
                                          {compVal !== 0 ? `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%` : "-"}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                );
                              })()}
                              {renderPLDetailGroupTotal("Total beban penyusutan dan Amortisasi", "54", false, !!comparisonPeriod)}
                            </div>
                          </div>

                          {/* Laba Bersih Sebelum Pajak */}
                          {(() => {
                            const val = getNetProfitBeforeTax(data);
                            const compVal = comparisonPeriod ? getNetProfitBeforeTax(comparisonData) : 0;
                            const diff = val - compVal;
                            const pct = compVal !== 0 ? (diff / Math.abs(compVal)) * 100 : 0;
                            return (
                              <div className={cn("grid items-center py-2 border-y-2 border-slate-900 font-bold text-[13px] uppercase tracking-wider bg-slate-100 px-2 text-slate-900 shadow-inner", comparisonPeriod ? "grid-cols-[1fr_100px_100px_100px_60px]" : "grid-cols-[1fr_120px]")}>
                                <span>LABA BERSIH SEBELUM PAJAK</span>
                                <span className="text-right font-mono">{formatCurrency(val).replace("Rp", "").trim()}</span>
                                {comparisonPeriod && (
                                  <>
                                    <span className="text-right font-mono text-slate-500">{formatCurrency(compVal).replace("Rp", "").trim()}</span>
                                    <span className={cn("text-right font-mono", diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-slate-400")}>
                                      {formatCurrency(diff).replace("Rp", "").trim()}
                                    </span>
                                    <span className={cn("text-right font-mono text-[9px]", diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-slate-400")}>
                                      {compVal !== 0 ? `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%` : "-"}
                                    </span>
                                  </>
                                )}
                              </div>
                            );
                          })()}

                          {/* Pajak */}
                          <div className="pl-2 space-y-0">
                            {data.filter(i => i.account_code.startsWith('611') && !isParentAccount(data, i.account_code))
                              .map(item => renderPLDetailRow(item, !!comparisonPeriod))}
                            {renderPLDetailGroupTotal("Total Taksiran Pajak", "611", false, !!comparisonPeriod)}
                          </div>

                          {/* Laba Bersih Setelah Pajak */}
                          {(() => {
                            const val = getFinalNetProfit(data);
                            const compVal = comparisonPeriod ? getFinalNetProfit(comparisonData) : 0;
                            const diff = val - compVal;
                            const pct = compVal !== 0 ? (diff / Math.abs(compVal)) * 100 : 0;
                            return (
                              <div className={cn("grid items-center py-3 border-y-4 border-double border-slate-900 font-bold text-[15px] uppercase tracking-widest bg-[#064E3B] text-white px-2 shadow-xl relative overflow-hidden", comparisonPeriod ? "grid-cols-[1fr_100px_100px_100px_60px]" : "grid-cols-[1fr_120px]")}>
                                <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none" />
                                <span>LABA BERSIH SETELAH PAJAK</span>
                                <span className="text-right font-mono">{formatCurrency(val).replace("Rp", "").trim()}</span>
                                {comparisonPeriod && (
                                  <>
                                    <span className="text-right font-mono text-white/70">{formatCurrency(compVal).replace("Rp", "").trim()}</span>
                                    <span className={cn("text-right font-mono", diff > 0 ? "text-emerald-300" : diff < 0 ? "text-red-300" : "text-white/50")}>
                                      {formatCurrency(diff).replace("Rp", "").trim()}
                                    </span>
                                    <span className={cn("text-right font-mono text-[10px]", diff > 0 ? "text-emerald-300" : diff < 0 ? "text-red-300" : "text-white/50")}>
                                      {compVal !== 0 ? `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%` : "-"}
                                    </span>
                                  </>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </section>
                    </div>
                  )}
                </div>

                <div className="mt-20 text-center italic text-slate-500 report-footer-note">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-8 grid grid-cols-2 gap-20 text-center text-xs font-bold signature-box">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="uppercase signature-space">Direktur</p>
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
                <div id="neraca-report" className="max-w-4xl mx-auto bg-white p-12 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:px-[1.5cm] print:py-8 print-report">
                  {/* Header */}
                  <div className="text-center mb-2">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">RSU MUHAMMADIYAH DARUL ISTIQOMAH KALIWUNGU</h2>
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">KABUPATEN KENDAL</h2>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mt-1">NERACA</h2>
                  <p className="text-slate-900 font-medium">
                    PER {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })().toUpperCase()}
                  </p>
                  <p className="italic text-slate-500 mt-0.5 disajikan-label">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[1fr_100px_200px] border-b-2 border-slate-900 pb-1 mb-1 font-bold text-xs uppercase tracking-widest">
                  <div>Keterangan</div>
                  <div className="text-center">Catatan</div>
                  <div className="text-right">{new Date(period + "-01").toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
                </div>

                <div className="space-y-1 text-sm">
                  {/* ASET SECTION */}
                  <section>
                    <h3 className="font-bold mb-0.5">ASET</h3>
                    <div className="pl-4 space-y-1">
                      {/* Aset Lancar */}
                      <div>
                        <h4 className="font-bold mb-0.5">Aset Lancar</h4>
                        <div className="pl-4 space-y-0.5">
                          {[
                            { label: "Kas dan Setara Kas", note: "3.1", val: getVal(data, "11101") + getVal(data, "11102") },
                            { label: "Investasi Jk Pendek", note: "3.2", val: getVal(data, "11103") },
                            { label: "Piutang Usaha", note: "3.3", val: getVal(data, "11201") },
                            { label: "Piutang Non Usaha", note: "3.4", val: getVal(data, "11202") },
                            { label: "Persediaan", note: "3.5", val: getVal(data, "113") },
                            { label: "Beban Dibayar Dimuka", note: "3.6", val: getVal(data, "114") + getVal(data, "115") + getVal(data, "116") },
                          ].map(item => (
                            <div key={item.label} className="grid grid-cols-[1fr_100px_200px] items-center">
                              <span className="text-slate-900">{item.label}</span>
                              <span className="text-center text-emerald-600 font-medium underline cursor-pointer report-note-col">{item.note}</span>
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
                          <span className="text-center report-note-col">3.7.</span>
                          <div />
                        </div>
                        <div className="pl-4 space-y-0 mt-0.5">
                          <h5 className="font-bold text-xs uppercase text-slate-900">Harga Perolehan</h5>
                          <div className="pl-4 space-y-0.5">
                            {[
                              { label: "Tanah", val: getVal(data, "121010000") },
                              { label: "Bangunan/Gedung", val: getVal(data, "121020000") },
                              { label: "Kendaraan", val: getVal(data, "121030000") },
                              { label: "Peralatan Medis", val: getVal(data, "121040000") },
                              { label: "Peralatan Non Medis", val: getVal(data, "121060000") },
                              { label: "Aset Dalam proses", val: getVal(data, "123010000") + getVal(data, "123020000") },
                            ].map(item => (
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
                        <span className="text-center report-note-col">3.8.</span>
                        <span className="text-right font-mono">{formatCurrency(getVal(data, "131")).replace("Rp", "").trim()}</span>
                      </div>

                      {/* Total Aset */}
                      <div className="grid grid-cols-[1fr_100px_200px] items-center pt-2 border-t-2 border-double border-slate-900 font-bold text-base">
                        <span className="uppercase tracking-widest">Jumlah Aset</span>
                        <div />
                        <span className="text-right font-mono border-b-4 border-double border-slate-900">{formatCurrency(getVal(data, "1")).replace("Rp", "").trim()}</span>
                      </div>
                    </div>
                  </section>

                  {/* KEWAJIBAN DAN EKUITAS SECTION */}
                  <section>
                    <h3 className="font-bold mb-0.5">KEWAJIBAN DAN EKUITAS</h3>
                    <div className="pl-4 space-y-1">
                      {/* Kewajiban */}
                      <div>
                        <h4 className="font-bold mb-0.5">KEWAJIBAN</h4>
                        <div className="pl-4 space-y-0.5">
                          {[
                            { label: "Kewajiban Jangka Pendek", note: "3.9.", val: getVal(data, "21", false) },
                            { label: "Kewajiban Jangka Panjang", note: "3.9.", val: getVal(data, "22", false) },
                          ].map(item => (
                            <div key={item.label} className="grid grid-cols-[1fr_100px_200px] items-center">
                              <span className="text-slate-900">{item.label}</span>
                              <span className="text-center report-note-col">{item.note}</span>
                              <span className="text-right font-mono">{formatCurrency(item.val).replace("Rp", "").trim()}</span>
                            </div>
                          ))}
                          <div className="grid grid-cols-[1fr_100px_200px] items-center pt-1 border-t border-slate-200 font-bold">
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
                          <span className="text-center report-note-col">3.10.</span>
                          <div />
                        </div>
                        <div className="pl-4 space-y-0.5 mt-1">
                          {[
                            { label: "Modal Persyarikatan", val: getVal(data, "311000000", false) },
                            { label: "Modal Wakaf", val: getVal(data, "312000000", false) },
                            { label: "Laba Tahun Lalu", val: getVal(data, "331000000", false) },
                            { label: "Laba Tahun Berjalan", val: getFinalNetProfit(ytdData) },
                          ].map(item => (
                            <div key={item.label} className="grid grid-cols-[1fr_100px_200px] items-center">
                              <span className="text-slate-900">{item.label}</span>
                              <div />
                              <span className="text-right font-mono">{formatCurrency(item.val).replace("Rp", "").trim()}</span>
                            </div>
                          ))}
                          <div className="grid grid-cols-[1fr_100px_200px] items-center pt-1 border-t border-slate-200 font-bold">
                            <span className="italic">Jumlah Ekuitas</span>
                            <div />
                            <span className="text-right font-mono">{formatCurrency(getVal(data, "31", false) + getVal(data, "331000000", false) + getFinalNetProfit(ytdData)).replace("Rp", "").trim()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Total Kewajiban & Ekuitas */}
                      <div className="grid grid-cols-[1fr_100px_200px] items-center pt-2 border-t-2 border-double border-slate-900 font-bold text-base">
                        <span className="uppercase tracking-widest">Jumlah Kewajiban dan Ekuitas</span>
                        <div />
                        <span className="text-right font-mono border-b-4 border-double border-slate-900">{formatCurrency(getVal(data, "2", false) + getVal(data, "31", false) + getVal(data, "331000000", false) + getFinalNetProfit(ytdData)).replace("Rp", "").trim()}</span>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="mt-40 text-center italic text-slate-500 report-footer-note neraca-print-note">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-16 grid grid-cols-2 gap-20 text-center text-xs font-bold signature-box neraca-print-signature">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="uppercase signature-space neraca-signature-space">Direktur</p>
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
                <div id="arus-kas-report" className="max-w-4xl mx-auto bg-white p-12 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:px-[1.5cm] print:py-8 print-report">
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
                  <p className="italic text-slate-500 mt-1 disajikan-label">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
                </div>

                <div className="space-y-8 text-sm">
                  {/* Aktivitas Operasional */}
                  <section>
                    <h3 className="font-bold mb-4">Arus Kas dari Aktivitas Operasional :</h3>
                      <div className="pl-4 space-y-2">
                        <div className="grid grid-cols-[1fr_200px] items-center">
                          <span>Laba Tahun Berjalan</span>
                          <span className="text-right font-mono">{formatCurrency(getFinalNetProfit(ytdData)).replace("Rp", "").trim()}</span>
                        </div>
                        
                        <div className="pl-4 space-y-1">
                          <>
                            <p className="italic text-xs">Penyesuaian untuk :</p>
                            <div className="grid grid-cols-[1fr_200px] items-center">
                              <span>Penyusutan Aset Tetap</span>
                              <span className="text-right font-mono">{formatCurrency(getPLVal(data, "541")).replace("Rp", "").trim()}</span>
                            </div>
                          </>
                        </div>

                        <div className="grid grid-cols-[1fr_200px] items-center font-bold pt-2 border-t border-slate-200">
                          <span>Laba sebelum perubahan modal Kerja</span>
                          <span className="text-right font-mono">{formatCurrency(getFinalNetProfit(ytdData) + getPLVal(data, "541")).replace("Rp", "").trim()}</span>
                        </div>

                        <div className="pl-4 space-y-1">
                          {[
                            { label: "Penurunan (Kenaikan) piutang usaha", val: getPrevVal("11201") - getVal(data, "11201") },
                            { label: "Penurunan (Kenaikan) piutang lain", val: getPrevVal("11202") - getVal(data, "11202") },
                            { label: "Penurunan (kenaikan) persediaan", val: getPrevVal("113") - getVal(data, "113") },
                            { label: "Penurunan (kenaikan) beban dibayar dimuka", val: (getPrevVal("114") + getPrevVal("115") + getPrevVal("116")) - (getVal(data, "114") + getVal(data, "115") + getVal(data, "116")) },
                            { label: "Penurunan (Kenaikan) kewajiban jangka pendek", val: getVal(data, "21", false) - getPrevVal("21", false) },
                          ].map(item => (
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
                          const val = getFinalNetProfit(ytdData) + getPLVal(data, "541") + 
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
                      ].map(item => (
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
                      ].map(item => (
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
                      const op = getFinalNetProfit(ytdData) + getPLVal(data, "541") + 
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
                      const akhir = getVal(data, "11101") + getVal(data, "11102");

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

                <div className="mt-20 text-center italic text-slate-500 report-footer-note">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-8 grid grid-cols-2 gap-20 text-center text-xs font-bold signature-box">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="uppercase signature-space">Direktur</p>
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
                <div id="ekuitas-report" className="max-w-6xl mx-auto bg-white p-12 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:px-[1.5cm] print:py-8 print-report">
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
                  <p className="italic text-slate-500 mt-1 disajikan-label">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
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
                      {(() => {
                        const [year, month] = period.split("-").map(Number);
                        
                        // --- TOP SECTION: PREVIOUS PERIOD ---
                        const prevMonthDate = new Date(year, month - 2, 1);
                        const prevMonthName = prevMonthDate.toLocaleDateString('id-ID', { month: 'long' });
                        const prevYear = prevMonthDate.getFullYear();
                        
                        const prevPrevMonthDate = new Date(year, month - 3, 1);
                        const prevPrevMonthName = prevPrevMonthDate.toLocaleDateString('id-ID', { month: 'long' });
                        const prevPrevYear = prevPrevMonthDate.getFullYear();
                        const lastDayPrevPrevMonth = new Date(year, month - 2, 0).getDate();

                        const getInitialOf = (dataset: TrialBalanceItem[], prefix: string, isAsset = true) => {
                          if (!dataset || dataset.length === 0) return 0;
                          return dataset
                            .filter(i => i.account_code.startsWith(prefix) && !isParentAccount(dataset, i.account_code))
                            .reduce((acc, i) => acc + (isAsset ? (i.initial_debit - i.initial_credit) : (i.initial_credit - i.initial_debit)), 0);
                        };

                        // 1. Saldo Awal Previous Period
                        const modalPersyarikatanStartPrev = getInitialOf(prevPeriodData, "311000000", false);
                        const modalWakafStartPrev = getInitialOf(prevPeriodData, "312000000", false);
                        const shuStartPrev = getInitialOf(prevPeriodData, "331000000", false);
                        const totalStartPrev = modalPersyarikatanStartPrev + modalWakafStartPrev + shuStartPrev;

                        // 2. Changes in Previous Period
                        const koreksiModalPersyarikatanPrev = getMutationVal(prevPeriodData, "311000000", false);
                        const koreksiModalWakafPrev = getMutationVal(prevPeriodData, "312000000", false);
                        const pembagianSHUPrev = getMutationVal(prevPeriodData, "331000000", false);
                        const labaBerjalanPrev = getFinalNetProfit(prevPeriodData);

                        // 3. Saldo Akhir Previous Period
                        const modalPersyarikatanEndPrev = getVal(prevPeriodData, "311000000", false);
                        const modalWakafEndPrev = getVal(prevPeriodData, "312000000", false);
                        const shuEndPrev = getVal(prevPeriodData, "331000000", false) + getFinalNetProfit(prevPeriodData);
                        const totalEndPrev = modalPersyarikatanEndPrev + modalWakafEndPrev + shuEndPrev;

                        // --- BOTTOM SECTION: CURRENT PERIOD ---
                        // 1. Saldo Awal Current Period
                        const modalPersyarikatanStartCurr = modalPersyarikatanEndPrev;
                        const modalWakafStartCurr = modalWakafEndPrev;
                        const shuStartCurr = shuEndPrev;
                        const totalStartCurr = totalEndPrev;

                        // 2. Changes in Current Period
                        const koreksiModalPersyarikatanCurr = getMutationVal(data, "311000000", false);
                        const koreksiModalWakafCurr = getMutationVal(data, "312000000", false);
                        const pembagianSHUCurr = getMutationVal(data, "331000000", false);
                        const labaBerjalanCurr = getFinalNetProfit(data);

                        // 3. Saldo Akhir Current Period
                        const modalPersyarikatanEndCurr = getVal(data, "311000000", false);
                        const modalWakafEndCurr = getVal(data, "312000000", false);
                        const shuEndCurr = getVal(data, "331000000", false) + getFinalNetProfit(data);
                        const totalEndCurr = modalPersyarikatanEndCurr + modalWakafEndCurr + shuEndCurr;

                        return (
                          <>
                            {/* TOP SECTION: PREVIOUS PERIOD */}
                            <tr className="font-bold bg-slate-50/50">
                              <td className="py-3 px-2">Saldo {lastDayPrevPrevMonth} {prevPrevMonthName} {prevPrevYear}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(modalPersyarikatanStartPrev).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(modalWakafStartPrev).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(shuStartPrev).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-right font-mono">{formatCurrency(totalStartPrev).replace("Rp", "").trim()}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Koreksi Modal / Laba tahun Lalu</td>
                              <td className="py-2 px-2 text-center font-mono">{koreksiModalPersyarikatanPrev !== 0 ? formatCurrency(koreksiModalPersyarikatanPrev).replace("Rp", "").trim() : "-"}</td>
                              <td className="py-2 px-2 text-center font-mono">{koreksiModalWakafPrev !== 0 ? formatCurrency(koreksiModalWakafPrev).replace("Rp", "").trim() : "-"}</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-right font-mono">{formatCurrency(koreksiModalPersyarikatanPrev + koreksiModalWakafPrev).replace("Rp", "").trim()}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Pembagian SHU</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono text-red-600">
                                {pembagianSHUPrev < 0 ? `(${formatCurrency(Math.abs(pembagianSHUPrev)).replace("Rp", "").trim()})` : (pembagianSHUPrev === 0 ? "-" : formatCurrency(pembagianSHUPrev).replace("Rp", "").trim())}
                              </td>
                              <td className="py-2 px-2 text-right font-mono text-red-600">
                                {pembagianSHUPrev < 0 ? `(${formatCurrency(Math.abs(pembagianSHUPrev)).replace("Rp", "").trim()})` : (pembagianSHUPrev === 0 ? "-" : formatCurrency(pembagianSHUPrev).replace("Rp", "").trim())}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Laba Tahun Berjalan</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">{labaBerjalanPrev !== 0 ? formatCurrency(labaBerjalanPrev).replace("Rp", "").trim() : "-"}</td>
                              <td className="py-2 px-2 text-right font-mono">{labaBerjalanPrev !== 0 ? formatCurrency(labaBerjalanPrev).replace("Rp", "").trim() : "-"}</td>
                            </tr>
                            <tr className="font-bold border-y border-slate-900 bg-slate-50/80">
                              <td className="py-3 px-2">Saldo 31 {prevMonthName} {prevYear}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(modalPersyarikatanEndPrev).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(modalWakafEndPrev).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(shuEndPrev).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-right font-mono">{formatCurrency(totalEndPrev).replace("Rp", "").trim()}</td>
                            </tr>

                            {/* BOTTOM SECTION: CURRENT PERIOD */}
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Koreksi Modal / Laba tahun Lalu</td>
                              <td className="py-2 px-2 text-center font-mono">{koreksiModalPersyarikatanCurr !== 0 ? formatCurrency(koreksiModalPersyarikatanCurr).replace("Rp", "").trim() : "-"}</td>
                              <td className="py-2 px-2 text-center font-mono">{koreksiModalWakafCurr !== 0 ? formatCurrency(koreksiModalWakafCurr).replace("Rp", "").trim() : "-"}</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-right font-mono">{formatCurrency(koreksiModalPersyarikatanCurr + koreksiModalWakafCurr).replace("Rp", "").trim()}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Pembagian SHU</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono text-red-600">
                                {pembagianSHUCurr < 0 ? `(${formatCurrency(Math.abs(pembagianSHUCurr)).replace("Rp", "").trim()})` : (pembagianSHUCurr === 0 ? "-" : formatCurrency(pembagianSHUCurr).replace("Rp", "").trim())}
                              </td>
                              <td className="py-2 px-2 text-right font-mono text-red-600">
                                {pembagianSHUCurr < 0 ? `(${formatCurrency(Math.abs(pembagianSHUCurr)).replace("Rp", "").trim()})` : (pembagianSHUCurr === 0 ? "-" : formatCurrency(pembagianSHUCurr).replace("Rp", "").trim())}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 pl-6 italic">Laba Tahun Berjalan</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">-</td>
                              <td className="py-2 px-2 text-center font-mono">{labaBerjalanCurr !== 0 ? formatCurrency(labaBerjalanCurr).replace("Rp", "").trim() : "-"}</td>
                              <td className="py-2 px-2 text-right font-mono">{labaBerjalanCurr !== 0 ? formatCurrency(labaBerjalanCurr).replace("Rp", "").trim() : "-"}</td>
                            </tr>
                            <tr className="font-bold border-y-2 border-slate-900 bg-emerald-50">
                              <td className="py-3 px-2">Saldo 31 {(() => {
                                const [year, month] = period.split("-").map(Number);
                                return new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                              })()} {period.split("-")[0]}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(modalPersyarikatanEndCurr).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(modalWakafEndCurr).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-center font-mono">{formatCurrency(shuEndCurr).replace("Rp", "").trim()}</td>
                              <td className="py-3 px-2 text-right font-mono">{formatCurrency(totalEndCurr).replace("Rp", "").trim()}</td>
                            </tr>
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="mt-20 text-center italic text-slate-500 report-footer-note">
                  Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                </div>

                {/* Footer Signatures */}
                <div className="mt-8 grid grid-cols-2 gap-20 text-center text-xs font-bold signature-box">
                  <div />
                  <div>
                    <p className="mb-1">Kendal, {(() => {
                      const [year, month] = period.split("-").map(Number);
                      const lastDay = new Date(year, month, 0).getDate();
                      const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
                      return `${lastDay} ${monthName} ${year}`;
                    })()}</p>
                    <p className="uppercase signature-space">Direktur</p>
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
                <div className="text-center mb-6">
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

                            const realYtd = getPLVal(ytdData, r.code, true); 
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

                                  const ytdChild = ytdData.find(y => y.account_code === child.account_code);
                                  const cRealYtd = ytdChild ? (ytdChild.final_credit - ytdChild.final_debit) : 0;
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

                          const realYtd = getRevenueTotal(ytdData);
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

                        {/* HPP SECTION */}
                        <tr 
                          className="bg-slate-50 font-bold cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => setExpandedGroups(prev => ({ ...prev, hpp: !prev.hpp }))}
                        >
                          <td colSpan={9} className="py-2 px-2 uppercase tracking-wider text-slate-700 text-[11px] flex items-center gap-2 mt-4 sticky left-0 bg-slate-50 z-10">
                            {expandedGroups.hpp ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            HARGA POKOK PELAYANAN PASIEN DAN BEBAN LANGSUNG
                          </td>
                        </tr>
                        {expandedGroups.hpp && (() => {
                          const month = parseInt(period.split("-")[1]);
                          const rows = [
                            { label: "HARGA POKOK PELAYANAN", code: "511" },
                            { label: "BEBAN LANGSUNG", code: "512" },
                            { label: "BEBAN JASA PELAYANAN", code: "513" },
                            { label: "PEMERIKSAAN KELUAR", code: "514" },
                          ];
                          
                          return rows.map(r => {
                            const real = getPLVal(data, r.code, false);
                            const budget = getBudgetVal(r.code, month);
                            const diff = budget - real;
                            const pct = budget !== 0 ? (real / budget) * 100 : 0;

                            const realYtd = getPLVal(ytdData, r.code, false);
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

                                  const ytdChild = ytdData.find(y => y.account_code === child.account_code);
                                  const cRealYtd = ytdChild ? (ytdChild.final_debit - ytdChild.final_credit) : 0;
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
                          const real = getHPPAndDirectExpense(data);
                          const budget = getBudgetTotal("51", month);
                          const diff = budget - real;
                          const pct = budget !== 0 ? (real / budget) * 100 : 0;

                          const realYtd = getHPPAndDirectExpense(ytdData);
                          const budgetYtd = Array.from({length: month}, (_, i) => getBudgetTotal("51", i + 1)).reduce((a, b) => a + b, 0);
                          const diffYtd = budgetYtd - realYtd;
                          const pctYtd = budgetYtd !== 0 ? (realYtd / budgetYtd) * 100 : 0;

                          return (
                            <tr className="bg-orange-50 font-bold border-y border-slate-200">
                              <td className="py-2 px-2 pl-4 sticky left-0 bg-orange-50 z-10">TOTAL HPP DAN BEBAN LANGSUNG</td>
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

                            const realYtd = getPLVal(ytdData, r.code, false);
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

                                  const ytdChild = ytdData.find(y => y.account_code === child.account_code);
                                  const cRealYtd = ytdChild ? (ytdChild.final_debit - ytdChild.final_credit) : 0;
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

                          const realYtd = getExpenseTotal(ytdData);
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
                          <td className="py-2.5 px-2 text-right font-mono">{formatCurrency(getNetProfitBeforeTax(ytdData)).replace("Rp", "").trim()}</td>
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
                              const realYtd = getNetProfitBeforeTax(ytdData);
                              const diffYtd = realYtd - budgetYtd;
                              return formatCurrency(diffYtd).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitBeforeTax(i + 1)).reduce((a, b) => a + b, 0);
                              const realYtd = getNetProfitBeforeTax(ytdData);
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
                          <td className="py-2.5 px-2 text-right font-mono">{formatCurrency(getTaxEstimation(ytdData)).replace("Rp", "").trim()}</td>
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
                              const realYtd = getTaxEstimation(ytdData);
                              const diffYtd = realYtd - budgetYtd;
                              return formatCurrency(diffYtd).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitBeforeTax(i + 1) * 0.22).reduce((a, b) => a + b, 0);
                              const realYtd = getTaxEstimation(ytdData);
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
                          <td className="py-3 px-2 text-right font-mono">{formatCurrency(getNetProfit(ytdData)).replace("Rp", "").trim()}</td>
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
                              const diffYtd = getNetProfit(ytdData) - budgetYtd;
                              return formatCurrency(diffYtd).replace("Rp", "").trim();
                            })()}
                          </td>
                          <td className="py-3 px-2 text-right font-mono">
                            {(() => {
                              const month = parseInt(period.split("-")[1]);
                              const budgetYtd = Array.from({length: month}, (_, i) => getBudgetNetProfitAfterTax(i + 1)).reduce((a, b) => a + b, 0);
                              const realYtd = getNetProfit(ytdData);
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

          {activeTab === "budget_absorption" && (
            <motion.div
              key="budget_absorption"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mt-2">LAPORAN SERAPAN ANGGARAN</h2>
                  <p className="text-slate-900 font-medium">
                    TAHUN ANGGARAN 2026
                  </p>
                </div>

                {(loading || (absorptionData.length === 0 && periods.length > 0)) ? (
                  <div className="py-24 flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 opacity-40" />
                    <p className="text-slate-900 font-medium italic">Menghitung serapan anggaran...</p>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Revenue Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-4">
                        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">REKENING PENDAPATAN</h3>
                      </div>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        {renderAbsorptionTable(absorptionData.filter(item => item.account_code.startsWith('4')))}
                      </div>
                    </div>

                    {/* Expense Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-l-4 border-red-500 pl-4">
                        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">REKENING BEBAN / BIAYA</h3>
                      </div>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        {renderAbsorptionTable(absorptionData.filter(item => item.account_code.startsWith('5')))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "profit_loss_monthly" && (
            <motion.div
              key="profit_loss_monthly"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">Laba Rugi Bulanan</h2>
                      <p className="text-sm text-slate-500 font-medium">Tahun {period.split("-")[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      <Printer className="w-4 h-4" />
                      Cetak Laporan
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-0 overflow-x-auto">
                {loadingMonthly ? (
                  <div className="py-24 flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 opacity-40" />
                    <p className="text-slate-900 font-medium italic">Menyusun laporan bulanan...</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-3 px-2 text-left font-bold text-slate-600 uppercase tracking-wider sticky left-0 bg-slate-50 z-20 border-r border-slate-200 min-w-[250px]">Keterangan</th>
                        {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"].map(m => (
                          <th key={m} className="py-3 px-2 text-right font-bold text-slate-600 uppercase tracking-wider border-r border-slate-100 min-w-[100px]">{m}</th>
                        ))}
                        <th className="py-3 px-2 text-right font-bold text-slate-900 uppercase tracking-wider bg-slate-100 min-w-[120px]">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* PENDAPATAN OPERASIONAL */}
                      <tr className="bg-slate-50/30">
                        <td colSpan={14} className="py-2 px-2 font-bold text-emerald-700 uppercase tracking-wide sticky left-0 bg-slate-50/30 z-10">I. PENDAPATAN OPERASIONAL</td>
                      </tr>
                      <MonthlyPLRow label="Pendapatan Rawat Inap" prefix="411" pl={1} />
                      <MonthlyPLRow label="Pendapatan Rawat Jalan" prefix="412" pl={1} />
                      <MonthlyPLRow label="Pendapatan Rawat Darurat" prefix="413" pl={1} />
                      <MonthlyPLRow label="Potongan Pendapatan" prefix="414" pl={1} isRevenue={true} />
                      <MonthlyPLRow label="Pendapatan Operasional Lain" prefix="42" pl={1} />
                      <MonthlyPLSummaryRow label="TOTAL PENDAPATAN OPERASIONAL" valFunc={getRevenueTotal} />

                      {/* BEBAN OPERASIONAL */}
                      <tr className="bg-slate-50/30">
                        <td colSpan={14} className="py-2 px-2 font-bold text-red-700 uppercase tracking-wide sticky left-0 bg-slate-50/30 z-10">II. BEBAN OPERASIONAL</td>
                      </tr>
                      <tr className="bg-slate-50/10">
                        <td colSpan={14} className="py-1 px-4 font-semibold text-slate-600 italic sticky left-0 bg-slate-50/10 z-10">A. Beban Langsung</td>
                      </tr>
                      <MonthlyPLRow label="Beban Bahan & Alat Kesehatan (HPP)" prefix="511" pl={2} isRevenue={false} />
                      <MonthlyPLRow label="Beban Langsung Lainnya" prefix="512" pl={2} isRevenue={false} />
                      <MonthlyPLRow label="Beban Jasa Pelayanan" prefix="513" pl={2} isRevenue={false} />
                      <MonthlyPLRow label="Beban Pemeriksaan Keluar" prefix="514" pl={2} isRevenue={false} />
                      <MonthlyPLSummaryRow label="TOTAL BEBAN LANGSUNG" valFunc={getHPPAndDirectExpense} isTotal={false} />

                      <MonthlyPLSummaryRow label="LABA KOTOR (GROSS PROFIT)" valFunc={getGrossProfit} />

                      <tr className="bg-slate-50/10">
                        <td colSpan={14} className="py-1 px-4 font-semibold text-slate-600 italic sticky left-0 bg-slate-50/10 z-10">B. Beban Tidak Langsung</td>
                      </tr>
                      <MonthlyPLRow label="Beban Personalia" prefix="52101" pl={2} isRevenue={false} />
                      <MonthlyPLRow label="Beban Administrasi" prefix="52102" pl={2} isRevenue={false} />
                      <MonthlyPLRow label="Beban Umum" prefix="52103" pl={2} isRevenue={false} />
                      <MonthlyPLSummaryRow label="TOTAL BEBAN TIDAK LANGSUNG" valFunc={getOperationalExpense} isTotal={false} />

                      <MonthlyPLSummaryRow label="LABA OPERASIONAL" valFunc={getOperationalProfit} />

                      {/* NON OPERASIONAL */}
                      <tr className="bg-slate-50/30">
                        <td colSpan={14} className="py-2 px-2 font-bold text-slate-700 uppercase tracking-wide sticky left-0 bg-slate-50/30 z-10">III. PENDAPATAN & BEBAN NON OPERASIONAL</td>
                      </tr>
                      <MonthlyPLRow label="Pendapatan Non Operasional" prefix="43" pl={1} />
                      <MonthlyPLRow label="Beban Non Operasional" prefix="53" pl={1} isRevenue={false} />
                      <MonthlyPLRow label="Beban Penyusutan & Amortisasi" prefix="54" pl={1} isRevenue={false} />
                      
                      <MonthlyPLSummaryRow label="LABA BERSIH SEBELUM PAJAK" valFunc={getNetProfitBeforeTax} />
                      
                      <MonthlyPLRow label="Taksiran Pajak Penghasilan" prefix="611" pl={1} isRevenue={false} />
                      
                      <MonthlyPLSummaryRow label="LABA BERSIH SETELAH PAJAK" valFunc={getFinalNetProfit} />
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "earning_akumulatif" && (
            <motion.div
              key="earning_akumulatif"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">Perhitungan EBITDA & EAT Tahunan</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                  </div>
                </div>
              </div>

              <div className="p-0 overflow-x-auto">
                {loadingMonthly ? (
                  <div className="py-24 flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 opacity-40" />
                    <p className="text-slate-900 font-medium italic">Menghitung earning bulanan...</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="py-3 px-4 text-left font-bold uppercase tracking-wider sticky left-0 bg-slate-900 z-20 border-r border-white/10 min-w-[220px]">Keterangan</th>
                        {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"].map(m => (
                          <th key={m} className="py-3 px-2 text-right font-bold uppercase tracking-wider border-r border-white/10 min-w-[100px]">{m}</th>
                        ))}
                        <th className="py-3 px-2 text-right font-bold uppercase tracking-wider bg-emerald-800 min-w-[120px] border-r border-white/10">Realisasi YTD</th>
                        <th className="py-3 px-2 text-right font-bold uppercase tracking-wider bg-blue-800 min-w-[120px]">RKAPB {period.split("-")[0]}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                        const selectedMonth = parseInt(period.split("-")[1]);
                        
                        const monthlyMetrics = months.map(m => {
                          const dataset = getMonthlyDataset(m);
                          const opRevenue = dataset
                            .filter(i => (i.account_code.startsWith('41') || i.account_code.startsWith('42')) && !isParentAccount(dataset, i.account_code))
                            .reduce((acc, i) => acc + (i.final_credit - i.final_debit), 0);
                          const otherRevenue = dataset
                            .filter(i => i.account_code.startsWith('43') && !isParentAccount(dataset, i.account_code))
                            .reduce((acc, i) => acc + (i.final_credit - i.final_debit), 0);
                          const revenue = opRevenue + otherRevenue;
                          
                          const hpp = getHPPAndDirectExpense(dataset);
                          const grossProfit = revenue - hpp;
                          const opEx = getOperationalExpense(dataset);
                          const ebitda = grossProfit - opEx;
                          
                          const otherEx = getOtherExpenseTotal(dataset);
                          const depr = getDepreciationAndAmortization(dataset);
                          const ebt = ebitda - otherEx - depr;
                          const tax = getTaxEstimation(dataset);
                          const eat = ebt - tax;
                          
                          return { opRevenue, otherRevenue, revenue, hpp, grossProfit, opEx, ebitda, otherEx, depr, ebt, tax, eat };
                        });

                        const totalReal = monthlyMetrics.slice(0, selectedMonth).reduce((acc, curr) => ({
                          opRevenue: acc.opRevenue + curr.opRevenue,
                          otherRevenue: acc.otherRevenue + curr.otherRevenue,
                          revenue: acc.revenue + curr.revenue,
                          hpp: acc.hpp + curr.hpp,
                          grossProfit: acc.grossProfit + curr.grossProfit,
                          opEx: acc.opEx + curr.opEx,
                          ebitda: acc.ebitda + curr.ebitda,
                          otherEx: acc.otherEx + curr.otherEx,
                          depr: acc.depr + curr.depr,
                          ebt: acc.ebt + curr.ebt,
                          tax: acc.tax + curr.tax,
                          eat: acc.eat + curr.eat
                        }), { opRevenue: 0, otherRevenue: 0, revenue: 0, hpp: 0, grossProfit: 0, opEx: 0, ebitda: 0, otherEx: 0, depr: 0, ebt: 0, tax: 0, eat: 0 });

                        const budgetMetrics = months.map(m => {
                          const opRevenue = getBudgetTotal('41', m) + getBudgetTotal('42', m);
                          const otherRevenue = getBudgetTotal('43', m);
                          const revenue = opRevenue + otherRevenue;
                          const hpp = getBudgetTotal('51', m);
                          const grossProfit = revenue - hpp;
                          const opEx = getBudgetTotal('52101', m) + getBudgetTotal('52102', m) + getBudgetTotal('52103', m);
                          const ebitda = grossProfit - opEx;
                          const otherEx = getBudgetTotal('531', m);
                          const depr = getBudgetTotal('541', m) + getBudgetTotal('542', m) + getBudgetTotal('543', m);
                          const ebt = ebitda - otherEx - depr;
                          const tax = getBudgetNetProfitBeforeTax(m) * 0.22;
                          const eat = ebt - tax;
                          return { opRevenue, otherRevenue, revenue, hpp, grossProfit, opEx, ebitda, otherEx, depr, ebt, tax, eat };
                        });

                        const totalBudget = budgetMetrics.reduce((acc, curr) => ({
                          opRevenue: acc.opRevenue + curr.opRevenue,
                          otherRevenue: acc.otherRevenue + curr.otherRevenue,
                          revenue: acc.revenue + curr.revenue,
                          hpp: acc.hpp + curr.hpp,
                          grossProfit: acc.grossProfit + curr.grossProfit,
                          opEx: acc.opEx + curr.opEx,
                          ebitda: acc.ebitda + curr.ebitda,
                          otherEx: acc.otherEx + curr.otherEx,
                          depr: acc.depr + curr.depr,
                          ebt: acc.ebt + curr.ebt,
                          tax: acc.tax + curr.tax,
                          eat: acc.eat + curr.eat
                        }), { opRevenue: 0, otherRevenue: 0, revenue: 0, hpp: 0, grossProfit: 0, opEx: 0, ebitda: 0, otherEx: 0, depr: 0, ebt: 0, tax: 0, eat: 0 });

                        const rows = [
                          { label: "1. Pendapatan Operasional", key: 'opRevenue', isBold: false },
                          { label: "2. Pendapatan Non Operasional", key: 'otherRevenue', isBold: false },
                          { label: "3. Total Pendapatan (1+2)", key: 'revenue', isBold: true },
                          { label: "4. Beban Langsung (HPP)", key: 'hpp', isBold: false },
                          { label: "5. Gross Profit (3-4)", key: 'grossProfit', isBold: true },
                          { label: "6. Beban Operasional", key: 'opEx', isBold: false },
                          { label: "7. EBITDA (5-6)", key: 'ebitda', isBold: true, isHighlight: true },
                          { label: "8. Beban Non Operasional", key: 'otherEx', isBold: false },
                          { label: "9. Penyusutan & Amortisasi", key: 'depr', isBold: false },
                          { label: "10. EBT (7-8-9)", key: 'ebt', isBold: true },
                          { label: "11. Taksiran Pajak", key: 'tax', isBold: false },
                          { label: "12. EAT (10-11)", key: 'eat', isBold: true, isHighlight: true },
                          { label: "Prosentase EBITDA Atas Pendapatan", key: 'ebitdaMargin', isPercent: true },
                          { label: "Prosentase EAT Atas Pendapatan", key: 'eatMargin', isPercent: true },
                        ];

                        return rows.map((row, idx) => (
                          <tr key={idx} className={cn("hover:bg-slate-50 transition-colors", row.isHighlight && "bg-emerald-50/30")}>
                            <td className={cn(
                              "py-3 px-4 sticky left-0 z-10 border-r border-slate-100",
                              row.isBold ? "font-bold text-slate-900" : "text-slate-600",
                              row.isHighlight ? "bg-emerald-50/30" : "bg-white"
                            )}>
                              {row.label}
                            </td>
                            {monthlyMetrics.map((m, i) => {
                              let val = 0;
                              if (row.isPercent) {
                                const base = m.revenue;
                                const target = row.key === 'ebitdaMargin' ? m.ebitda : m.eat;
                                val = base !== 0 ? (target / base) * 100 : 0;
                              } else {
                                val = m[row.key as keyof typeof m];
                              }
                              return (
                                <td key={i} className={cn(
                                  "py-3 px-2 text-right font-mono border-r border-slate-50",
                                  row.isHighlight && "text-emerald-700 font-bold",
                                  (i + 1) === selectedMonth && "bg-amber-50/50"
                                )}>
                                  {row.isPercent ? (val !== 0 ? val.toFixed(1) + "%" : "-") : (val !== 0 ? formatCurrency(val).replace("Rp", "").trim() : "-")}
                                </td>
                              );
                            })}
                            {/* Realisasi YTD */}
                            <td className={cn(
                              "py-3 px-2 text-right font-mono font-bold bg-emerald-50 border-r border-emerald-100",
                              row.isHighlight ? "text-emerald-800" : "text-emerald-700"
                            )}>
                              {row.isPercent ? (
                                (() => {
                                  const base = totalReal.revenue;
                                  const target = row.key === 'ebitdaMargin' ? totalReal.ebitda : totalReal.eat;
                                  const val = base !== 0 ? (target / base) * 100 : 0;
                                  return val !== 0 ? val.toFixed(1) + "%" : "-";
                                })()
                              ) : (
                                totalReal[row.key as keyof typeof totalReal] !== 0 ? formatCurrency(totalReal[row.key as keyof typeof totalReal]).replace("Rp", "").trim() : "-"
                              )}
                            </td>
                            {/* RKAPB 2026 */}
                            <td className={cn(
                              "py-3 px-2 text-right font-mono font-bold bg-blue-50 text-blue-700",
                            )}>
                              {row.isPercent ? (
                                (() => {
                                  const base = totalBudget.revenue;
                                  const target = row.key === 'ebitdaMargin' ? totalBudget.ebitda : totalBudget.eat;
                                  const val = base !== 0 ? (target / base) * 100 : 0;
                                  return val !== 0 ? val.toFixed(1) + "%" : "-";
                                })()
                              ) : (
                                totalBudget[row.key as keyof typeof totalBudget] !== 0 ? formatCurrency(totalBudget[row.key as keyof typeof totalBudget]).replace("Rp", "").trim() : "-"
                              )}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
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
                      <p className="italic text-slate-500 mt-1 disajikan-label">(Disajikan dalam Rupiah penuh, kecuali dinyatakan lain)</p>
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
                          onClick={() => handleSyncAllSheets()}
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

                  <div className="mt-20 text-center italic text-slate-500 report-footer-note">
                    Lihat catatan atas Laporan keuangan yang merupakan bagian yang tidak terpisahkan dari laporan keuangan secara keseluruhan
                  </div>

                  {/* Footer Signatures */}
                  <div className="mt-8 grid grid-cols-2 gap-20 text-center text-xs font-bold signature-box">
                    <div />
                    <div>
                      <p className="mb-1">Kendal, 31 Desember 2026</p>
                      <p className="uppercase signature-space">Direktur</p>
                      <p className="underline">dr M. Arif Rida, M.M.R</p>
                      <p className="font-normal">NBM. 1108 7910 1075945</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isPinModalOpen && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden"
                >
                  <div className="bg-[#064E3B] p-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">Verifikasi PIN</h3>
                    </div>
                    <button onClick={() => { setIsPinModalOpen(false); setPinInput(""); setPinError(false); }} className="text-white/60 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handlePinSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">Masukkan PIN Akses</label>
                        <input 
                          type="password" 
                          value={pinInput}
                          onChange={(e) => setPinInput(e.target.value)}
                          placeholder="••••••••"
                          autoFocus
                          className={cn(
                            "w-full px-4 py-3 bg-slate-50 border rounded-xl text-center text-lg font-mono tracking-[0.5em] focus:ring-2 outline-none transition-all",
                            pinError ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-emerald-500"
                          )}
                        />
                        {pinError && (
                          <p className="mt-2 text-[10px] text-red-500 text-center font-bold">PIN yang Anda masukkan salah!</p>
                        )}
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-widest"
                      >
                        Buka Pengaturan
                      </button>
                    </form>
                  </div>
                </motion.div>
              </div>
            )}

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
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Database</span>
                      </div>
                      <p className="text-[10px] text-emerald-700/70 mb-3 leading-relaxed">
                        Akses langsung ke database
                      </p>
                      <a 
                        href="https://docs.google.com/spreadsheets/d/1_EEpePM6YkogIWcS6TBKbVnmJeBP2TuKCKtNVuPQCVQ/edit?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-all shadow-sm"
                      >
                        <LinkIcon className="w-3 h-3" />
                        Go To Dbase
                      </a>
                    </div>

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
            <footer className="bg-slate-50 border-t border-slate-200 py-4 px-6 no-print">
              <p className="text-center text-[10px] text-slate-400 italic">
                Financial Report - RSDI Kendal - copyright @IT.RSDI - Hak Cipta Milik Allah Semata
              </p>
            </footer>
          </main>
        </div>
      </div>
    );
}
