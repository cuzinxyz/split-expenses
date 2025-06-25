// Định nghĩa type dùng chung cho toàn bộ project
export type Participant = {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
};

export type Transaction = {
  from: string;
  to: string;
  amount: number;
};
