import { Component } from '@angular/core';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  title = 'RobJinman.com Admin Console';

  constructor(private authService: AuthService) {}

  authorised(): boolean {
    return this.authService.authorised();
  }

  logout() {
    this.authService.logout();
  }
}
