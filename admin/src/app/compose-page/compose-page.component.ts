import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { Page } from '../types';
import { PageService } from '../page.service';

@Component({
  selector: 'app-compose-page',
  templateUrl: './compose-page.component.html',
  styleUrls: ['./compose-page.component.styl']
})
export class ComposePageComponent implements OnInit {
  page: Page = {
    id: null,
    name: null,
    content: null
  };

  constructor(private route: ActivatedRoute,
              private pageService: PageService) { }

  ngOnInit() {
    this.page.name = this.route.snapshot.queryParams["name"];

    if (this.page.name) {
      this.pageService.getPage(this.page.name)
        .pipe(take(1))
        .subscribe(page => {
          this.page = page;
        });
    }
  }
}
