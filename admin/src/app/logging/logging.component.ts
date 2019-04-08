import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoggingService } from '../logging.service';

@Component({
  selector: '.app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.styl']
})
export class LoggingComponent implements OnInit {
  private subscription: Subscription;
  @ViewChild('logWindow') logWindow: ElementRef;

  constructor(public logger: LoggingService) {
    this.subscription = this.logger.subject.subscribe(() => {
      let e = this.logWindow.nativeElement;
      e.scrollTop = e.scrollHeight;
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
