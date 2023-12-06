import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { ExpensesComponent } from "./pages/expenses/expenses.page";
import { HttpClientModule } from "@angular/common/http";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { ExpenseUpdateComponent } from "./pages/expense-update/expense-update.page";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    ExpensesComponent,
    PaginationComponent,
    ExpenseUpdateComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
