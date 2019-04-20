import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../auth.service';
import { SUCCESS_SNACKBAR_OPTIONS, ERROR_SNACKBAR_OPTIONS } from '../utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {
  email: string = null;
  password: string = null;

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar) { }

  login() {
    this.authService.login(this.email, this.password)
      .pipe(take(1))
      .subscribe(
        () => {
          this.snackBar.open("Access granted", "Dismiss",
                             SUCCESS_SNACKBAR_OPTIONS);
        },
        () => {
          this.snackBar.open("Nice try, asshole", "Dismiss",
                             ERROR_SNACKBAR_OPTIONS);
        }
      );
  }

  ngOnInit() {
  }

}
