import { AbstractControl, ValidationErrors } from "@angular/forms"

export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: string = control.value || '';

  if (!value) {
    return null
  }

  // let upperCaseCharacters = /[A-Z]+/g
  // if (upperCaseCharacters.test(value) === false) {
  //   return { passwordStrength: `le mot de passe doit contenir des majuscules .` };
  // }

  // let lowerCaseCharacters = /[a-z]+/g
  // if (lowerCaseCharacters.test(value) === false) {
  //   return { passwordStrength: `le mot de passe doit contenir des minuscules .` };
  // }
  // let numberCharacters = /[0-9]+/g
  // if (numberCharacters.test(value) === false) {
  //   return { passwordStrength: `le mot de passe doit continuer les caractères numériques .` };
  // }

  // let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  // if (specialCharacters.test(value) === false) {
  //   return { passwordStrength: `le mot de passe doit contenir un caractère spécial .` };
  // }

  let CaseCharacters = /[A-z]+/g
  let numberCharacters = /[0-9]+/g
  if (CaseCharacters.test(value) === false || numberCharacters.test(value) === false)
    return {
      CaseCharacters: CaseCharacters.test(value) === false ? true : false,
      numberCharacters: numberCharacters.test(value) === false ? true : false,
    };

  return null;

}