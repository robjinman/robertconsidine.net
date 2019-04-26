import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CaptchaService } from '../captcha.service';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.styl']
})
export class CaptchaComponent implements OnInit {
  @Input() uniqueId: string;
  @Output() captchaComplete = new EventEmitter();

  constructor(private captchaService: CaptchaService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.captchaService.render(this.uniqueId, (result: string) => {
      this.captchaComplete.emit(result);
    });
  }

}
