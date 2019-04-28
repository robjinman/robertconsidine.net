import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var gtag: any;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(x => x instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.fireEvent('pageview', 'navigation');
      });
  }

  fireEvent(action: string,
            category: string = null,
            label: string = null,
            value: number = null) {

    gtag('config', 'GA_MEASUREMENT_ID', {
      'page_path': this.router.url
    });
    gtag('event', action, {
      'event_category': category,
      'event_label': label,
      'value': value
    });
  }
}
