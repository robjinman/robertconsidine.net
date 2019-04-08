import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {
  email: string = null;
  password: string = null;

  constructor(private authService: AuthService) { }

  login(): void {
    this.authService.login(this.email, this.password)
      .pipe(take(1))
      .subscribe();
  }

  ngOnInit() {
  }

}
