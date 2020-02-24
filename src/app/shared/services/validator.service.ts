import { Injectable } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  get emailValidator(): ValidatorFn {
    return Validators.pattern(
      '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    );
  }

  get phoneValidator(): ValidatorFn {
    return Validators.pattern('^([0-9]+-*[0-9]*)+$');
  }
}
