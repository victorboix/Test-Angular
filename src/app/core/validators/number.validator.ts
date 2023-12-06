import { Injectable } from "@angular/core";
import { AbstractControl, ValidatorFn } from "@angular/forms";

@Injectable()
export class NumberValidators {
  //validateur permetant de vérifier qu'un control est bien un entier
  static isANumberValidate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      // si la valeur n'est pas un entier
      if (value % 1 !== 0) {
        return { isNotNumber: true };
      }

      return null;
    };
  }
}
