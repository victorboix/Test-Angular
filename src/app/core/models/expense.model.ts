import { Nature } from "./nature.model";

export interface Expenses {
  expenses: Array<Expense>;
  count: number;
}

export interface Expense {
  id: number;
  nature: Nature;
  amount: number;
  comment: string;
  purchasedOn: string;
  updatedAt: string;
}
