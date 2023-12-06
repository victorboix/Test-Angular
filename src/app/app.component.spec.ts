import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { AppRoutingModule, routes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ExpenseUpdateComponent } from "./pages/expense-update/expense-update.page";
import { ExpensesComponent } from "./pages/expenses/expenses.page";

describe("AppComponent", () => {
  let router: Router;
  let location: Location;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, RouterTestingModule.withRoutes(routes)],
      declarations: [AppComponent, ExpenseUpdateComponent, ExpensesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  });

  it("should create the app", () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Test-Front' title`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual("Test-Front");
  });

  it(`should route to '/expenses' if navigate to ''`, fakeAsync(() => {
    router.navigate([""]);
    tick();
    expect(location.path()).toBe("/expenses");
  }));

  it(`should route to '/expenses' if navigate to '**'`, fakeAsync(() => {
    router.navigate(["test"]);
    tick();
    expect(location.path()).toBe("/expenses");
  }));
});
