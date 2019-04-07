import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { LoggingService } from '../logging.service';

@Component({
  selector: '.app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.styl']
})
export class LoggingComponent implements OnInit {
  @ViewChild('logWindow') logWindow: ElementRef;

  constructor(public logger: LoggingService) {
    this.logger.subject.subscribe(() => {
      let e = this.logWindow.nativeElement;
      e.scrollTop = e.scrollHeight;
    });
  }

  ngOnInit() { }
}
