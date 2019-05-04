import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthService } from '../auth.service';
import { SUCCESS_SNACKBAR_OPTIONS, ERROR_SNACKBAR_OPTIONS } from '../utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    'email': new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(60)
    ]),
    'password': new FormControl('', [
      Validators.required
    ])
  });
  private captchaToken: string = '';

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  login() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    this.authService.adminLogin(email, password, this.captchaToken)
      .pipe(take(1))
      .subscribe(
        () => {
          this.snackBar.open('Access granted', 'Dismiss',
                             SUCCESS_SNACKBAR_OPTIONS);
        },
        () => {
          this.snackBar.open('Nice try, asshole', 'Dismiss',
                             ERROR_SNACKBAR_OPTIONS);
        }
      );
  }

  captchaComplete(token: string) {
    this.captchaToken = token;
    this.changeDetector.detectChanges();
  }

  formReady(): boolean {
    return this.loginForm.valid && this.captchaToken.length > 0;
  }

}
