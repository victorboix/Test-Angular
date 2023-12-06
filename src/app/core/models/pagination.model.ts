import { Params } from "@angular/router";

export class PaginationParamsModel {
  page: number;
  itemCountPage: number;
  id?: number;

  constructor(params: Params) {
    if (params["page"]) {
      this.page = Number(params["page"]);
    } else {
      this.page = 1;
    }

    if (params["itemCountPage"]) {
      this.itemCountPage = Number(params["itemCountPage"]);
    } else {
      this.itemCountPage = 20;
    }

    if (params["id"]) {
      this.id = Number(params["id"]);
    }
  }
}
