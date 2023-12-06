import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { PaginationComponent } from "./pagination.component";

describe("PaginationComponent", () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let component: PaginationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PaginationComponent],
    });

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;

    component.ItemCountAll = 100;
    component.Page = 1;
    component.ItemCountPage = 20;

    component.setPages();
  });

  it("should have 5 pages", () => {
    expect(component.pages.length).toEqual(5);
  });

  it("should be able to set page 3", () => {
    component.select(3);
    expect(component.cPage.value).toEqual(3);
  });

  it(`shouldn't be able to set page 6`, () => {
    component.select(6);
    expect(component.cPage.value).toEqual(1);
  });

  it("should be able to go to previous when on page 3 and go to page 2", () => {
    component.select(3);
    component.previous();
    expect(component.cPage.value).toEqual(2);
  });

  it(`shouldn't be able to go to previous when on page 1 and stay on page 1`, () => {
    component.previous();
    expect(component.cPage.value).toEqual(1);
  });

  it("should be able to go to next when on page 3 and go to page 4", () => {
    component.select(3);
    component.next();
    expect(component.cPage.value).toEqual(4);
  });

  it(`shouldn't be able to go to next when on page 5 and stay on page 5`, () => {
    component.select(5);
    component.next();
    expect(component.cPage.value).toEqual(5);
  });

  it("should change the value of ItemCountPage to 10 on select first in selectItemCountPage and Page to be 1", async(() => {
    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.debugElement.query(
      By.css("#selectItemCountPage"),
    ).nativeElement;
    select.value = select.options[0].value;
    select.dispatchEvent(new Event("change"));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const itemCountPage = select.options[0].text;
      expect(itemCountPage).toBe("10");
      expect(component.Page).toBe(1);
    });
  }));

  it("should emit pageChangeEvent on select page 2", () => {
    let pageEmited = false;

    component.pageChangeEvent.subscribe((value: number) => {
      if (value === 2) {
        pageEmited = true;
      }
    });

    component.select(2);

    expect(pageEmited).toBeTruthy();
  });

  it(`shouldn't emit pageChangeEvent on select page 1`, () => {
    let pageEmited = false;

    component.pageChangeEvent.subscribe((value: number) => {
      if (value === 1) {
        pageEmited = true;
      }
    });

    component.select(1);

    expect(pageEmited).toBeFalsy();
  });

  it("should emit itemCountPageChangeEvent with value 10 on select first in selectItemCountPage", async(() => {
    let itemCountPageEmited = false;

    component.itemCountPageChangeEvent.subscribe((value: number) => {
      if (value === 10) {
        itemCountPageEmited = true;
      }
    });

    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.debugElement.query(
      By.css("#selectItemCountPage"),
    ).nativeElement;
    select.value = select.options[0].value;
    select.dispatchEvent(new Event("change"));

    expect(itemCountPageEmited).toBeTruthy();
  }));

  it(`shouldn't emit itemCountPageChangeEvent with value 20 on select second in selectItemCountPage`, async(() => {
    let itemCountPageEmited = false;

    component.itemCountPageChangeEvent.subscribe((value: number) => {
      if (value === 20) {
        itemCountPageEmited = true;
      }
    });

    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.debugElement.query(
      By.css("#selectItemCountPage"),
    ).nativeElement;
    select.value = select.options[0].value;
    select.dispatchEvent(new Event("change"));

    expect(itemCountPageEmited).toBeFalsy();
  }));
});
