import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  title = 'RobertConsidine.net Admin Console';
  currentYear = (new Date()).getFullYear();

  constructor(private authService: AuthService,
              private matIconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {

    this.addIcon("delete", "ic_delete_48px.svg");
    this.addIcon("copy", "ic_content_copy_48px.svg");
  }

  addIcon(alias: string, fileName: string) {
    const path = "assets/icons/" + fileName;
    const icon = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    this.matIconRegistry.addSvgIcon(alias, icon);
  }

  authorised(): boolean {
    return this.authService.authorised();
  }

  logout() {
    this.authService.logout();
  }
}
