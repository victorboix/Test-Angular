import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class RouteService {
  router = inject(Router);

  routeToDefault() {
    this.router.navigateByUrl("/expenses");
  }

  routeToExpenses(page: number, itemCountPage: number) {
    this.router.navigateByUrl("/expenses/" + page + "/" + itemCountPage);
  }

  routeToExpenseUpdate(page: number, itemCountPage: number, id?: number) {
    let route = "/expense/update/" + page + "/" + itemCountPage;

    if (id) {
      route += "/" + id;
    }

    this.router.navigateByUrl(route);
  }
}
