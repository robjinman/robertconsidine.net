import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { take } from 'rxjs/operators';

import { IdentityService } from '../auth.service';
import { UserService } from '../user.service';
import { SUCCESS_SNACKBAR_OPTIONS, ERROR_SNACKBAR_OPTIONS } from '../utils';

function nonMatchingPasswordsValidator(control: FormGroup) {
  const pw1 = control.get('password1');
  const pw2 = control.get('password2');
  const valid = pw1.value === pw2.value;

  return valid ? null : { 'nonMatchingPasswords': true };
}

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.styl']
})
export class SecurityComponent implements OnInit {
  detailsForm = new FormGroup({
    'currentPassword': new FormControl('', [
      Validators.required
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
  userId: string;
  userName: string;
  oldEmail: string;

  constructor(private identityService: IdentityService,
              private userService: UserService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userName = this.identityService.userName;
    this.userService.getUser(this.userName)
      .pipe(take(1))
      .subscribe(user => {
        this.userId = user.id;
        this.oldEmail = user.email;
      });
  }

  submit() {
    const email = this.detailsForm.get('email').value;
    const currentPw = this.detailsForm.get('currentPassword').value;
    const newPw = this.detailsForm.get('password1').value;

    this.userService.updateUser(currentPw,
                                this.userId,
                                this.userName,
                                email,
                                newPw)
      .pipe(take(1))
      .subscribe(user => {
        this.detailsForm.clearValidators();
        this.oldEmail = user.email;
        this.snackBar.open("Updated your details", "Dismiss",
                           SUCCESS_SNACKBAR_OPTIONS);
      }, err => {
        this.snackBar.open(err.graphQLErrors[0].message, "Dismiss",
                           ERROR_SNACKBAR_OPTIONS);
      });
  }

  passwordsInvalid(): boolean {
    return this.detailsForm.get('password2').dirty && this.detailsForm.errors &&
           this.detailsForm.errors.nonMatchingPasswords;
  }

  formReady(): boolean {
    return this.detailsForm.valid;
  }
}
