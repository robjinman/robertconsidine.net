import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { take } from 'rxjs/operators';

import { MailService } from '../mail.service';
import { SUCCESS_SNACKBAR_OPTIONS, ERROR_SNACKBAR_OPTIONS } from '../utils';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.styl']
})
export class ContactComponent implements OnInit {
  contactForm = new FormGroup({
    'email': new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(60)
    ]),
    'subject': new FormControl('', [
      Validators.required
    ]),
    'message': new FormControl('', [
      Validators.required
    ])
  });
  private captchaToken: string = "";

  constructor(private changeDetector: ChangeDetectorRef,
              private mailService: MailService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  captchaComplete(token: string) {
    this.captchaToken = token;
    this.changeDetector.detectChanges();
  }

  formReady(): boolean {
    return this.contactForm.valid && this.captchaToken.length > 0;
  }

  send() {
    const email = this.contactForm.get('email').value;
    const subject = this.contactForm.get('subject').value;
    const message = this.contactForm.get('message').value;

    this.mailService.sendEmail(email, subject, message, this.captchaToken)
      .pipe(take(1))
      .subscribe(() => {
        this.snackBar.open("Email sent", "Dismiss", SUCCESS_SNACKBAR_OPTIONS);
      }, err => {
        this.snackBar.open("Error sending email", "Dismiss",
                           ERROR_SNACKBAR_OPTIONS);
      });
  }
}
