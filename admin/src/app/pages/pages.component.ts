import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Page } from '../types';
import { PageService } from '../page.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.styl']
})
export class PagesComponent implements OnInit {
  public pages: Observable<Page[]>;

  constructor(private pageService: PageService) { }

  ngOnInit() {
    this.pages = this.pageService.getPages();
  }
}
