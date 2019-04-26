import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

const RECAPTCHA_SITE_KEY = '6LcnFqAUAAAAAFxvOBDeTSX08laQ9buoJ6KRd26O';
declare var grecaptcha: any;

interface PendingContruction {
  elementId: string;
  onSuccess: Function;
}

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private _ready: boolean = false;
  private _pending: PendingContruction = null;
  private _subject: Subject<number> = new Subject();

  constructor() {
    if (document.getElementById('recaptcha') !== null) {
      console.warn('Captcha script already on page');
      return;
    }

    let element = document.createElement('script');
    element.id = 'recaptcha';
    element.type = 'text/javascript';
    element.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    element.onload = () => {
      grecaptcha.ready(() => this._doRender());
    };
    document.body.appendChild(element);
  }

  render(id: string, onSuccess: Function): Observable<number> {
    if (this._ready) {
      this._subject.next(this._constructCaptcha(id, onSuccess));
    }
    else {
      this._pending = {
        elementId: id,
        onSuccess: onSuccess
      };
    }

    return this._subject;
  }

  private _constructCaptcha(elementId: string, onSuccess: Function): number {
    return grecaptcha.render(elementId, {
      'sitekey': RECAPTCHA_SITE_KEY,
      'callback': onSuccess
    });
  }

  private _doRender() {
    const id = this._constructCaptcha(this._pending.elementId,
                                      this._pending.onSuccess);
    this._subject.next(id);
    this._ready = true;
  }
}
