import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { PageService } from '../page.service';
import { Page } from '../types';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.styl']
})
export class PageComponent implements OnInit {
  page: Page = null;

  constructor(private route: ActivatedRoute,
              private pageService: PageService) { }

  ngOnInit() {
    this.route.data
      .pipe(
        switchMap(data => this.pageService.getPage(data.pageName))
      )
      .subscribe(page => this.page = page);
  }
}
