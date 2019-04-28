import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  title = 'Rob Jinman';

  constructor(matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    const menuPath = "assets/icons/ic_menu_48px.svg";
    const menuIcon = sanitizer.bypassSecurityTrustResourceUrl(menuPath);
    matIconRegistry.addSvgIcon("menu", menuIcon);
  }
}
