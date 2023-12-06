import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ExpenseService } from "../../core/services/expense.service";
import { Expense } from "../../core/models/expense.model";
import {
  Nature,
  NatureRestaurant,
  NatureTrip,
} from "../../core/models/nature.model";
import { PaginationParamsModel } from "../../core/models/pagination.model";
import { RouteService } from "../../core/services/route.service";

@Component({ templateUrl: "expenses.page.html" })
export class ExpensesComponent implements OnInit {
  route = inject(ActivatedRoute);
  expenseService = inject(ExpenseService);
  routeService = inject(RouteService);

  expenses = this.expenseService.expenses;
  paginationParamsModel?: PaginationParamsModel;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.paginationParamsModel = new PaginationParamsModel(params);
      this.getExpenses();
    });
  }

  getExpenses() {
    this.expenseService.getExpensesByPageAndLimit(
      this.paginationParamsModel!.page,
      this.paginationParamsModel!.itemCountPage,
    );
  }

  getInvites(nature: Nature): string {
    if (nature instanceof NatureRestaurant) {
      return nature.invites.toString();
    } else {
      return "-";
    }
  }

  getDistance(nature: Nature): string {
    if (nature instanceof NatureTrip) {
      return nature.distance.toString();
    } else {
      return "-";
    }
  }

  onChangePage(event: number) {
    this.paginationParamsModel!.page = event;
    this.getExpenses();
  }

  onChangeItemCountPage(event: number) {
    this.paginationParamsModel!.itemCountPage = event;
    this.getExpenses();
  }

  routeToExpenseUpdate(expense: Expense) {
    this.routeService.routeToExpenseUpdate(
      this.paginationParamsModel!.page,
      this.paginationParamsModel!.itemCountPage,
      expense.id,
    );
  }

  routeToExpenseAdd() {
    this.routeService.routeToExpenseUpdate(
      this.paginationParamsModel!.page,
      this.paginationParamsModel!.itemCountPage,
    );
  }
}
