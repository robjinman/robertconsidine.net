import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.styl']
})
export class SignupComponent implements OnInit {
  email: string = null;
  password1: string = null;
  password2: string = null;
  name: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  
  signup() {
    const pw = this.password1;
    // TODO

    this.authService.signup(this.email, pw, this.name);
  }
}
