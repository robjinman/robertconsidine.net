import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {
  public open: boolean = false;
  private routerSub: Subscription;

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.open = false;
      }
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  toggleMenu() {
    this.open = !this.open;
  }

  navigateTo(route: string, $event: any) {
    this.open = false;
    this.router.navigate([route]);

    $event.stopPropagation();
  }

  logout() {
    this.authService.logout();
  }
}
