import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  messages: string[] = []
  subject: Subject<string> = new Subject();

  constructor() { }

  add(message: string): void {
    this.messages.push(message);
    this.subject.next(message);
  }

  clear(): void {
    this.messages = [];
    this.subject.next(null);
  }
}
