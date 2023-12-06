import { inject, Injectable, signal } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { ExpenseHttpService } from "../httpservices/expense.httpservice";
import { Expense, Expenses } from "../models/expense.model";
import { Nature } from "../models/nature.model";
import { RouteService } from "./route.service";

@Injectable({ providedIn: "root" })
export class ExpenseService {
  routeService = inject(RouteService);
  expenseHttpService = inject(ExpenseHttpService);

  sExpense: BehaviorSubject<Expense>;
  sExpenseUpdated: Subject<Expense>;

  expenses = signal(<Expenses>{
    expenses: new Array<Expense>(),
    count: 0,
  });

  constructor() {
    this.sExpense = new BehaviorSubject<Expense>(this.getEmptyExpense());
    this.sExpenseUpdated = new Subject<Expense>();
  }

  getExpensesByPageAndLimit(page: number, limit: number) {
    this.expenseHttpService.gGetExpensesByPageAndLimit(page, limit).subscribe({
      next: (expenses: Expenses) => {
        if (expenses.expenses.length <= 0 && expenses.count > 0) {
          //on appele une page qui n'existe pas à l'api, alors on reviens sur la page par défaut pour ne pas afficher une liste vide
          this.routeService.routeToDefault();
        }
        this.expenses.set(expenses);
      },
      error: () => {
        this.routeService.routeToDefault();
      },
    });
  }

  getExpenseById(id: number) {
    this.expenseHttpService.gGetExpenseById(id).subscribe({
      next: (expense: Expense) => {
        this.sExpense.next(expense);
      },
      error: () => {
        this.routeService.routeToDefault();
      },
    });
  }

  putExpense(expense: Expense) {
    this.expenseHttpService.pPutExpense(expense).subscribe((expense) => {
      this.sExpenseUpdated.next(expense);
    });
  }

  postExpense(expense: Expense) {
    this.expenseHttpService.pPostExpense(expense).subscribe((expense) => {
      this.sExpenseUpdated.next(expense);
    });
  }

  getEmptyExpense(): Expense {
    return <Expense>{
      id: -1,
      nature: <Nature>{ lib: "", type: "" },
      amount: 0,
      comment: "",
      purchasedOn: "",
      updatedAt: "",
    };
  }
}
