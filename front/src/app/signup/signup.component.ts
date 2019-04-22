import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { AuthService } from '../auth.service';

function nonMatchingPasswordsValidator(control: FormGroup) {
  const pw1 = control.get('password1');
  const pw2 = control.get('password2');
  const valid = pw1.value === pw2.value;

  return valid ? null : { 'nonMatchingPasswords': true };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.styl']
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    'name': new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(40),
      Validators.pattern('[a-zA-Z]+[a-zA-Z0-9]*')
    ]),
    'email': new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(60)
    ]),
    'password1': new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50)
    ]),
    'password2': new FormControl('', [
      Validators.required
    ])
  }, [ nonMatchingPasswordsValidator ]);

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  
  passwordsInvalid(): boolean {
    return this.signupForm.get('password2').dirty && this.signupForm.errors &&
           this.signupForm.errors.nonMatchingPasswords;
  }

  signup() {
    const pw = this.signupForm.get('password1').value;
    const email = this.signupForm.get('email').value;
    const name = this.signupForm.get('name').value;

    this.authService.signup(email, pw, name);
  }
}
