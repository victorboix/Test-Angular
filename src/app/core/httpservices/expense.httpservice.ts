import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { Expense, Expenses } from "../models/expense.model";
import { Nature, NatureRestaurant, NatureTrip } from "../models/nature.model";

@Injectable({ providedIn: "root" })
export class ExpenseHttpService {
  http = inject(HttpClient);

  gGetExpenses(): Observable<Expenses> {
    return this.http.get<any>("http://localhost:3000/expenses").pipe(
      map((data) => {
        const expenses = new Array<Expense>();

        data.items.forEach((item: any) => {
          expenses.push(<Expense>{
            id: item.id,
            nature: this.getNatureFromItem(item),
            amount: item.amount,
            comment: item.comment,
            purchasedOn: item.purchasedOn,
            updatedAt: item.updatedAt,
          });
        });

        return <Expenses>{
          expenses: expenses,
          count: data.count,
        };
      }),
    );
  }

  gGetExpensesByPageAndLimit(
    page: number,
    limit: number,
  ): Observable<Expenses> {
    return this.http
      .get<any>("http://localhost:3000/expenses", {
        params: {
          page: page,
          limit: limit,
        },
      })
      .pipe(
        map((data) => {
          const expenses = new Array<Expense>();

          data.items.forEach((item: any) => {
            expenses.push(<Expense>{
              id: item.id,
              nature: this.getNatureFromItem(item),
              amount: item.amount,
              comment: item.comment,
              purchasedOn: item.purchasedOn,
              updatedAt: item.updatedAt,
            });
          });

          return <Expenses>{
            expenses: expenses,
            count: data.count,
          };
        }),
      );
  }

  gGetExpenseById(id: number): Observable<Expense> {
    return this.http.get<any>("http://localhost:3000/expenses/" + id).pipe(
      map((data) => {
        return <Expense>{
          id: data.id,
          nature: this.getNatureFromItem(data),
          amount: data.amount,
          comment: data.comment,
          purchasedOn: data.purchasedOn,
          updatedAt: data.updatedAt,
        };
      }),
    );
  }

  pPostExpense(expense: Expense): Observable<any> {
    let body = {};

    if (expense.nature instanceof NatureTrip) {
      body = {
        nature: expense.nature.type,
        amount: expense.amount,
        comment: expense.comment,
        purchasedOn: expense.purchasedOn,
        distance: expense.nature.distance,
      };
    } else if (expense.nature instanceof NatureRestaurant) {
      body = {
        nature: expense.nature.type,
        amount: expense.amount,
        comment: expense.comment,
        purchasedOn: expense.purchasedOn,
        invites: expense.nature.invites,
      };
    }

    return this.http.post<any>("http://localhost:3000/expenses", body).pipe(
      map((data) => {
        return data;
      }),
    );
  }

  pPutExpense(expense: Expense): Observable<any> {
    let body = {};

    if (expense.nature instanceof NatureTrip) {
      body = {
        id: expense.id,
        nature: expense.nature.type,
        amount: expense.amount,
        comment: expense.comment,
        purchasedOn: expense.purchasedOn,
        distance: expense.nature.distance,
      };
    } else if (expense.nature instanceof NatureRestaurant) {
      body = {
        id: expense.id,
        nature: expense.nature.type,
        amount: expense.amount,
        comment: expense.comment,
        purchasedOn: expense.purchasedOn,
        invites: expense.nature.invites,
      };
    }

    return this.http
      .put<any>("http://localhost:3000/expenses/" + expense.id, body)
      .pipe(
        map((data) => {
          return data;
        }),
      );
  }

  private getNatureFromItem(item: any): Nature {
    switch (item.nature) {
      case "trip": {
        return new NatureTrip(item.distance);
      }
      case "restaurant": {
        return new NatureRestaurant(item.invites);
      }
      default: {
        return <Nature>{ lib: item.nature, type: item.nature };
      }
    }
  }
}
