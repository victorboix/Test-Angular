import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ExpenseService } from "../../core/services/expense.service";
import { Expense } from "../../core/models/expense.model";
import { NatureRestaurant, NatureTrip } from "../../core/models/nature.model";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NumberValidators } from "../../core/validators/number.validator";
import { PaginationParamsModel } from "../../core/models/pagination.model";
import { RouteService } from "../../core/services/route.service";

@Component({
  templateUrl: "expense-update.page.html",
})
export class ExpenseUpdateComponent implements OnInit {
  routeService = inject(RouteService);
  route = inject(ActivatedRoute);
  expenseService = inject(ExpenseService);
  formBuilder = inject(UntypedFormBuilder);

  expense: Expense;

  expenseForm: UntypedFormGroup;

  paginationParamsModel?: PaginationParamsModel;

  isUpdate = false;

  saveError?: string;

  constructor() {
    this.expense = this.expenseService.getEmptyExpense();

    this.expenseForm = this.formBuilder.group({
      id: [{ value: "", disabled: true }],
      amount: [
        "",
        [
          Validators.required,
          Validators.min(1),
          NumberValidators.isANumberValidate(),
        ],
      ],
      purchasedOn: ["", Validators.required],
      comment: ["", Validators.required],
      nature: ["", Validators.required],
      distance: [""],
      invites: [""],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.paginationParamsModel = new PaginationParamsModel(params);

      if (this.paginationParamsModel.id) {
        this.isUpdate = true;
        this.getExpense(params["id"]);
      }
    });

    this.fExpense["nature"].valueChanges.subscribe((v) => {
      if (this.expense.nature instanceof NatureTrip) {
        this.fExpense["distance"].setValue(this.expense.nature.distance);
        this.fExpense["distance"].setValidators([
          Validators.required,
          Validators.min(1),
          NumberValidators.isANumberValidate(),
        ]);
      } else if (this.expense.nature instanceof NatureRestaurant) {
        this.fExpense["invites"].setValue(this.expense.nature.invites);
        this.fExpense["invites"].setValidators([
          Validators.required,
          Validators.min(0),
          NumberValidators.isANumberValidate(),
        ]);
      }

      switch (v) {
        case "trip": {
          this.expense.nature = new NatureTrip(this.fExpense["distance"].value);
          break;
        }
        case "restaurant": {
          this.expense.nature = new NatureRestaurant(
            this.fExpense["invites"].value,
          );
          break;
        }
      }

      this.setExpenseNatureControls();
    });
  }

  get fExpense() {
    return this.expenseForm.controls;
  }

  getExpense(id: number) {
    this.expenseService.getExpenseById(id);

    this.expenseService.sExpense.subscribe((expense) => {
      this.expense = expense;
      this.setExpenseForm();
    });
  }

  setExpenseForm() {
    this.fExpense["id"].setValue(this.expense.id);
    this.fExpense["amount"].setValue(this.expense.amount);
    this.fExpense["purchasedOn"].setValue(this.expense.purchasedOn);
    this.fExpense["comment"].setValue(this.expense.comment);
    this.fExpense["nature"].setValue(this.expense.nature.type);
  }

  setExpenseNatureControls() {
    this.fExpense["distance"].clearValidators();
    this.fExpense["invites"].clearValidators();

    if (this.expense.nature instanceof NatureTrip) {
      this.fExpense["distance"].setValue(this.expense.nature.distance);
      this.fExpense["distance"].setValidators([
        Validators.required,
        Validators.min(1),
        NumberValidators.isANumberValidate(),
      ]);
    } else if (this.expense.nature instanceof NatureRestaurant) {
      this.fExpense["invites"].setValue(this.expense.nature.invites);
      this.fExpense["invites"].setValidators([
        Validators.required,
        Validators.min(0),
        NumberValidators.isANumberValidate(),
      ]);
    }

    this.fExpense["distance"].updateValueAndValidity();
    this.fExpense["invites"].updateValueAndValidity();
  }

  saveExpense() {
    this.saveError = undefined;

    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
    } else {
      this.updateExpenseWithFormValues();

      if (this.isUpdate) {
        this.expenseService.putExpense(this.expense);
      } else {
        this.expenseService.postExpense(this.expense);
      }

      this.expenseService.sExpenseUpdated.subscribe({
        next: () => {
          if (this.isUpdate) {
            this.routeService.routeToExpenses(
              this.paginationParamsModel!.page,
              this.paginationParamsModel!.itemCountPage,
            );
          } else {
            this.routeService.routeToExpenses(
              1,
              this.paginationParamsModel!.itemCountPage,
            );
          }
        },
        error: (error: string) => {
          this.saveError = error;
        },
      });
    }
  }

  updateExpenseWithFormValues() {
    this.expense.id = this.fExpense["id"].value;
    this.expense.amount = this.fExpense["amount"].value;
    this.expense.purchasedOn = this.fExpense["purchasedOn"].value;
    this.expense.comment = this.fExpense["comment"].value;

    if (this.expense.nature instanceof NatureTrip) {
      this.expense.nature.distance = this.fExpense["distance"].value;
    } else if (this.expense.nature instanceof NatureRestaurant) {
      this.expense.nature.invites = this.fExpense["invites"].value;
    }
  }

  cancelUpdate() {
    this.routeService.routeToExpenses(
      this.paginationParamsModel!.page,
      this.paginationParamsModel!.itemCountPage,
    );
  }
}
