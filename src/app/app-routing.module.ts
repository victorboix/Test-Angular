import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ExpenseUpdateComponent } from "./pages/expense-update/expense-update.page";
import { ExpensesComponent } from "./pages/expenses/expenses.page";

export const routes: Routes = [
  { path: "expenses/:page", component: ExpensesComponent },
  { path: "expenses/:page/:itemCountPage", component: ExpensesComponent },
  { path: "expenses", component: ExpensesComponent },
  {
    path: "expense/update/:page/:itemCountPage/:id",
    component: ExpenseUpdateComponent,
  },
  {
    path: "expense/update/:page/:itemCountPage",
    component: ExpenseUpdateComponent,
  },
  { path: "", redirectTo: "expenses", pathMatch: "full" },
  { path: "**", redirectTo: "expenses" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
