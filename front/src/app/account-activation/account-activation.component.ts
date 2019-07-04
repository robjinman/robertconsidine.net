import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../auth.service';
import { AnalyticsService } from '../analytics.service';
import {
  SUCCESS_SNACKBAR_OPTIONS,
  ERROR_SNACKBAR_OPTIONS
} from '../utils';

enum ActivationStatus {
  PENDING,
  SUCCESS,
  FAILURE
}

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.styl'],
  host: {
    class: 'subview'
  }
})
export class AccountActivationComponent implements OnInit {
  Status = ActivationStatus;
  activationStatus: ActivationStatus = ActivationStatus.PENDING;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private analytics: AnalyticsService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    const userId = this.route.snapshot.queryParams['user'];
    const code = this.route.snapshot.queryParams['code'];

    this.authService.activateAccount(userId, code)
      .pipe(take(1))
      .subscribe(
        () => {
          this.analytics.fireEvent('activate_account', 'accounts', 'success');
          this.snackBar.open("Account activation success", "Dismiss",
                             SUCCESS_SNACKBAR_OPTIONS);
          this.activationStatus = ActivationStatus.SUCCESS;
          this.redirect();
        },
        err => {
          let msg = "An error occurred";
          if (err.graphQLErrors[0]) {
            msg = err.graphQLErrors[0].message;
          }
          this.analytics.fireEvent('activate_account', 'accounts', 'failure');
          this.snackBar.open(msg, "Dismiss", ERROR_SNACKBAR_OPTIONS);
          this.activationStatus = ActivationStatus.FAILURE;
          this.redirect();
        }
      );
  }

  redirect() {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }
}
