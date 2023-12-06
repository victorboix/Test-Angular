import { FormControl, ValidatorFn } from "@angular/forms";
import { NumberValidators } from "./number.validator";

describe("the isANumber validator", () => {
  let validatorFn: ValidatorFn;

  beforeEach(() => {
    validatorFn = NumberValidators.isANumberValidate();
  });

  it("returns null if control is empty string", () => {
    const control = new FormControl("");
    expect(validatorFn(control)).toBeNull();
  });

  it("returns null if control is number", () => {
    const control = new FormControl(1);
    expect(validatorFn(control)).toBeNull();
  });

  it("returns isNotNumber if control is decimal", () => {
    const control = new FormControl(1.5);
    expect(validatorFn(control)!["isNotNumber"]).toBeTrue();
  });

  it("returns isNotNumber if control is string", () => {
    const control = new FormControl("test");
    expect(validatorFn(control)!["isNotNumber"]).toBeTrue();
  });
});
