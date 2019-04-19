import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router,
              private pageService: PageService) { }

  ngOnInit() {
    this.pages = this.pageService.getPages();
  }

  newPage() {
    this.router.navigate(['/compose-page']);
  }
}
