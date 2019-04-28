import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../auth.service';
import { SUCCESS_SNACKBAR_OPTIONS, ERROR_SNACKBAR_OPTIONS } from '../utils';
import { AnalyticsService } from '../analytics.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    'email': new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    'password': new FormControl('', [
      Validators.required
    ])
  });

  constructor(private analytics: AnalyticsService,
              private authService: AuthService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  login() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.authService.login(email, password)
      .pipe(take(1))
      .subscribe(
        () => {
          this.analytics.fireEvent('login', 'accounts', 'success');
          this.snackBar.open('You are logged in', 'Dismiss',
                             SUCCESS_SNACKBAR_OPTIONS);
        },
        () => {
          this.analytics.fireEvent('login', 'accounts', 'failure');
          this.snackBar.open('Invalid credentials', 'Dismiss',
                             ERROR_SNACKBAR_OPTIONS);
        }
      );
  }
}
