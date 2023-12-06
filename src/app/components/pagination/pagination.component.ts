import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";

@Component({
  templateUrl: "pagination.components.html",
  selector: "app-pagination",
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() Page!: number;
  @Input() ItemCountAll!: number;
  @Input() ItemCountPage!: number;
  @Output() pageChangeEvent = new EventEmitter<number>();
  @Output() itemCountPageChangeEvent = new EventEmitter<number>();

  formBuilder = inject(UntypedFormBuilder);

  paginationForm: UntypedFormGroup;

  pages: Array<number> = new Array<number>();

  listCount = [10, 20, 50, 100];

  constructor() {
    this.paginationForm = this.formBuilder.group({
      page: [""],
      itemCountPage: [""],
    });
  }

  ngOnInit() {
    this.setPages();
  }

  ngOnChanges() {
    this.setPages();
  }

  get fPagination() {
    return this.paginationForm.controls;
  }
  get cPage() {
    return this.fPagination["page"];
  }
  get cItemCountPage() {
    return this.fPagination["itemCountPage"];
  }

  setPages() {
    this.pages = new Array<number>();
    for (
      let i = 1;
      i <= Math.ceil(this.ItemCountAll / this.ItemCountPage);
      i++
    ) {
      this.pages.push(i);
    }
    this.select(this.Page);
    this.cItemCountPage.setValue(this.ItemCountPage);
  }

  previous() {
    if (this.cPage.value > 1) {
      this.select(this.cPage.value - 1);
    }
  }

  next() {
    if (this.cPage.value < this.pages.length) {
      this.select(this.cPage.value + 1);
    }
  }

  select(page: number) {
    if (this.cPage.value !== page && this.pages.find((p) => p === page)) {
      this.cPage.setValue(page);
      this.pageChangeEvent.emit(this.cPage.value);
    }
  }

  changeItemCountPage() {
    this.ItemCountPage = this.cItemCountPage.value;
    this.Page = 1; //quand on change le nombre d'éléments affichés sur la page, on reviens à la première page
    this.setPages();
    this.itemCountPageChangeEvent.emit(this.ItemCountPage);
  }
}
