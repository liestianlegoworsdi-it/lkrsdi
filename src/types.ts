export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}

export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED"
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category_id: number;
  type: 'income' | 'expense';
  category_name?: string;
  category_color?: string;
  category_icon?: string;
}

export interface Summary {
  total_income: number;
  total_expense: number;
  balance: number;
}
